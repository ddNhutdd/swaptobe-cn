/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Pagination, Empty, Spin } from "antd";
import {
  addClassToElementById,
  getClassListFromElementById,
  getElementById,
} from "src/util/common";
import { api_status } from "src/constant";
import {
  getListAdsBuyPenddingToUser,
  getListAdsBuyToUser,
  getListAdsSellPenddingToUser,
  getListAdsSellToUser,
} from "src/util/userCallApi";
function AdsHistory() {
  const actionType = {
    buy: "Buy",
    sell: "Sell",
  };
  const closeEmpty = function () {
    addClassToElementById("adsHistoryEmpty", "--d-none");
  };
  const showEmpty = function () {
    getClassListFromElementById("adsHistoryEmpty").remove("--d-none");
  };
  const closeSpinner = function () {
    addClassToElementById("adsHistorySpinner", "--d-none");
  };
  const showSpinner = function () {
    getClassListFromElementById("adsHistorySpinner").remove("--d-none");
  };
  const closeContent = function () {
    addClassToElementById("ads-history__content", "--d-none");
  };
  const showContent = function () {
    getClassListFromElementById("ads-history__content").remove("--d-none");
  };
  const toggleActionMenu = function (e) {
    e.stopPropagation();
    if (
      getClassListFromElementById("adsHistoryDropdownSelected").contains(
        "disabled"
      )
    )
      return;
    getClassListFromElementById("adsHistoryDropdownSelected").toggle("active");
    getClassListFromElementById("adsHistoryDropDownMenu").toggle("show");
  };
  const closeActionMenu = function () {
    getClassListFromElementById("adsHistoryDropdownSelected").remove("active");
    getClassListFromElementById("adsHistoryDropDownMenu").remove("show");
  };
  const fetchListAdsSellToUser = function () {
    return new Promise((resolve) => {
      if (callApiStatus.current === api_status.fetching) resolve({});
      else callApiStatus.current = api_status.fetching;
      getListAdsSellToUser({
        limit: limit.current,
        page: page.current,
      })
        .then((resp) => {
          callApiStatus.current = api_status.fulfilled;
          resolve(resp.data.data);
        })
        .catch((error) => {
          callApiStatus.current = api_status.rejected;
          console.log(error);
          resolve({});
        });
    });
  };
  const fetchListAdsBuyToUser = function () {
    return new Promise((resolve) => {
      if (callApiStatus.current === api_status.fetching) {
        return resolve({});
      } else {
        callApiStatus.current = api_status.fetching;
      }
      getListAdsBuyToUser({
        limit: limit.current,
        page: page.current,
      })
        .then((resp) => {
          callApiStatus.current = api_status.fulfilled;
          return resolve(resp.data.data);
        })
        .catch((error) => {
          callApiStatus.current = api_status.rejected;
          console.log(error);
          return resolve({});
        });
    });
  };
  const fetchListAdsBuyPenddingToUser = function () {
    return new Promise((resolve) => {
      if (callApiStatus.current === api_status.fetching) {
        return resolve({});
      } else {
        callApiStatus.current = api_status.fetching;
      }
      getListAdsBuyPenddingToUser({
        limit: limit.current,
        page: page.current,
      })
        .then((resp) => {
          callApiStatus.current = api_status.fulfilled;
          return resolve(resp.data.data);
        })
        .catch((error) => {
          callApiStatus.current = api_status.rejected;
          console.log(error);
          return resolve({});
        });
    });
  };
  const fetchListAdsSellPenddingToUser = function () {
    return new Promise((resolve) => {
      if (callApiStatus.current === api_status.fetching) {
        return resolve({});
      }
      getListAdsSellPenddingToUser({ limit: limit.current, page: page.current })
        .then((resp) => {
          callApiStatus.current = api_status.fulfilled;
          return resolve(resp.data.data);
        })
        .catch((error) => {
          console.log(error);
          callApiStatus.current = api_status.rejected;
          return resolve({});
        });
    });
  };
  const disableFilter = function () {
    addClassToElementById("adsHistoryDropdownSelected", "disabled");
    getElementById("pendingCheckbox").disabled = true;
  };
  const enableFilter = function () {
    getClassListFromElementById("adsHistoryDropdownSelected").remove(
      "disabled"
    );
    getElementById("pendingCheckbox").disabled = false;
  };
  const renderTable = async function (fn) {
    closeContent();
    closeEmpty();
    showSpinner();
    disableFilter();
    const containerElement = getElementById("ads-history__content");
    containerElement.innerHTML = "";
    const { array: apiRes, total } = await fn();
    closeSpinner();
    enableFilter();
    if (!apiRes || apiRes.length <= 0) {
      showEmpty();
      return;
    } else {
      for (const item of apiRes) {
        containerElement.innerHTML += `<div class="box fadeInBottomToTop ads-history__record">
        <div>
          <table>
            <tbody>
              <tr>
                <td>User Name:</td>
                <td>${item.userName}</td>
              </tr>
              <tr>
                <td>Bank Name:</td>
                <td>${item.bankName}</td>
              </tr>
              <tr>
                <td>Account Name:</td>
                <td>${item.ownerAccount}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <table>
            <tbody>
              <tr>
                <td>Account Number:</td>
                <td>${item.numberBank}</td>
              </tr>
              <tr>
                <td>Amount:</td>
                <td>${item.amount}</td>
              </tr>
              <tr>
                <td>Amount Minimum:</td>
                <td>${item.amountMinimum}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <table>
            <tbody>
              <tr>
                <td>Created At:</td>
                <td>${item.created_at}</td>
              </tr>
              <tr>
                <td>Address Wallet:</td>
                <td>${item.addressWallet}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>`;
      }
      showContent();
    }
    // set total items
    setTotalItem(total);
  };
  const dropdownActionItemSelect = function (act) {
    action.current = act;
    getElementById("adsHistoryDropdownSelectedText").innerHTML = act;
    page.current = 1;
    loadData();
  };
  const loadData = function () {
    const act = action.current;
    const pending = getElementById("pendingCheckbox").checked;
    if (act === actionType.buy) {
      if (pending) {
        renderTable(fetchListAdsBuyPenddingToUser);
      } else if (!pending) {
        renderTable(fetchListAdsBuyToUser);
      }
    } else if (act === actionType.sell) {
      if (pending) {
        renderTable(fetchListAdsSellPenddingToUser);
      } else {
        renderTable(fetchListAdsSellToUser);
      }
    }
  };
  const pageChangeHandle = function (pag) {
    page.current = pag;
    loadData();
  };
  const pendingCheckboxChangeHandle = function () {
    loadData();
  };
  useEffect(() => {
    document.addEventListener("click", closeActionMenu);
    renderTable(fetchListAdsBuyToUser);
    return () => {
      document.removeEventListener("click", closeActionMenu);
    };
  }, []);
  const callApiStatus = useRef(api_status.pending);
  const page = useRef(1);
  const limit = useRef(10);
  const [totalItem, setTotalItem] = useState(0);
  const action = useRef(actionType.buy);
  return (
    <div className="ads-history">
      <div className="container">
        <div className="box ads-history__filter">
          <h3>Filter</h3>
          <table>
            <tbody>
              <tr>
                <td>
                  <div>Action: </div>
                </td>
                <td>
                  <div
                    id="adsHistoryDropdownSelected"
                    onClick={toggleActionMenu}
                    className="ads-history__dropdown-selected"
                  >
                    <span id="adsHistoryDropdownSelectedText">Buy</span>
                    <span>
                      <i className="fa-solid fa-angle-down"></i>
                    </span>
                  </div>
                  <div
                    id="adsHistoryDropDownMenu"
                    className="ads-history__dropdown-menu-container"
                  >
                    <div className="dropdown-menu">
                      <div
                        onClick={dropdownActionItemSelect.bind(
                          null,
                          actionType.sell
                        )}
                        className="dropdown-item"
                      >
                        Sell
                      </div>
                      <div
                        onClick={dropdownActionItemSelect.bind(
                          null,
                          actionType.buy
                        )}
                        className="dropdown-item"
                      >
                        Buy
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="pendingCheckbox">Pending:</label>
                </td>
                <td>
                  <input
                    onChange={pendingCheckboxChangeHandle}
                    id="pendingCheckbox"
                    type="checkbox"
                    className="--d-none"
                  />
                  <label
                    className="ads-history__checkbox"
                    htmlFor="pendingCheckbox"
                  >
                    <div className="ads-history__square">
                      <i className="fa-solid fa-check"></i>
                    </div>
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="box ads-history__content">
          <h3>
            List <span>Sell</span>
          </h3>
          <div id="ads-history__content">
            <div className="box fadeInBottomToTop ads-history__record">
              <div>
                <table>
                  <tbody>
                    <tr>
                      <td>User Name:</td>
                      <td>test</td>
                    </tr>
                    <tr>
                      <td>Bank Name:</td>
                      <td>Vietcombank</td>
                    </tr>
                    <tr>
                      <td>Name:</td>
                      <td>Vietcombank</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <table>
                  <tbody>
                    <tr>
                      <td>Account Number:</td>
                      <td>test</td>
                    </tr>
                    <tr>
                      <td>Amount:</td>
                      <td>Vietcombank</td>
                    </tr>
                    <tr>
                      <td>Amount Minimum:</td>
                      <td>Vietcombank</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <table>
                  <tbody>
                    <tr>
                      <td>Created At:</td>
                      <td>test</td>
                    </tr>
                    <tr>
                      <td>Address Wallet:</td>
                      <td>Vietcombank</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div id="adsHistoryEmpty" className="spin-container --d-none">
            <Empty />
          </div>
          <div id="adsHistorySpinner" className="spin-container --d-none">
            <Spin />
          </div>
          <div className="ads-history__paging">
            <Pagination
              defaultCurrent={1}
              showSizeChanger={false}
              total={totalItem}
              onChange={pageChangeHandle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdsHistory;
