/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Pagination, Empty, Spin } from "antd";
import { useHistory } from "react-router-dom";
import i18n from "src/translation/i18n";
import { useTranslation } from "react-i18next";
import {
  addClassToElementById,
  getClassListFromElementById,
  getElementById,
  getLocalStorage,
  hideElement,
  roundDecimalValues,
  showElement,
} from "src/util/common";
import {
  api_status,
  defaultLanguage,
  localStorageVariable,
  url,
} from "src/constant";
import {
  getInfoP2p,
  getListAdsBuyPenddingToUser,
  getListAdsBuyToUser,
  getListAdsSellPenddingToUser,
  getListAdsSellToUser,
} from "src/util/userCallApi";
import socket from "src/util/socket";
function AdsHistory() {
  useEffect(() => {
    const language =
      getLocalStorage(localStorageVariable.lng) || defaultLanguage;
    i18n.changeLanguage(language);
    // get list coin
    closeContent();
    closeEmpty();
    showSpinner();
    fetchListCoin().then((resp) => {
      renderTable(1, fetchListAdsBuyToUser);
    });
  }, []);
  const history = useHistory();
  const callApiStatus = useRef(api_status.pending);
  const listCoin = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = useRef(10);
  const [totalItem, setTotalItem] = useState(0);
  const { t } = useTranslation();
  const [listRecord, setListRecord] = useState([]);
  const actionType = {
    buy: t("buy"),
    sell: t("sell"),
  };
  const [tabActive, setTabActive] = useState(actionType.buy);
  const action = useRef(actionType.buy);
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
  const fetchListAdsSellToUser = function (page) {
    return new Promise((resolve) => {
      if (callApiStatus.current === api_status.fetching) resolve({});
      else callApiStatus.current = api_status.fetching;
      getListAdsSellToUser({
        limit: limit.current,
        page: page,
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
  const fetchListAdsBuyToUser = function (page) {
    return new Promise((resolve) => {
      if (callApiStatus.current === api_status.fetching) {
        return resolve({});
      } else {
        callApiStatus.current = api_status.fetching;
      }
      getListAdsBuyToUser({
        limit: limit.current,
        page: page,
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
  const fetchListAdsBuyPenddingToUser = function (page) {
    return new Promise((resolve) => {
      if (callApiStatus.current === api_status.fetching) {
        return resolve({});
      } else {
        callApiStatus.current = api_status.fetching;
      }
      getListAdsBuyPenddingToUser({
        limit: limit.current,
        page: page,
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
  const fetchListAdsSellPenddingToUser = function (page) {
    return new Promise((resolve) => {
      if (callApiStatus.current === api_status.fetching) {
        return resolve({});
      }
      getListAdsSellPenddingToUser({
        limit: limit.current,
        page: page,
      })
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
    getElementById("pendingCheckbox").disabled = true;
  };
  const enableFilter = function () {
    getElementById("pendingCheckbox").disabled = false;
  };
  const renderTable = async function (page, fn) {
    closeContent();
    closeEmpty();
    showSpinner();
    disableFilter();
    if (!fn) {
      closeSpinner();
      closeContent();
      showEmpty();
      return;
    }
    const { array: apiRes, total } = await fn(page);
    closeSpinner();
    enableFilter();
    if (!apiRes || apiRes.length <= 0) {
      closeContent();
      closeSpinner();
      showEmpty();
      return;
    } else {
      const listRecord = [];
      for (const item of apiRes) {
        const price = listCoin.current.find(
          (c) => c.name === item.symbol
        ).price;
        listRecord.push(
          <div
            key={item.id}
            className="box fadeInBottomToTop ads-history__record"
          >
            <div>
              <table>
                <tbody>
                  <tr>
                    <td>{t("userName")}:</td>
                    <td>{item.userName}</td>
                  </tr>
                  <tr>
                    <td>{t("bankName")}:</td>
                    <td>{item.bankName}</td>
                  </tr>
                  <tr>
                    <td>{t("accountName")}:</td>
                    <td>{item.ownerAccount}</td>
                  </tr>
                  <tr>
                    <td>{t("accountNumber")}:</td>
                    <td>{item.numberBank}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <table>
                <tbody>
                  <tr>
                    <td>{t("amount")}:</td>
                    <td>{item.amount}</td>
                  </tr>
                  <tr>
                    <td>{t("amountMinimum")}:</td>
                    <td>{item.amountMinimum}</td>
                  </tr>
                  <tr>
                    <td>{t("createdAt")}:</td>
                    <td>{item.created_at}</td>
                  </tr>
                  <tr>
                    <td>{t("coin")}: </td>
                    <td>{item.symbol}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <table>
                <tbody>
                  <tr>
                    <td>Quantity Remaining:</td>
                    <td>
                      {Number(
                        roundDecimalValues(
                          item.amount - item.amountSuccess,
                          price
                        )
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="ads-history-action"
                      id={"adsHistoryAction" + item.id}
                      colSpan="2"
                    >
                      <div
                        className="spin-container"
                        id={"adsHistoryActionSpinner" + item.id}
                      >
                        <Spin />
                      </div>
                      <div
                        className="spin-container --d-none"
                        id={"adsHistoryActionButton" + item.id}
                      >
                        <button onClick={redirectConfirm.bind(null, item.id)}>
                          Check
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      }
      setListRecord(() => listRecord);
      showContent();
    }
    //
    const listId = apiRes.map((item) => item.id);
    fetchMultiApiGetInfoP2p(listId);
    // set total items
    setTotalItem(total);
  };
  const actionFulfilled = function (id) {
    const loader = getElementById("adsHistoryActionSpinner" + id);
    const btn = getElementById("adsHistoryActionButton" + id);
    if (!loader || !btn) return;
    hideElement(loader);
    showElement(btn);
  };
  const actionRejected = function (id) {
    const loader = getElementById("adsHistoryActionSpinner" + id);
    const btn = getElementById("adsHistoryActionButton" + id);
    if (!loader || !btn) return;
    hideElement(loader);
    hideElement(btn);
  };
  const loadData = function (page) {
    const act = action.current;
    const pending = getElementById("pendingCheckbox").checked;
    if (act === actionType.buy) {
      if (pending) {
        renderTable(page, fetchListAdsBuyPenddingToUser);
      } else if (!pending) {
        renderTable(page, fetchListAdsBuyToUser);
      }
    } else if (act === actionType.sell) {
      if (pending) {
        renderTable(page, fetchListAdsSellPenddingToUser);
      } else {
        renderTable(page, fetchListAdsSellToUser);
      }
    }
  };
  const pageChangeHandle = function (pag) {
    setCurrentPage(() => pag);
    loadData(pag);
  };
  const pendingCheckboxChangeHandle = function () {
    setCurrentPage(1);
    loadData(1);
  };
  const tabChangeHandle = function (e) {
    const selected = e.target.textContent;
    if (selected === actionType.sell) {
      action.current = actionType.sell;
      setTabActive(() => actionType.sell);
    } else if (selected === actionType.buy) {
      action.current = actionType.buy;
      setTabActive(() => actionType.buy);
    }
    loadData(1);
  };
  /**
   * If there is no returned data, the api informs the core
   * The function both calls the api and renders the action
   * @param {number | string} id AdsId
   * @returns Promise
   */
  const fetchApiGetInfoP2p = function (id) {
    return new Promise((resolve, reject) => {
      getInfoP2p({
        idP2p: id,
      })
        .then((resp) => {
          actionFulfilled(id);
          resolve(true);
        })
        .catch((error) => {
          actionRejected(id);
          resolve(null);
        });
    });
  };
  const fetchMultiApiGetInfoP2p = function (listId) {
    for (const id of listId) {
      fetchApiGetInfoP2p(id);
    }
  };
  const fetchListCoin = function () {
    return new Promise((resolve) => {
      socket.once("listCoin", (resp) => {
        listCoin.current = resp;
        resolve(resp);
      });
    });
  };
  const redirectConfirm = function (id) {
    history.push(url.confirm.replace(":id", id));
  };
  return (
    <div className="ads-history">
      <div className="container">
        <div className="box ads-history__content">
          <div className="ads-history__filter">
            <div className="ads-history__filter-tabs-container">
              <div
                onClick={tabChangeHandle}
                className={`ads-history__filter-tabs ${
                  tabActive === actionType.buy ? "active" : ""
                }`}
              >
                {t("buy")}
              </div>
              <div
                onClick={tabChangeHandle}
                className={`ads-history__filter-tabs ${
                  tabActive === actionType.sell ? "active" : ""
                }`}
              >
                {t("sell")}
              </div>
            </div>
            <div>
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
                <label htmlFor="pendingCheckbox">{t("pending")}:</label>
                <div className="ads-history__square">
                  <i className="fa-solid fa-check"></i>
                </div>
              </label>
            </div>
          </div>
          <h3>
            {t("list")} advertisement{" "}
            <span id="adsTypeList">{action.current}</span>
          </h3>
          <div id="ads-history__content">{listRecord}</div>
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
              current={currentPage}
              onChange={pageChangeHandle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdsHistory;
