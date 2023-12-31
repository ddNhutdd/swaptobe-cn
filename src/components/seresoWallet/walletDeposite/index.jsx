/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Pagination, Spin, Empty } from "antd";

import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";
import { useSelector, useDispatch } from "react-redux";
import { getCoin } from "src/redux/constant/coin.constant";

import {
  getClassListFromElementById,
  getElementById,
  addClassToElementById,
  getLocalStorage,
} from "src/util/common";
import { createWalletBEP20, getDepositHistory } from "src/util/userCallApi";
import {
  api_status,
  defaultLanguage,
  image_domain,
  localStorageVariable,
} from "src/constant";
import { callToastSuccess } from "src/function/toast/callToast";
import i18n from "src/translation/i18n";
import { actionContent, setShow } from "src/redux/reducers/wallet2Slice";
function SerepayWalletDeposit() {
  const dropdownNetworkMenuClickHandle = function (e) {
    e.stopPropagation();
    dropdowNetWorkToggle();
  };
  const dropdowNetWorkToggle = function () {
    getClassListFromElementById("coin-dropdown-network").toggle("show");
    getClassListFromElementById("dropdown-network-selected").toggle("active");
  };
  const dropdownNetworkClose = function () {
    getClassListFromElementById("coin-dropdown-network").remove("show");
    getClassListFromElementById("dropdown-network-selected").remove("active");
  };
  const closeAllDropdownMenu = function () {
    dropdownNetworkClose();
  };
  const fetchApiCreateWallet = function () {
    return new Promise((resolve) => {
      if (callApiCreateWalletStatus === api_status.fetching) resolve(null);
      else setCallApiCreateWalletStatus(() => api_status.fetching);
      createWalletBEP20()
        .then((resp) => {
          setCallApiCreateWalletStatus(() => api_status.fulfilled);
          setAddress(() => resp.response.data.address);
          resolve(true);
        })
        .catch((error) => {
          setAddress(() => error.response.data.errors.address);
          setCallApiCreateWalletStatus(() => api_status.rejected);
          console.log(error);
          console.log("1", error.response.data.errors.address);
          resolve(null);
        });
    });
  };
  const copyAddressClickHandle = function () {
    const addressCode = codeElement.current.innerHTML;
    const writeTexttoClipboard = navigator.clipboard.writeText(addressCode);
    writeTexttoClipboard.then(() => {
      callToastSuccess(t("copySuccess"));
    });
  };
  const fetchApiGetHistory = function (coinName, page) {
    return new Promise((resolve) => {
      //
      if (callApiGetHistoryStatus === api_status.fetching || !coinName || !page)
        resolve(null);
      getDepositHistory({
        limit: 10,
        page: page,
        symbol: coinName,
      })
        .then((resp) => {
          resolve(resp.data.data.array);
        })
        .catch((error) => {
          console.log(error);
          resolve(null);
        });
    });
  };
  const renderHistory = async function (coinName, page) {
    closeHistory();
    closeHistoryEmpty();
    showHistorySpinner();
    const apiresp = await fetchApiGetHistory(coinName, page);
    closeHistorySpinner();
    if (apiresp && apiresp.length > 0) {
      //render html
      const renderEle = getElementById("historyContent");
      if (!renderEle) return;
      renderEle.innerHTML = ``;
      for (const item of apiresp) {
        renderEle.innerHTML += `<div class="wallet-deposite__history-item">
        <div class="wallet-deposite__history-time">
          <i class="fa-solid fa-calendar"></i> ${item.created_at}
        </div>
        <div class="wallet-deposite__history-content">
          <div class="wallet-deposite__history-name">
            ${item.coin_key.toUpperCase()}
          </div>
          <div class="wallet-deposite__history-amount">
            +${item.amount} coins
          </div>
          <div class="wallet-deposite__history-final">
            <span>${t("finalAmount")}:</span>
            <span>${item.before_amount} <img src='${image_domain.replace(
          "USDT",
          item.coin_key.toUpperCase()
        )}' alt='${item.coin_key}' /></span>
          </div>
        </div>
      </div>`;
      }
      //
      showHistory();
      closeHistoryEmpty();
    } else {
      showHistoryEmpty();
      closeHistory();
    }
  };
  const closeHistory = function () {
    addClassToElementById("historyContent", "--d-none");
  };
  const showHistory = function () {
    getClassListFromElementById("historyContent").remove("--d-none");
  };
  const closeHistorySpinner = function () {
    addClassToElementById("historySpinner", "--d-none");
  };
  const showHistorySpinner = function () {
    getClassListFromElementById("historySpinner") &&
      getClassListFromElementById("historySpinner").remove("--d-none");
  };
  const showHistoryEmpty = function () {
    getClassListFromElementById("historyEmpty").remove("--d-none");
  };
  const closeHistoryEmpty = function () {
    addClassToElementById("historyEmpty", "--d-none");
  };
  const renderClassSpin = function () {
    return callApiCreateWalletStatus === api_status.fetching ? "" : "--d-none";
  };
  const renderClassAddress = function () {
    return callApiCreateWalletStatus === api_status.fetching ? "--d-none" : "";
  };

  const [address, setAddress] = useState("");

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const coinFromRedux = useSelector(getCoin);
  const [callApiCreateWalletStatus, setCallApiCreateWalletStatus] = useState(
    api_status.pending
  );

  const selectedCoin = useRef("");
  const historyPage = useRef(1);
  const codeElement = useRef();
  const callApiGetHistoryStatus = useRef(api_status.pending);

  useEffect(() => {
    document.addEventListener("click", closeAllDropdownMenu);
    fetchApiCreateWallet();
    renderHistory(selectedCoin.current || coinFromRedux, historyPage.current);
    const language =
      getLocalStorage(localStorageVariable.lng) || defaultLanguage;
    i18n.changeLanguage(language);
    let currentLanguage = i18n.language;
    i18n.on("languageChanged", (newLanguage) => {
      if (newLanguage !== currentLanguage) {
        renderHistory(
          selectedCoin.current || coinFromRedux,
          historyPage.current
        );
        currentLanguage = newLanguage;
        return;
      }
    });
    return () => {
      document.removeEventListener("click", closeAllDropdownMenu);
      dispatch(setShow(actionContent.main));
    };
  }, []);

  return (
    <div className="container">
      <div className="wallet-deposit fadeInBottomToTop">
        <div className="wallet-deposit-left">
          <ul>
            <li>
              <span className="number">1</span>
              <div id="" className="wallet-deposit-input">
                <p>{t("select")} Coin</p>
                <div
                  id="dropdown-coin-selected"
                  className="dropdown-content-selected"
                >
                  <img
                    src="https://remitano.dk-tech.vn/images/BTC.png"
                    alt="name"
                  />
                  <span className="content">
                    <span className="main-content">BTC</span>
                    Bitcoin
                  </span>
                  <span></span>
                </div>
                <div
                  id="coin-dropdown-menu"
                  className="dropdown-menu-container"
                >
                  <div className="dropdown-menu" id="coinDropdownList">
                    {/* js render here */}
                  </div>
                </div>
              </div>
            </li>
            <li>
              <span className="number">2</span>
              <div className="wallet-deposit-input">
                <p>{t("select")} Network</p>
                <div
                  id="dropdown-network-selected"
                  onClick={dropdownNetworkMenuClickHandle}
                  className="dropdown-content-selected"
                >
                  <span className="content">
                    <span className="main-content">BEP20</span>
                  </span>
                  <span>
                    <i className="fa-solid fa-caret-down"></i>
                  </span>
                </div>
                <div
                  id="coin-dropdown-network"
                  className="dropdown-menu --d-none"
                >
                  <div className="dropdown-item-network">
                    <div className="dropdown-item-network-left">
                      <span>key</span>
                      <span>type</span>
                    </div>
                    <div className="dropdown-item-network-right">
                      <span>≈10 mins</span>
                      <span>23 Confirmation/s</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <span className="number">3</span>
              <div className="address">
                <span>
                  {t("depositeAddress")}
                  <span>
                    <i className="fa-solid fa-pen-to-square"></i>
                  </span>
                </span>
                <div className="address-content">
                  <div
                    className={`fadeInBottomToTop spin-container ${renderClassSpin()}`}
                  >
                    <Spin />
                  </div>
                  <div
                    className={`address-content-qr fadeInBottomToTop ${renderClassAddress()}`}
                  >
                    <div className="address-content-qr-background">
                      <QRCode
                        style={{
                          height: "auto",
                          maxWidth: "100%",
                          width: "100%",
                        }}
                        value={address ?? ""}
                      />
                    </div>
                  </div>
                  <div
                    className={`address-code-container ${renderClassAddress()}`}
                  >
                    <div className="address-code fadeInBottomToTop">
                      <div className="address-code-title">{t("address")}</div>
                      <div ref={codeElement} className="code">
                        {address}
                      </div>
                    </div>
                    <span
                      onClick={copyAddressClickHandle}
                      className="address-copy fadeInBottomToTop"
                    >
                      <i className="fa-regular fa-copy"></i>
                    </span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className="wallet-deposit-right">
          <h3 id="historyTitle">
            {t("depositBtcHistory").replace("BTC", coinFromRedux)}
          </h3>
          <div
            id="historyContent"
            className=" wallet-deposit__history fadeInBottomToTop"
          ></div>
          <div id="historySpinner" className="spin-container fadeInBottomToTop">
            <Spin />
          </div>
          <div id="historyEmpty" className="spin-container fadeInBottomToTop">
            <Empty description={<span>{t("noData")}</span>} />
          </div>
          <div className="wallet-deposite-paging">
            <Pagination defaultCurrent={1} total={10} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default SerepayWalletDeposit;
