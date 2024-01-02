/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import { Pagination, Spin, Empty } from "antd";
import socket from "src/util/socket";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";
import { useSelector, useDispatch } from "react-redux";
import { getCoin } from "src/redux/constant/coin.constant";
import { DOMAIN } from "src/util/service";
import {
  getClassListFromElementById,
  getElementById,
  addClassToElementById,
  getLocalStorage,
} from "src/util/common";
import { createWalletApi, getDepositHistory } from "src/util/userCallApi";
import {
  api_status,
  defaultLanguage,
  image_domain,
  localStorageVariable,
} from "src/constant";
import { callToastSuccess } from "src/function/toast/callToast";
import i18n from "src/translation/i18n";
import { actionContent, setShow } from "src/redux/reducers/wallet2Slice";
function SeresoWalletDeposit() {
  //
  const dropdownCoinMenuClickHandle = function (e) {
    e.stopPropagation();
    if (
      callApiCreateWalletStatus.current === api_status.fetching ||
      callApiGetHistoryStatus.current === api_status.fetching
    )
      return;
    dropdownCoinToggle();
    dropdownNetworkClose();
  };
  const dropdownNetworkMenuClickHandle = function (e) {
    e.stopPropagation();
    dropdowNetWorkToggle();
    dropdownCoinClose();
  };
  const dropdowNetWorkToggle = function () {
    getClassListFromElementById("coin-dropdown-network").toggle("show");
    getClassListFromElementById("dropdown-network-selected").toggle("active");
  };
  const dropdownCoinToggle = function () {
    getClassListFromElementById("coin-dropdown-menu").toggle("show");
    getClassListFromElementById("dropdown-coin-selected").toggle("active");
  };
  const dropdownNetworkClose = function () {
    getClassListFromElementById("coin-dropdown-network").remove("show");
    getClassListFromElementById("dropdown-network-selected").remove("active");
  };
  const dropdownCoinClose = function () {
    getClassListFromElementById("coin-dropdown-menu").remove("show");
    getClassListFromElementById("dropdown-coin-selected").remove("active");
  };
  const closeAllDropdownMenu = function () {
    dropdownNetworkClose();
    dropdownCoinClose();
  };
  const renderDropdownCoinMenu = function (listCoin) {
    const dropdownCoinMenu = document.getElementById("coinDropdownList");
    if (dropdownCoinMenu) {
      dropdownCoinMenu.innerHTML = "";
      for (const item of listCoin) {
        dropdownCoinMenu.innerHTML += `
          <div class='dropdown-item'>
            <span>
              <img src='${DOMAIN + item.image}' alt="${item.image}" />
            </span>
            <span>
              <span class="dropdown-content">${item.name}</span>
              <span>${item.token_key}</span>
            </span>
          </div>
          `;
      }
      const allDropDownItem = document.querySelectorAll(
        ".wallet-deposit .dropdown-item-coin"
      );
      for (const item of allDropDownItem) {
        item.addEventListener("click", dropdownCoinMenuItemCLickHandle);
      }
    }
  };
  const dropdownCoinMenuItemCLickHandle = function (e) {
    const element = e.target.closest(".dropdown-item-coin");
    let spans = element.querySelectorAll("span");
    let coinName = spans[0].innerHTML;
    // display html
    renderDropdownCoinSelected(coinName, listAllCoin.current);
    // store value in to memory
    selectedCoin.current = coinName;
    // create wallet reload qr
    renderQRCode();
    //renderHistory
    renderHistory(coinName, 1);
  };
  const renderQRCode = async function () {
    addressCloseEmpty();
    addressCloseQr();
    addressShowSpinner();
    const responFromApi = await fetchApiCreateWallet(
      selectedCoin.current || coinFromRedux
    );
    addressCloseSpinner();
    address.current = responFromApi;
    if (responFromApi) {
      getElementById("addressCode").innerHTML = responFromApi;
      addressShowQr();
      addressCloseEmpty();
    } else {
      addressCloseQr();
      addressShowEmpty();
    }
  };
  const addressShowSpinner = function () {
    getClassListFromElementById("addressSpinner").remove("--d-none");
  };
  const addressCloseSpinner = function () {
    addClassToElementById("addressSpinner", "--d-none");
  };
  const addressShowEmpty = function () {
    getClassListFromElementById("addressEmpty").remove("--d-none");
  };
  const addressCloseEmpty = function () {
    addClassToElementById("addressEmpty", "--d-none");
  };
  const addressShowQr = function () {
    getClassListFromElementById("address").remove("--d-none");
    getClassListFromElementById("addressCodeButton").remove("--d-none");
    getClassListFromElementById("addressCodeContainer").remove("--d-none");
  };
  const addressCloseQr = function () {
    addClassToElementById("address", "--d-none");
    addClassToElementById("addressCodeButton", "--d-none");
    addClassToElementById("addressCodeContainer", "--d-none");
  };
  const fetchApiCreateWallet = function (coin) {
    return new Promise((resolve) => {
      if (callApiCreateWalletStatus.current === api_status.fetching || !coin) {
        return resolve(null);
      }
      callApiCreateWalletStatus.current = api_status.fetching;
      createWalletApi(coin)
        .then((resp) => {
          callApiCreateWalletStatus.current = api_status.fulfilled;
          return resolve(resp.data.data.address);
        })
        .catch((error) => {
          console.log(error);
          callApiCreateWalletStatus.current = api_status.rejected;
          return resolve(null);
        });
    });
  };
  const copyAddressClickHandle = function () {
    const addressCode = getElementById("addressCode").innerHTML;
    const writeTexttoClipboard = navigator.clipboard.writeText(addressCode);
    writeTexttoClipboard.then(() => {
      callToastSuccess(t("copySuccess"));
    });
  };
  const renderDropdownCoinSelected = function (coinName, listAllCoin) {
    if (!coinName || !listAllCoin || listAllCoin.length <= 0) return;
    //find in list all coin
    const selectedCoin = listAllCoin.filter(
      (item) => item.name === coinName
    )[0];
    if (!selectedCoin) return;
    //render html
    const coinDropdownSelectedElement = document.querySelector(
      "#dropdown-coin-selected"
    );
    const image = coinDropdownSelectedElement.querySelector("img");
    image.src = DOMAIN + selectedCoin.image;
    image.alt = selectedCoin.image;
    const newSpan = document.createElement("span");
    newSpan.classList.add("main-content");
    newSpan.innerHTML = selectedCoin.name;
    coinDropdownSelectedElement.querySelector(".content").innerHTML =
      newSpan.outerHTML + selectedCoin.token_key;
  };
  const showLeftContentSpinner = function () {
    getClassListFromElementById("leftContentSpinner").remove("--d-none");
  };
  const closeLeftContentSpinner = function () {
    addClassToElementById("leftContentSpinner", "--d-none");
  };
  const showLeftContent = function () {
    getClassListFromElementById("leftContent").remove("--d-none");
  };
  const closeLeftContent = function () {
    addClassToElementById("leftContent", "--d-none");
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
      console.log(apiresp);
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
  //
  const address = useRef("");
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const coinFromRedux = useSelector(getCoin);
  const selectedCoin = useRef("");
  const listAllCoin = useRef(null);
  const historyPage = useRef(1);
  const callApiCreateWalletStatus = useRef(api_status.pending);
  const callApiGetHistoryStatus = useRef(api_status.pending);
  useEffect(() => {
    closeLeftContent();
    showLeftContentSpinner();
    //add event
    document.addEventListener("click", closeAllDropdownMenu);
    getElementById("addressCodeButton").addEventListener(
      "click",
      copyAddressClickHandle
    );
    // getAllCoin
    socket.once("listCoin", (resp) => {
      showLeftContent();
      closeLeftContentSpinner();
      // save list coin
      listAllCoin.current = resp;
      // render
      renderDropdownCoinMenu(resp);
      //selected coin
      renderDropdownCoinSelected(selectedCoin.current || coinFromRedux, resp);
    });
    // call api create wallet get qr
    renderQRCode();
    //
    renderHistory(selectedCoin.current || coinFromRedux, historyPage.current);
    //
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
  //
  return (
    <div className="container">
      <div className="wallet-deposit fadeInBottomToTop">
        <div className="wallet-deposit-left">
          <ul id="leftContent" className="d-none">
            <li>
              <span className="number">1</span>
              <div id="" className="wallet-deposit-input">
                <p>{t("select")} Coin</p>
                <div
                  id="dropdown-coin-selected"
                  onClick={dropdownCoinMenuClickHandle}
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
                  <span>
                    <i className="fa-solid fa-caret-down"></i>
                  </span>
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
                    <span className="main-content">TCB</span>
                    bitcon
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
                <div id="qrContainer" className="address-content">
                  <div
                    id="addressSpinner"
                    className={`fadeInBottomToTop spin-container --d-none`}
                  >
                    <Spin />
                  </div>
                  <div
                    id="addressEmpty"
                    className={`fadeInBottomToTop spin-container --d-none`}
                  >
                    <Empty />
                  </div>
                  <div
                    id="address"
                    className={`address-content-qr fadeInBottomToTop --d-done`}
                  >
                    <div className="address-content-qr-background">
                      <QRCode
                        style={{
                          height: "auto",
                          maxWidth: "100%",
                          width: "100%",
                        }}
                        value={address.current ?? ""}
                      />
                    </div>
                  </div>
                  <div className="address-code-container">
                    <div
                      id="addressCodeContainer"
                      className="address-code fadeInBottomToTop --d-none"
                    >
                      <div className="address-code-title">address</div>
                      <div id="addressCode" className="code"></div>
                    </div>
                    <span
                      id="addressCodeButton"
                      className="address-copy --d-none fadeInBottomToTop"
                    >
                      <i className="fa-regular fa-copy"></i>
                    </span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div
            id="leftContentSpinner"
            className="spin-container fadeInBottomToTop"
          >
            <Spin />
          </div>
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
            <Empty />
          </div>
          <div className="wallet-deposite-paging">
            <Pagination defaultCurrent={1} total={10} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default SeresoWalletDeposit;
