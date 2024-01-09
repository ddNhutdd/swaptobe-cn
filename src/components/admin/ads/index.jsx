/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Pagination, Spin, Modal } from "antd";
import {
  addClassToElementById,
  getClassListFromElementById,
  getElementById,
} from "src/util/common";
import socket from "src/util/socket";
import { DOMAIN } from "src/util/service";
import { api_status } from "src/constant";
import {
  confirmAds,
  getAdsToWhere,
  getAllAds,
  getAllAdsPending,
  refuseAds,
} from "src/util/adminCallApi";
import { callToastError, callToastSuccess } from "src/function/toast/callToast";
import { EmptyCustom } from "src/components/Common/Empty";

function Ads() {
  const actionType = {
    all: "All",
    buy: "Buy",
    sell: "Sell",
  };
  const [isModalCoinOpen, setIsModalCoinOpen] = useState(false);
  const [totalItem, setTotalItem] = useState(1);
  const action = useRef("All"); //filter
  const listCoin = useRef([]);
  const selectedCoin = useRef("All");
  const callApiLoadTableStatus = useRef(api_status.pending);
  const callApiConfirmAdsStatus = useRef(api_status.pending);
  const limit = useRef(10);
  const [page, setPage] = useState(1);
  useEffect(() => {
    document.addEventListener("click", closeDropdownAction);
    //
    disableDropdownCoin();
    //
    socket.once("listCoin", (resp) => {
      listCoin.current = [{ name: "All" }, ...resp];
      const element = getElementById("modalCoinContent"); // check modal rendered
      if (element) {
        renderListCoin(listCoin);
      }
    });
    //
    renderTable(fetchAllAds);
    return () => {
      document.removeEventListener("click", closeDropdownAction);
    };
  }, []);
  const toggleDropdownAction = function (e) {
    e.stopPropagation();
    if (
      getClassListFromElementById("dropdownActionSelected").contains("disabled")
    ) {
      return;
    }
    getClassListFromElementById("dropdownActionMenu").toggle("show");
    getClassListFromElementById("dropdownActionSelected").toggle("active");
  };
  const closeDropdownAction = function () {
    getClassListFromElementById("dropdownActionMenu").remove("show");
    getClassListFromElementById("dropdownActionSelected").remove("active");
  };
  const dropdownActionItemClickHandle = function (e) {
    action.current = e.target.innerHTML;
    dropdownActionSelect(action.current);
    setPage(1);
    loadData();
  };
  const dropdownActionSelect = function (action) {
    const classActive = "active";
    const containerElement = getElementById("dropdownActionMenu");
    for (const item of containerElement.children) {
      if (item.innerHTML !== action) {
        item.classList.remove(classActive);
      } else {
        item.classList.contains(classActive) || item.classList.add(classActive);
      }
    }
    getElementById("dropdownActionSelected").querySelector(
      ".admin__dropdown-text"
    ).innerHTML = action;
    //
    if (action === "All") disableDropdownCoin();
    else enableDropdownCoin();
  };
  const showModalCoin = () => {
    if (
      getClassListFromElementById("dropdownCoinSelected").contains("disabled")
    )
      return;
    setIsModalCoinOpen(true);
    setTimeout(() => {
      renderListCoin(listCoin);
    }, 0);
  };
  const handleCancelModalCoin = () => {
    setIsModalCoinOpen(false);
  };
  const disableDropdownCoin = function () {
    addClassToElementById("dropdownCoinSelected", "disabled");
  };
  const enableDropdownCoin = function () {
    getClassListFromElementById("dropdownCoinSelected").remove("disabled");
  };
  const disableDropdownAction = function () {
    addClassToElementById("dropdownActionSelected", "disabled");
  };
  const enableDropdownAction = function () {
    getClassListFromElementById("dropdownActionSelected").remove("disabled");
  };
  const disablePendingCheckBox = function () {
    getElementById("pendingCheckbox").disabled = true;
  };
  const enablePendingCheckBox = function () {
    getElementById("pendingCheckbox").disabled = false;
  };
  const disableFilter = function () {
    disableDropdownAction();
    disablePendingCheckBox();
    disableDropdownCoin();
  };
  const enableFilter = function () {
    enableDropdownAction();
    enablePendingCheckBox();
    if (action.current === actionType.all) {
      disableDropdownCoin();
    } else {
      enableDropdownCoin();
    }
  };
  const renderListCoin = function (listCoin) {
    const element = getElementById("modalCoinContent");
    element.innerHTML = "";
    if (!listCoin.current || listCoin.current.length <= 0) {
      showModalSpinner();
      return;
    } else {
      closeModalSpinner();
    }
    for (const { name, image } of listCoin.current) {
      element.innerHTML += `<span class="ads-modal-coin-content__item ${
        selectedCoin.current === name ? "active" : ""
      }">
        <span class="ads-modal-coin-content__img ${
          name === "All" ? "--d-none" : ""
        }">
          <img src="${DOMAIN + image}" alt="${name}" />
        </span>
        <span class="ads-modal-coin-content__text">${name}</span>
      </span>`;
    }
    //add event
    for (const item of element.children) {
      const name = item.querySelector(
        ".ads-modal-coin-content__text"
      ).innerHTML;
      item.addEventListener("click", coinSelectHandle.bind(null, name));
    }
  };
  const coinSelectHandle = function (coinName) {
    selectedCoin.current = coinName;
    getElementById("dropdownCoinSelected").querySelector(
      ".admin__dropdown-text"
    ).innerHTML = coinName;
    setPage(1);
    loadData();
    handleCancelModalCoin();
  };
  const showModalSpinner = function () {
    const element = getElementById("modalSpinner");
    if (element) element.classList.remove("--d-none");
  };
  const closeModalSpinner = function () {
    const element = getElementById("modalSpinner");
    if (element) {
      addClassToElementById("modalSpinner", "--d-none");
    }
  };
  const fetchAllAds = function () {
    return new Promise((resolve) => {
      if (callApiLoadTableStatus.current === api_status.fetching) resolve(null);
      else callApiLoadTableStatus.current = api_status.fetching;
      getAllAds({
        limit: limit.current,
        page: page,
      })
        .then((resp) => {
          callApiLoadTableStatus.current = api_status.fulfilled;
          resolve(resp.data.data);
        })
        .catch((error) => {
          callApiLoadTableStatus.current = api_status.rejected;
          console.log(error);
          resolve(null);
        });
    });
  };
  const fetchAllAdsPending = function () {
    return new Promise((resolve) => {
      if (callApiLoadTableStatus.current === api_status.fetching) resolve(null);
      else callApiLoadTableStatus.current = api_status.fetching;
      getAllAdsPending({
        limit: limit.current,
        page: page,
      })
        .then((resp) => {
          callApiLoadTableStatus.current = api_status.fulfilled;
          console.log(resp);
          resolve(resp.data.data);
        })
        .catch((error) => {
          callApiLoadTableStatus.current = api_status.rejected;
          console.log(error);
          resolve(null);
        });
    });
  };
  const fetchAdsByWhere = function () {
    return new Promise((resolve) => {
      if (callApiLoadTableStatus.current === api_status.fetching) resolve(null);
      else callApiLoadTableStatus.current = api_status.fetching;
      const whereString = whereStringBuilder();
      getAdsToWhere({
        limit: limit.current,
        page: page,
        where: whereString,
      })
        .then((resp) => {
          callApiLoadTableStatus.current = api_status.fulfilled;
          resolve(resp.data.data);
        })
        .catch((error) => {
          callApiLoadTableStatus.current = api_status.rejected;
          console.log(error);
          resolve(null);
        });
    });
  };
  const whereStringBuilder = function () {
    const result = [];
    if (action.current !== actionType.all) {
      result.push(`side='${action.current}'`);
    }
    if (selectedCoin.current !== "All") {
      result.push(`symbol='${selectedCoin.current}'`);
    }
    const pending = getElementById("pendingCheckbox").checked;
    if (pending) {
      result.push(`type=2`);
    }
    return result.join(" AND ");
  };
  const renderTable = async function (fetchData) {
    closeContentTable();
    closeContentEmpty();
    showContentSpin();
    disableFilter();
    const respApi = await fetchData();
    if (respApi == null) {
      setTotalItem(() => 1);
      showContentEmpty();
      enableFilter();
      return;
    }
    const { array: data, total } = respApi;
    closeContentSpin();
    if (!data || data.length <= 0) {
      setTotalItem(() => 1);
      enableFilter();
      showContentEmpty();
      return;
    } else {
      closeContentEmpty();
    }
    // fetData
    await fetchData();
    //render html
    const renderStatus = function (number) {
      switch (number) {
        case 1:
          return "<span class='ads_accepted'>Accepted</span>";
        case 2:
          return "<span class='ads_pending'>Pending</span>";
        case 3:
          return "<span class='ads_rejected'>Rejected</span>";
        default:
          return;
      }
    };
    const element = getElementById("ids_content_body");
    element.innerHTML = "";
    const visible = (number) => {
      switch (number) {
        case 1:
          return "--visible-hidden";
        case 3:
          return "--visible-hidden";
        default:
          break;
      }
    };
    for (const item of data) {
      element.innerHTML += `<tr>
        <td>${item.userName}</td>
        <td>${item.created_at}</td>
        <td>${item.amount}</td>
        <td>${item.amountMinimum}</td>
        <td>${item.addressWallet}</td>
        <td>${item.bankName}</td>
        <td>${item.ownerAccount}</td>
        <td>${item.numberBank}</td>
        <td>${item.symbol}</td>
        <td>${item.side.at(0).toUpperCase() + item.side.slice(1)}</td>
        <td>${renderStatus(item.type)}</td>
        <td>
        <div class="ads__content-action">
          <button name="${item.id}" class="ads__content-reject ${visible(
        item.type
      )}"><div class="loader --d-none"></div>Reject</button>
          <button name="${item.id}" class="ads__content-accept ${visible(
        item.type
      )}"><div class="loader --d-none"></div>Accept</button></div>
        </td>
      </tr>`;
    }
    // add event
    for (const item of element.children) {
      const [buttonReject, buttonAccept] = item.querySelectorAll("button");
      const id = buttonReject.name;
      buttonReject.addEventListener("click", rejectHandle.bind(null, id));
      buttonAccept.addEventListener("click", acceptHandle.bind(null, id));
    }
    //
    setTotalItem(() => total);
    //
    showContentTable();
    enableFilter();
  };
  const acceptHandle = function (id) {
    if (callApiConfirmAdsStatus.current === api_status.fetching) return;
    else callApiConfirmAdsStatus.current = api_status.fetching;
    disableFilter();
    tableShowLoaderButton(id, 1);
    confirmAds({
      id,
    })
      .then((resp) => {
        callToastSuccess("Success");
        callApiConfirmAdsStatus.current = api_status.fulfilled;
        enableFilter();
        tableCloseLoaderButton();
        loadData();
      })
      .catch((error) => {
        enableFilter();
        callApiConfirmAdsStatus.current = api_status.rejected;
        tableCloseLoaderButton();
        callToastError("Fail");
        console.log(error);
      });
  };
  /**
   * Function show button loader for table
   * @param {number|string} id: id to identify row
   * @param {number} type: 0 is reject button, 1 is accept button
   */
  const tableShowLoaderButton = function (id, type) {
    const buttons =
      getElementById("ids_content_body").querySelectorAll("button");
    const trueButtons = Array.from(buttons).filter((item) => item.name === id);
    const trueBtn = trueButtons.at(type);
    trueBtn.querySelector(".loader").classList.remove("--d-none");
  };
  const tableCloseLoaderButton = function () {
    const buttons =
      getElementById("ids_content_body").querySelectorAll("button");
    const classHide = "--d-none";
    for (const item of buttons) {
      const loader = item.querySelector(".loader");
      const itemClass = loader.classList;
      if (!itemClass.contains(classHide)) itemClass.add(classHide);
    }
  };
  const rejectHandle = function (id) {
    if (callApiConfirmAdsStatus.current === api_status.fetching) return;
    else callApiConfirmAdsStatus.current = api_status.fetching;
    disableFilter();
    tableShowLoaderButton(id, 0);
    refuseAds({
      id,
    })
      .then((resp) => {
        callApiConfirmAdsStatus.current = api_status.fulfilled;
        callToastSuccess("Success");
        loadData();
        tableCloseLoaderButton();
      })
      .catch((error) => {
        callApiConfirmAdsStatus.current = api_status.rejected;
        callToastError("Fail");
        tableCloseLoaderButton();
        console.log(error);
      });
  };
  const showContentTable = function () {
    getClassListFromElementById("ads_content_table").remove("--d-none");
  };
  const closeContentTable = function () {
    addClassToElementById("ads_content_table", "--d-none");
  };
  const showContentSpin = function () {
    getClassListFromElementById("ads_content_spin").remove("--d-none");
  };
  const closeContentSpin = function () {
    addClassToElementById("ads_content_spin", "--d-none");
  };
  const showContentEmpty = function () {
    getClassListFromElementById("ads_content_empty").remove("--d-none");
  };
  const closeContentEmpty = function () {
    addClassToElementById("ads_content_empty", "--d-none");
  };
  const pendingChangeHandle = function (e) {
    setPage(1);
    loadData();
  };
  const pageChangeHandle = function (newPage = 1) {
    if (
      callApiConfirmAdsStatus.current === api_status.fetching ||
      callApiLoadTableStatus.current === api_status.fetching
    ) {
      return false;
    }
    setPage(newPage);
    loadData();
  };
  const loadData = function () {
    const pending = getElementById("pendingCheckbox").checked;
    if (action.current === actionType.all) {
      if (pending) {
        renderTable(fetchAllAdsPending);
      } else {
        renderTable(fetchAllAds);
      }
    } else {
      renderTable(fetchAdsByWhere);
    }
  };
  return (
    <div className="ads">
      <div className="ads__header">
        <h3 className="ads__title">Ads</h3>
        <div className="ads__filter">
          <div className="ads__dropdown-action">
            <label>Action: </label>
            <div className="ads__dropdown">
              <div
                onClick={toggleDropdownAction}
                className="admin__dropdown-selected"
                id="dropdownActionSelected"
              >
                <span className="admin__dropdown-text">All</span>
                <span>
                  <i className="fa-solid fa-angle-down"></i>
                </span>
              </div>
              <div id="dropdownActionMenu" className="admin__dropdown-menu">
                <div
                  onClick={dropdownActionItemClickHandle}
                  className="admin__dropdown-item"
                >
                  All
                </div>
                <div
                  onClick={dropdownActionItemClickHandle}
                  className="admin__dropdown-item"
                >
                  Buy
                </div>
                <div
                  onClick={dropdownActionItemClickHandle}
                  className="admin__dropdown-item"
                >
                  Sell
                </div>
              </div>
            </div>
          </div>
          <div className="ads__checkbox">
            <input
              id="pendingCheckbox"
              onChange={pendingChangeHandle}
              type="checkbox"
              className="--d-none"
            />
            <label className="ads__checkbox-item" htmlFor="pendingCheckbox">
              <div className="ads__checkbox__label">Pending: </div>
              <div className="ads__checkbox__control"></div>
              <i className="fa-solid fa-check"></i>
            </label>
          </div>
          <div className="ads__dropdown-coin">
            <label>Coin:</label>
            <div onClick={showModalCoin} className="ads__dropdown ">
              <div
                id="dropdownCoinSelected"
                className="admin__dropdown-selected"
              >
                <span className="admin__dropdown-text">All</span>
                <span>
                  <i className="fa-solid fa-angle-down"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="ads__paging">
          <Pagination
            defaultCurrent={1}
            pageSize={10}
            showSizeChanger={false}
            current={page}
            total={totalItem}
            onChange={pageChangeHandle}
          />
        </div>
      </div>
      <div className="ads__content">
        <table id="ads_content_table" className="ads__table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Created At</th>
              <th>Amount</th>
              <th>Amount Minimum</th>
              <th>Address Wallet</th>
              <th>Bank Name</th>
              <th>Owner Account</th>
              <th>Number Bank</th>
              <th>Symbol</th>
              <th>Action</th>
              <th>Status</th>
              <th>
                <i className="fa-solid fa-gears"></i>
              </th>
            </tr>
          </thead>
          <tbody id="ids_content_body">
            <tr>
              <td>daingo</td>
              <td>29-4</td>
              <td>1</td>
              <td>0.001</td>
              <td>12345679</td>
              <td>OCB</td>
              <td>ngo dai</td>
              <td>123456</td>
              <td>BTC</td>
              <td>Buy</td>
              <td>pending</td>
              <td className="ads__content-action">
                <button className="ads__content-reject">Reject</button>
                <button className="ads__content-accept">Accept</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div
          id="ads_content_spin"
          className="ads__content-spinner spin-container --d-none"
        >
          <Spin />
        </div>
        <div
          id="ads_content_empty"
          className="ads__content-empty spin-container --d-none"
        >
          <EmptyCustom />
        </div>
      </div>
      <Modal
        title="Select Your Coin"
        open={isModalCoinOpen}
        onCancel={handleCancelModalCoin}
        footer={false}
      >
        <div id="modalCoinContent" className="ads-modal-coin-content">
          <span className="ads-modal-coin-content__item active">
            <span className="ads-modal-coin-content__img">
              <img src="https://remitano.dk-tech.vn/images/BTC.png" alt="..." />
            </span>
            <span className="ads-modal-coin-content__text">BTB</span>
          </span>
        </div>
        <div id="modalSpinner" className="spin-container --d-none">
          <Spin />
        </div>
      </Modal>
    </div>
  );
}

export default Ads;
