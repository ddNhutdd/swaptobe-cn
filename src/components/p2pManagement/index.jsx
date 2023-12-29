/* eslint-disable react-hooks/exhaustive-deps */
import { Empty, Spin, Pagination } from "antd";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  api_status,
  defaultLanguage,
  localStorageVariable,
  url,
} from "src/constant";
import { capitalizeFirstLetter, getLocalStorage } from "src/util/common";
import i18n from "src/translation/i18n";
import socket from "src/util/socket";
import { useHistory } from "react-router-dom";
import {
  getListHistoryP2p,
  getListHistoryP2pPendding,
  getListHistoryP2pWhere,
} from "src/util/userCallApi";
function P2pManagement() {
  const { t } = useTranslation();
  const advertisingStatusType = {
    all: "all",
    buy: "buy",
    sell: "sell",
    pending: "pending",
  };
  const radioAcitonType = {
    all: "all",
    buy: "buy",
    sell: "sell",
  };
  const [advertisingStatus, setAdvertisingStatus] = useState(
    advertisingStatusType.all
  ); // main tab
  const [callApiLoadP2pStatus, setCallApiLoadP2pStatus] = useState(
    api_status.pending
  );
  const [callApiListCoinStatus, setCallApiListCoinStatus] = useState(
    api_status.pending
  );
  const limit = useRef(10);
  const history = useHistory();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const [selectedCoin, setSelectedCoin] = useState("All");
  const [listAllCoin, setListAllCoin] = useState();
  const [dataTable, setDataTable] = useState([]);
  const [isShowDropdown, setIsShowDropdown] = useState(false);
  const [radioAction, setRadioAction] = useState(radioAcitonType.all);
  const dropdownSelected = useRef();
  useEffect(() => {
    const element = document.querySelector(".p2pManagement");
    element.classList.add("fadeInBottomToTop");
    //
    const language =
      getLocalStorage(localStorageVariable.lng) || defaultLanguage;
    i18n.changeLanguage(language);
    i18n.on("languageChanged", () => {
      loadDropdown();
    });
    //
    document.addEventListener("click", closeDropdown);
    fetchApiGetListAllCoin();
    fetchApiGetAllP2p(1);
    socket.on("createP2p", (res) => {
      console.log(res, "createP2p");
      fetchApiGetAllP2p();
    });
    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, []);
  useEffect(() => {
    loadDropdown();
  }, [advertisingStatus]);
  /**
   * load dropdown based on component state
   */
  const loadDropdown = function () {
    const container = document.querySelectorAll(
      ".p2pManagement__header-menu .p2pManagement__header-menu-item"
    );
    const ele = Array.from(container).find((item) => {
      const span = item.querySelector("span");
      if (span.innerHTML.toLowerCase() === t(advertisingStatus)) return true;
      else return false;
    });

    if (ele && dropdownSelected.current) {
      dropdownSelected.current.innerHTML = ele.innerHTML;
    }
  };
  const renderClassTabActive = function (adsStatus) {
    return advertisingStatus === adsStatus ? "active" : "";
  };
  const toggleDropdown = function (e) {
    e.stopPropagation();
    setIsShowDropdown((s) => !s);
  };
  const closeDropdown = function () {
    setIsShowDropdown(() => false);
  };
  const dropdownItemClick = function (e) {
    const element = e.target.closest(".p2pManagement__header-menu-item");
    dropdownSelected.current.innerHTML = element.innerHTML;
    const ads = element.id.split("-");
    switch (ads.at(-1)) {
      case advertisingStatusType.all:
        setAdvertisingStatus(advertisingStatusType.all);
        fetchApiGetAllP2p(1);
        break;
      case advertisingStatusType.buy:
        setAdvertisingStatus(advertisingStatusType.buy);
        fetchApiGetListBuyP2p(1);
        break;
      case advertisingStatusType.sell:
        setAdvertisingStatus(advertisingStatusType.sell);
        fetchApiGetListSellP2p(1);
        break;
      case advertisingStatusType.pending:
        setAdvertisingStatus(advertisingStatusType.pending);
        fetchApiGetListPending(1, radioAction, selectedCoin);
        break;
      default:
        break;
    }
  };
  const tabClickHandle = function (adsStatus) {
    if (callApiLoadP2pStatus === api_status.fetching) return;
    setAdvertisingStatus(adsStatus);
    switch (adsStatus) {
      case advertisingStatusType.all:
        fetchApiGetAllP2p(1);
        break;
      case advertisingStatusType.buy:
        fetchApiGetListBuyP2p(1);
        break;
      case advertisingStatusType.sell:
        fetchApiGetListSellP2p(1);
        break;
      case advertisingStatusType.pending:
        fetchApiGetListPending(1, radioAction, selectedCoin);
        break;
      default:
        break;
    }
  };
  const renderClassTable = function () {
    if (callApiLoadP2pStatus === api_status.fetching) return "--d-none";
    else if (!dataTable || dataTable.length <= 0) return "--d-none";
    else return "";
  };
  const renderClassSpin = function () {
    if (callApiLoadP2pStatus === api_status.fetching) return "";
    else return "--d-none";
  };
  const renderClassEmpty = function () {
    if (callApiLoadP2pStatus === api_status.fetching) return "--d-none";
    else if (!dataTable || dataTable.length <= 0) return "";
    else return "--d-none";
  };
  const radioActionChangeHandle = function (e) {
    if (callApiLoadP2pStatus === api_status.fetching) {
      return;
    }
    const id = e.target.id;
    switch (id) {
      case "allRadio":
        setRadioAction(() => radioAcitonType.all);
        fetchApiGetListPending(1, radioAcitonType.all, null);
        break;
      case "buyRadio":
        setRadioAction(() => radioAcitonType.buy);
        fetchApiGetListPending(1, radioAcitonType.buy, selectedCoin);
        break;
      case "sellRadio":
        setRadioAction(() => radioAcitonType.sell);
        fetchApiGetListPending(1, radioAcitonType.sell, selectedCoin);
        break;
      default:
        break;
    }
  };
  const fetchApiGetListAllCoin = function () {
    return new Promise((resolve, reject) => {
      if (callApiListCoinStatus === api_status.fetching) resolve(false);
      else setCallApiListCoinStatus(api_status.fetching);
      socket.once("listCoin", (resp) => {
        setCallApiListCoinStatus(api_status.fulfilled);
        resp.unshift({ name: "All" });
        setListAllCoin(resp);
        resolve(resp);
      });
    });
  };
  const renderListCoin = function () {
    if (!listAllCoin || listAllCoin.length <= 0) return;
    return listAllCoin.map((item) => (
      <div
        key={item.name}
        className={`p2pManagement__filter-item ${
          item.name === selectedCoin ? "active" : ""
        }`}
        onClick={coinItemClickHandle.bind(null, item.name)}
      >
        {item.name}
      </div>
    ));
  };
  const coinItemClickHandle = function (coinName) {
    if (callApiLoadP2pStatus === api_status.fetching) {
      return;
    }
    setSelectedCoin(coinName);
    fetchApiGetListPending(1, radioAction, coinName);
  };
  const pagingChangeHandle = function (page) {
    if (callApiLoadP2pStatus === api_status.fetching) return;
    loadData(page);
  };
  const fetchApiGetAllP2p = function (page) {
    return new Promise((resolve) => {
      if (callApiLoadP2pStatus === api_status.fetching) resolve(false);
      else setCallApiLoadP2pStatus(api_status.fetching);
      getListHistoryP2p({
        limit: limit.current,
        page,
      })
        .then((resp) => {
          setCallApiLoadP2pStatus(api_status.fulfilled);
          setDataTable(resp.data.data.array);
          setTotalItems(resp.data.data.total);
          setCurrentPage(page);
          resolve(resp.data.data);
        })
        .catch((error) => {
          setCallApiLoadP2pStatus(api_status.rejected);
          console.log(error);
          resolve(false);
        });
    });
  };
  const renderTable = function () {
    if (!dataTable || dataTable.length <= 0) return;
    const redirectConfirm = function (idP2p) {
      history.push(url.confirm.replace(":id", idP2p));
    };
    const renderAction = function (typeP2p, typeUser, idP2p) {
      if (typeP2p === 2) {
        return (
          <button
            onClick={redirectConfirm.bind(null, idP2p)}
            className="p2pHistory__buton-pending"
          >
            {t("pendingTransaction")}
          </button>
        );
      } else if (typeP2p === 1) {
        return (
          <button className="p2pHistory__buton-success">
            {t("successfulTransaction")}
          </button>
        );
      } else if (typeP2p === 3 && typeUser === 3) {
        return (
          <button className="p2pHistory__buton-cancel">
            {t("transactionCancel")}
          </button>
        );
      } else if (typeP2p === 3) {
        return (
          <button className="p2pHistory__buton-cancel">
            {t("advertiserNotReceivedFunds")}
          </button>
        );
      }
    };
    return dataTable.map((item) => (
      <tr key={item.id}>
        <td>
          <div>
            <div>{item.userName}</div>
            <div>{item.email}</div>
          </div>
        </td>
        <td>
          <div>
            <div>{item.symbol}</div>
            <div>{item.amount}</div>
            <div>{item.rate}</div>
            <div>{t(item.side)}</div>
          </div>
        </td>
        <td>
          <div>
            <div>{item.pay}</div>
            <div>{item.created_at}</div>
          </div>
        </td>
        <td>
          <div>{renderAction(item.typeP2p, item.typeUser, item.idP2p)}</div>
        </td>
      </tr>
    ));
  };
  const loadData = function (page) {
    switch (advertisingStatus) {
      case advertisingStatusType.all:
        fetchApiGetAllP2p(page);
        break;
      case advertisingStatusType.buy:
        fetchApiGetListBuyP2p(page);
        break;
      case advertisingStatusType.sell:
        fetchApiGetListSellP2p(page);
        break;
      case advertisingStatusType.pending:
        fetchApiGetListPending(page, radioAction, selectedCoin);
        break;
      default:
        break;
    }
  };
  const fetchApiGetListBuyP2p = function (page) {
    return new Promise((resolve) => {
      if (callApiLoadP2pStatus === api_status.fetching) resolve(false);
      else setCallApiLoadP2pStatus(api_status.fetching);
      getListHistoryP2pWhere({
        limit: limit.current,
        page,
        where: "side='buy'",
      })
        .then((resp) => {
          setCallApiLoadP2pStatus(api_status.fulfilled);
          const data = resp.data.data;
          setCurrentPage(page);
          setDataTable(data.array);
          setTotalItems(data.total);
          resolve(data);
        })
        .catch((error) => {
          console.log(error);
          setCallApiLoadP2pStatus(api_status.rejected);
          resolve(false);
        });
    });
  };
  const fetchApiGetListSellP2p = function (page) {
    return new Promise((resolve) => {
      if (callApiLoadP2pStatus === api_status.fetching) resolve(false);
      else setCallApiLoadP2pStatus(api_status.fetching);
      getListHistoryP2pWhere({
        limit: limit.current,
        page,
        where: "side='sell'",
      })
        .then((resp) => {
          setCallApiLoadP2pStatus(api_status.fulfilled);
          const data = resp.data.data;
          setCurrentPage(page);
          setDataTable(data.array);
          setTotalItems(data.total);
          resolve(data);
        })
        .catch((error) => {
          setCallApiLoadP2pStatus(api_status.rejected);
          console.log(error);
          resolve(false);
        });
    });
  };
  const fetchApiGetListPending = function (page, action, symbol) {
    return new Promise((resolve) => {
      if (callApiLoadP2pStatus === api_status.fetching) resolve(false);
      else setCallApiLoadP2pStatus(api_status.fetching);
      //
      if (action === radioAcitonType.all) {
        getListHistoryP2pPendding({
          limit: limit.current,
          page,
        })
          .then((resp) => {
            setCallApiLoadP2pStatus(api_status.fulfilled);
            const data = resp.data.data;
            setCurrentPage(page);
            setDataTable(data.array);
            setTotalItems(data.total);
            resolve(data);
          })
          .catch((error) => {
            console.log(error);
            setCallApiLoadP2pStatus(api_status.rejected);
            resolve(false);
          });
      } else {
        const whereString = `side='${action}' AND typeP2p=2 ${
          symbol === "All" ? "" : `AND symbol='${symbol}'`
        } `;
        const postObj = {
          limit: limit.current,
          page,
          where: whereString,
        };
        getListHistoryP2pWhere(postObj)
          .then((resp) => {
            setCallApiLoadP2pStatus(api_status.fulfilled);
            const data = resp.data.data;
            setCurrentPage(1);
            setDataTable(data.array);
            setTotalItems(data.total);
            resolve(data);
          })
          .catch((error) => {
            console.log(error);
            setCallApiLoadP2pStatus(api_status.rejected);
            resolve(false);
          });
      }
      //
    });
  };
  return (
    <div className="p2pManagement">
      <div className="container">
        <div className="p2pManagement__header">
          <div className="p2pManagement__header-tab">
            <div
              className={`p2pManagement__header-tab-item ${renderClassTabActive(
                advertisingStatusType.all
              )}`}
              onClick={tabClickHandle.bind(null, advertisingStatusType.all)}
            >
              <i className="fa-solid fa-border-all"></i>
              <span>{t("all")}</span>
            </div>
            <div
              className={`p2pManagement__header-tab-item ${renderClassTabActive(
                advertisingStatusType.buy
              )}`}
              onClick={tabClickHandle.bind(null, advertisingStatusType.buy)}
            >
              <i className="fa-solid fa-cart-shopping"></i>
              <span>{t("buy")}</span>
            </div>
            <div
              className={`p2pManagement__header-tab-item ${renderClassTabActive(
                advertisingStatusType.sell
              )}`}
              onClick={tabClickHandle.bind(null, advertisingStatusType.sell)}
            >
              <i className="fa-brands fa-sellcast"></i>
              <span>{t("sell")}</span>
            </div>
            <div
              className={`p2pManagement__header-tab-item ${renderClassTabActive(
                advertisingStatusType.pending
              )}`}
              onClick={tabClickHandle.bind(null, advertisingStatusType.pending)}
            >
              <i className="fa-solid fa-spinner"></i>
              <span>{t("pending")}</span>
            </div>
            <div className="p2pManagement__header-tab-item"></div>
          </div>
          <div className="p2pManagement__header-dropdown">
            <div
              onClick={toggleDropdown}
              className="p2pManagement__header-selected "
              ref={dropdownSelected}
            >
              <i className="fa-solid fa-border-all"></i>
              <span>{t("all")}</span>
            </div>
            <div
              className={`p2pManagement__header-menu ${
                isShowDropdown ? "active" : ""
              }`}
            >
              <div
                className="p2pManagement__header-menu-item"
                id={"dropdown-item-" + advertisingStatusType.all}
                onClick={dropdownItemClick}
              >
                <i className="fa-solid fa-border-all"></i>
                <span>{t("all")}</span>
              </div>
              <div
                className="p2pManagement__header-menu-item"
                id={"dropdown-item-" + advertisingStatusType.buy}
                onClick={dropdownItemClick}
              >
                <i className="fa-solid fa-cart-shopping"></i>
                <span>{t("buy")}</span>
              </div>
              <div
                className="p2pManagement__header-menu-item"
                id={"dropdown-item-" + advertisingStatusType.sell}
                onClick={dropdownItemClick}
              >
                <i className="fa-brands fa-sellcast"></i>
                <span>{t("sell")}</span>
              </div>
              <div
                className="p2pManagement__header-menu-item"
                id={"dropdown-item-" + advertisingStatusType.pending}
                onClick={dropdownItemClick}
              >
                <i className="fa-solid fa-spinner"></i>
                <span>{t("pending")}</span>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`p2pManagement__filter ${
            advertisingStatus === advertisingStatusType.pending
              ? ""
              : "--d-none"
          }`}
        >
          <span className="p2pManagement__filter-radio">
            <input
              className="--d-none"
              id="allRadio"
              type="radio"
              name="action"
              checked={radioAction === radioAcitonType.all}
              onChange={radioActionChangeHandle}
            />
            <label htmlFor="allRadio">
              <div className="p2pManagement__filter-circle">
                <div className="p2pManagement__filter-dot"></div>
              </div>
              <span>{t("all")}</span>
            </label>
          </span>
          <span className="p2pManagement__filter-radio">
            <input
              className="--d-none"
              id="buyRadio"
              type="radio"
              name="action"
              checked={radioAction === radioAcitonType.buy}
              onChange={radioActionChangeHandle}
            />
            <label htmlFor="buyRadio">
              <div className="p2pManagement__filter-circle">
                <div className="p2pManagement__filter-dot"></div>
              </div>
              <span>{t("buy")}</span>
            </label>
          </span>
          <span className="p2pManagement__filter-radio">
            <input
              className="--d-none"
              id="sellRadio"
              type="radio"
              checked={radioAction === radioAcitonType.sell}
              name="action"
              onChange={radioActionChangeHandle}
            />
            <label htmlFor="sellRadio">
              <div className="p2pManagement__filter-circle">
                <div className="p2pManagement__filter-dot"></div>
              </div>
              <span>{t("sell")}</span>
            </label>
          </span>
          <div
            className={`p2pManagement__filter-list-item ${
              radioAction === radioAcitonType.all ? "--d-none" : ""
            }`}
          >
            {renderListCoin()}
            <Spin
              className={`${
                callApiListCoinStatus === api_status.pending ? "" : "--d-none"
              }`}
            />
          </div>
        </div>
        <div className="p2pManagement__content">
          <div className="p2pManagement__content-title">
            {t("list")} {capitalizeFirstLetter(advertisingStatus)}
          </div>
          <div className={`p2pManagement__content-data ${renderClassTable()}`}>
            <table>
              <thead>
                <tr>
                  <th>{t("trader")}</th>
                  <th>{t("infomation")}</th>
                  <th>{t("value")}</th>
                  <th>{t("action")}</th>
                </tr>
              </thead>
              <tbody>{renderTable()}</tbody>
            </table>
          </div>
          <div
            className={`p2pManagement__content-empty spin-container ${renderClassEmpty()} `}
          >
            <Empty />
          </div>
          <div
            className={`p2pManagement__content-spinner spin-container ${renderClassSpin()}`}
          >
            <Spin />
          </div>
          <div className="p2pManagement__paging">
            <Pagination
              defaultCurrent={1}
              onChange={pagingChangeHandle}
              current={currentPage}
              total={totalItems}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default P2pManagement;
