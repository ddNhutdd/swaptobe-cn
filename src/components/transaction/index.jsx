/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Spin } from "antd";
import {
  api_status,
  defaultLanguage,
  localStorageVariable,
  regularExpress,
  url,
} from "src/constant";
import { getCurrent, getExchange } from "src/redux/constant/currency.constant";
import { getListCoinRealTime } from "src/redux/constant/listCoinRealTime.constant";
import { getExchangeRateDisparity } from "src/redux/reducers/exchangeRateDisparitySlice";
import i18n from "src/translation/i18n";
import {
  addClassToElementById,
  capitalizeFirstLetter,
  convertStringToNumber,
  findIntegerMultiplier,
  formatStringNumberCultureUS,
  getClassListFromElementById,
  getElementById,
  getLocalStorage,
  hideElement,
  processString,
  roundDecimalValues,
  setLocalStorage,
  showElement,
} from "src/util/common";
import {
  createP2p,
  getListAdsBuy,
  getListAdsSell,
  getListBanking,
} from "src/util/userCallApi";
import { callToastError, callToastSuccess } from "src/function/toast/callToast";
import { Input } from "../Common/Input";
function Transaction() {
  const actionType = {
    sell: "sell",
    buy: "buy",
  };
  const controlTouchedFormBuy = useRef({});
  const [controlErrorFormBuy, setControlErrorFormBuy] = useState({});
  const controlFormBuy = useRef({
    amountInput: "amountInput",
  });
  const controlTouchedFormSell = useRef({});
  const [controlErrorFormSell, setControlErrorFormSell] = useState({});
  const controlFormSell = useRef({
    amountInput: "amountInput",
  });
  const history = useHistory();
  const { t } = useTranslation();
  const listCoinRealtime = useSelector(getListCoinRealTime);
  const currency = useSelector(getCurrent);
  const exchangeRateDisparity = useSelector(getExchangeRateDisparity);
  const exchange = useSelector(getExchange);
  const [selectedAds, setSelectedAds] = useState(
    getLocalStorage(localStorageVariable.adsItem)
  );
  const amount = useRef();
  const amountMinimum = useRef();
  const bankName = useRef();
  const userName = useRef();
  const [listAds, setListAds] = useState();
  const [callApiAdsStatus, setCallApiAdsStatus] = useState(api_status.pending);
  const side = useRef(); // advertising type
  const [currentAction, setCurrentAction] = useState(actionType.buy); // user action
  const symbol = useRef();
  const isLogin = useSelector((state) => state.loginReducer.isLogin);
  const idUserBanking = useRef();
  const amountInputFormBuy = useRef(null); // input element
  const amountInputFormSell = useRef(null);
  const available = useRef(null);
  const [isShowDropdownAds, setIsShowDropdownAds] = useState(false);
  const idAds = useRef();
  const hasRun = useRef(false);
  const callApiStatus = useRef(api_status.pending);
  const [showContent, setShowContent] = useState(
    selectedAds.side === actionType.sell ? false : true
  );
  useEffect(() => {
    const language =
      getLocalStorage(localStorageVariable.lng) || defaultLanguage;
    i18n.changeLanguage(language);
    //
    if (!isLogin) {
      history.push(url.login);
      return;
    }
    //
    loadDataFirstTime(selectedAds);
    fetchApiLoadListAds();
    //
    document.addEventListener("click", closeDropdown);
    setElementWidth();
    window.addEventListener("resize", setElementWidth);
    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, []);
  useEffect(() => {
    renderPrice();
    amountInputFormSellChangeHandle();
  }, [listCoinRealtime, currency, exchangeRateDisparity, exchange]);
  useEffect(() => {
    if (!hasRun.current) {
      const etiVnd = calcUserPay(selectedAds);
      amountInputFormBuy.current.value = new Intl.NumberFormat("en-US").format(
        etiVnd
      );
    }
    if (
      listCoinRealtime &&
      listCoinRealtime.length > 0 &&
      exchange &&
      exchange.length
    ) {
      hasRun.current = true;
      setShowContent(() => true);
    }
    setValueInputReceive();
  }, [listCoinRealtime, exchange]);
  const validateFormBuy = function () {
    let valid = true;
    if (controlTouchedFormBuy.current[controlFormBuy.current.amountInput]) {
      if (!amountInputFormBuy.current.value) {
        setControlErrorFormBuy((state) => {
          const newState = {
            ...state,
            [controlFormBuy.current.amountInput]: t("require"),
          };
          return newState;
        });
        valid &= false;
      } else if (Number(amountInputFormBuy.current.value) <= 0) {
        setControlErrorFormBuy((state) => {
          const newState = {
            ...state,
            [controlFormBuy.current.amountInput]: t("invalid"),
          };
          return newState;
        });
        valid &= false;
      } else {
        setControlErrorFormBuy((state) => {
          const newState = { ...state };
          delete newState[controlFormBuy.current.amountInput];
          return newState;
        });
      }
    }
    return Object.keys(controlTouchedFormBuy.current).length <= 0
      ? false
      : valid;
  };
  const calcUserPay = function (selectedAds) {
    if (
      !listCoinRealtime ||
      listCoinRealtime.length <= 0 ||
      !exchange ||
      exchange.length <= 0 ||
      !selectedAds
    ) {
      return -1;
    }
    let result = 0;
    let amountMini = selectedAds.amountMinimum;
    const symbol = selectedAds.symbol;
    let price = listCoinRealtime.find((item) => item.name === symbol)?.price;
    let exchangeVND = exchange.find((item) => item.title === "VND")?.rate;
    let mt = findIntegerMultiplier([price, amountMini, exchangeVND]);
    amountMini *= mt;
    price *= mt;
    exchangeVND *= mt;
    result = amountMini * price * exchangeVND;
    mt = mt * mt * mt;
    return result / mt;
  };
  const renderPrice = function () {
    if (!selectedAds) {
      history.push(url.p2pTrading);
      return;
    }
    if (!listCoinRealtime || listCoinRealtime.length <= 0) return;
    const priceUSd = listCoinRealtime
      .filter((item) => item.name === symbol.current)
      .at(0)?.price;
    if (!exchange || exchange.length <= 0) return;
    const exch = exchange.filter((item) => item.title === currency).at(0).rate;
    const result = priceUSd * exch;
    getElementById(
      "transaction__price"
    ).innerHTML = `<span class="transaction__box-price">${formatStringNumberCultureUS(
      String(result.toFixed(3))
    )}</span> ${currency}`;
  };
  const renderHeader = function () {
    if (!selectedAds) return;
    let tempCA = "";
    if (side.current === actionType.buy) {
      tempCA = actionType.sell;
    } else {
      tempCA = actionType.buy;
    }
    const listString = ["122bu12y122", "122se12ll122", "45BTC54"];
    const callback = function (match, index) {
      switch (match) {
        case listString.at(0):
          return (
            <span
              key={index}
              className={`transaction__title-action ${
                tempCA === actionType.buy ? "green" : "red"
              }`}
            >
              {t("buy")}
            </span>
          );
        case listString.at(1):
          return (
            <span
              key={index}
              className={`transaction__title-action ${
                tempCA === actionType.buy ? "green" : "red"
              }`}
            >
              {t("sell")}
            </span>
          );
        case listString.at(2):
          return symbol.current;
        default:
          break;
      }
    };
    return tempCA === actionType.buy
      ? processString(t("buyBtcViaBankTransferVnd"), listString, callback)
      : processString(t("sellEthViaBankTransferVnd"), listString, callback);
  };
  const loadDataFirstTime = function (selectedAds) {
    if (!renderPaymentDropdown()) {
      callToastError(t("noBankFoundInAccount"));
      history.push(url.profile);
      return;
    }
    if (!selectedAds) {
      history.push(url.p2pTrading);
      return;
    }
    amount.current = selectedAds.amount;
    amountMinimum.current = selectedAds.amountMinimum;
    bankName.current = selectedAds.bankName;
    userName.current = selectedAds.userName;
    side.current = selectedAds.side;
    symbol.current = selectedAds.symbol;
    idAds.current = selectedAds.id;
    available.current = selectedAds.amount - selectedAds.amountSuccess;
    if (side.current === actionType.buy) {
      setCurrentAction(actionType.sell);
    } else {
      setCurrentAction(actionType.buy);
    }
    if (side.current === actionType.buy) {
      amountInputFormSell.current.value = selectedAds.amountMinimum;
    } else if (side.current === actionType.sell) {
    }
    getElementById(
      "transactionAmountMini"
    ).innerHTML = `<span class="transaction--bold">
    ${amountMinimum.current}
  </span>
  ${symbol.current}`;
    getElementById(
      "transactionAmount"
    ).innerHTML = `<span  class="transaction--bold">
  ${amount.current}
</span>
${symbol.current}`;
    getElementById("transactionBankName").innerHTML = bankName.current;
    getElementById("transactionUserName").innerHTML = userName.current;
    getElementById("receiveUnitTransaction").innerHTML = symbol.current;
    getElementById("transactionAvailable").innerHTML =
      +available.current.toFixed(8) + " " + symbol.current;
  };
  const buyNowSubmitHandle = async function (e) {
    e.preventDefault();
    switch (currentAction) {
      case actionType.buy: {
        for (const item of Object.keys(controlFormBuy.current)) {
          controlTouchedFormBuy.current[item] = true;
        }
        const valid = validateFormBuy();
        if (!valid) {
          return;
        }
        const acceptEula = getElementById("agreeCheckBox").checked;
        if (!acceptEula) {
          callToastError(t("notYetAcceptEula"));
          return;
        }
        disableButtonSubmit();
        const apiRes = await fetchApiCreateP2p({
          amount: convertStringToNumber(
            getElementById("receiveInputTransactionFormBuy").value
          ),
          idP2p: idAds.current,
          idBankingUser: idUserBanking.current,
        });
        enableButtonSubmit();
        if (apiRes) {
          history.push(url.confirm.replace(":id", idAds.current));
        }
        break;
      }
      case actionType.sell: {
        for (const item of Object.keys(controlFormSell.current)) {
          controlTouchedFormSell.current[item] = true;
        }
        const valid = validateFormSell();
        if (!valid) {
          return;
        }
        const acceptEula = getElementById("agreeCheckBox").checked;
        if (!acceptEula) {
          callToastError(t("notYetAcceptEula"));
          return;
        }
        disableButtonSubmit();
        const apiResSell = await fetchApiCreateP2p({
          amount: convertStringToNumber(amountInputFormSell.current.value),
          idP2p: idAds.current,
          idBankingUser: idUserBanking.current,
        });
        enableButtonSubmit();
        if (apiResSell) {
          history.push(url.confirm.replace(":id", idAds.current));
        }
        break;
      }
      default:
        break;
    }
    //
  };
  const fetchApiCreateP2p = function (data) {
    return new Promise((resolve) => {
      if (callApiStatus.current === api_status.fetching) {
        return resolve(false);
      }
      callApiStatus.current = api_status.fetching;
      createP2p(data)
        .then((resp) => {
          callApiStatus.current = api_status.fulfilled;
          callToastSuccess(t("createSuccess"));
          return resolve(true);
        })
        .catch((error) => {
          callApiStatus.current = api_status.rejected;
          console.log(error);
          const mess = error.response.data.message;
          switch (mess) {
            case "The quantity is too much and the order cannot be created":
              callToastError(
                t("theQuantityIsTooMuchAndTheOrderCannotBeCreated")
              );
              break;
            case "The quantity is too small to create an order":
              callToastError(t("theQuantityIsTooSmallToCreateAnOrder"));
              break;
            case "You have a transaction order that has not yet been processed":
              callToastError(
                t("youHaveATransactionOrderThatHasNotYetBeenProcessed")
              );
              break;
            case "Your balance is insufficient":
              callToastError(t("yourBalanceIsInsufficient"));
              break;
            default:
              callToastError(t("anErrorHasOccurred"));
              break;
          }
          return resolve(false);
        });
    });
  };
  const setValueInputReceive = function () {
    const inputReceive = getElementById("receiveInputTransactionFormBuy");
    if (
      !amountInputFormBuy.current.value ||
      !listCoinRealtime ||
      listCoinRealtime.length <= 0 ||
      !exchange ||
      exchange.length <= 0
    ) {
      inputReceive.value = 0;
      amountInputFormBuy.current.value = "";
      return;
    }
    const amountInputValue = convertStringToNumber(
      amountInputFormBuy.current.value
    );
    const rateDollar = exchange.find((item) => item.title === "VND").rate;
    const inputValueDollar = amountInputValue / rateDollar;
    const coinPrice = listCoinRealtime.find(
      (item) => item.name === symbol.current
    ).price;
    let amountCoin = Number(inputValueDollar) / coinPrice;
    inputReceive.value = roundDecimalValues(amountCoin, coinPrice);
  };
  const amountInputFormBuyChangeHandle = function (e) {
    const inputValue = e.target.value;
    const inputValueWithoutComma = inputValue.replaceAll(",", "");
    if (!regularExpress.checkNumber.test(inputValueWithoutComma)) {
      amountInputFormBuy.current.value = amountInputFormBuy.current.value.slice(
        0,
        amountInputFormBuy.current.value.length - 1
      );
    } else {
      amountInputFormBuy.current.value = formatStringNumberCultureUS(
        inputValueWithoutComma
      );
    }
    setValueInputReceive();
    //
    validateFormBuy();
  };
  const amountInputFormBuyFocusHandle = function () {
    controlTouchedFormBuy.current[controlFormBuy.current.amountInput] = true;
    validateFormBuy();
  };
  const dropdownPaymentToggle = function (e) {
    e.stopPropagation();
    const temp = getClassListFromElementById(
      "paymentDropdownSelected"
    ).contains("active");
    closeDropdown();
    if (!temp) {
      getClassListFromElementById("paymentDropdownSelected").add("active");
      getClassListFromElementById("paymentDropdownMenu").add("show");
    }
  };
  const closeDropdown = function () {
    getClassListFromElementById("paymentDropdownMenu").remove("show");
    getClassListFromElementById("paymentDropdownSelected").remove("active");
    setIsShowDropdownAds(() => false);
  };
  const setElementWidth = function () {
    const windowWidth =
      window.innerWidth || document.documentElement.clientWidth;
    const dropdownPaymentSelected = getElementById("paymentDropdownSelected");
    if (!dropdownPaymentSelected) return;
    if (windowWidth <= 576) {
      dropdownPaymentSelected.style.width = windowWidth - 100 + "px";
    } else {
      dropdownPaymentSelected.style.removeProperty("width");
    }
  };
  /**
   * disable button submi
   */
  const disableButtonSubmit = function () {
    const btn = getElementById("buyNowButton");
    addClassToElementById("buyNowButton", "disable");
    const loader = btn.querySelector(".loader");
    showElement(loader);
  };
  const enableButtonSubmit = function () {
    const btn = getElementById("buyNowButton");
    getClassListFromElementById("buyNowButton").remove("disable");
    const loader = btn.querySelector(".loader");
    hideElement(loader);
  };
  const fetApiGetListBanking = function (data) {
    return new Promise((resolve) => {
      getListBanking(data)
        .then((resp) => {
          return resolve(resp.data.data.array);
        })
        .catch((error) => {
          console.log(error);
          return resolve([]);
        });
    });
  };
  const renderPaymentDropdown = async function () {
    const apiRes = await fetApiGetListBanking({ limit: "100000", page: "1" });
    if (!apiRes || apiRes.length <= 0) return false;
    const container = getElementById("paymentDropdownMenuContent");
    if (!container) return;
    container.innerHTML = ``;
    for (const item of apiRes) {
      container.innerHTML += `<div class="dropdown-item"><span class='--d-none'>${item.id}</span>${item.name_banking} (${item.owner_banking}: ${item.number_banking})</div>`;
    }
    const firstBank = apiRes.at(0);
    idUserBanking.current = firstBank?.id;
    const seleted = getElementById("paymentDropdownSelected").querySelector(
      ".transaction__payment-dropdown-text"
    );
    seleted.innerHTML = `${firstBank.name_banking} (${firstBank.owner_banking}: ${firstBank.number_banking})`;
    // add event
    for (const item of container.children) {
      item.addEventListener("click", paymentItemClickHandle.bind(item));
    }
  };
  const paymentItemClickHandle = function (item) {
    const id = item.target.querySelector("span").innerText;
    const pat = item.target.innerText;
    const bankName = pat.split(" ").at(0);
    const accountNumber = pat.split(":").at(1).replace(")", "");
    const accountName = pat.split(":").at(0).split("(").at(1);
    const seleted = getElementById("paymentDropdownSelected").querySelector(
      ".transaction__payment-dropdown-text"
    );
    seleted.innerHTML = `${bankName} (${accountName}: ${accountNumber})`;
    idUserBanking.current = id;
  };
  const validateFormSell = function () {
    let valid = true;
    const inputValue = getElementById("amountInputFormSell").value;
    if (controlTouchedFormSell.current[controlFormSell.current.amountInput]) {
      if (!inputValue) {
        valid &= false;
        setControlErrorFormSell((state) => {
          const newState = {
            ...state,
            [controlFormSell.current.amountInput]: t("require"),
          };
          return newState;
        });
      } else {
        setControlErrorFormSell((state) => {
          const newState = {
            ...state,
          };
          delete newState[controlFormSell.current.amountInput];
          return newState;
        });
      }
    }
    return Object.keys(controlTouchedFormSell).length <= 0
      ? false
      : Boolean(valid);
  };
  const amountInputFormSellFocusHandle = function (e) {
    const name = e.target.name;
    controlTouchedFormSell.current[name] = true;
    validateFormSell();
  };
  const amountInputFormSellChangeHandle = function () {
    if (amountInputFormSell.current === null) return;
    const inputValue = amountInputFormSell.current.value;
    const inputValueWithoutComma = inputValue.replaceAll(",", "");
    if (!regularExpress.checkNumber.test(inputValueWithoutComma)) {
      amountInputFormSell.current.value =
        amountInputFormSell.current.value.slice(
          0,
          amountInputFormSell.current.value.length - 1
        );
    } else {
      amountInputFormSell.current.value = formatStringNumberCultureUS(
        inputValueWithoutComma
      );
    }
    //
    setValueInputVND(inputValueWithoutComma);
    //
    validateFormSell();
  };
  const setValueInputVND = function (value) {
    const elementOutput = getElementById("receiveInputFormSell");
    const amountCoin = Number(value);
    if (
      isNaN(amountCoin) ||
      !listCoinRealtime ||
      listCoinRealtime.length <= 0 ||
      !exchange ||
      exchange.length <= 0 ||
      !symbol.current
    ) {
      return;
    }
    const price = listCoinRealtime.find(
      (item) => item.name === symbol.current
    ).price;
    const excha = exchange.find((item) => item.title === "VND").rate;
    const result = amountCoin * price * excha;
    elementOutput.value = formatStringNumberCultureUS(result.toFixed(3));
  };
  const renderListAds = function () {
    if (!listAds || listAds.length <= 0) return;
    return listAds.map((item) => (
      <div
        onClick={adsClickHandle.bind(null, item)}
        key={item.id}
        className="dropdown-item active"
      >
        {item.userName}
      </div>
    ));
  };
  const adsClickHandle = function (item) {
    setSelectedAds(item);
    loadDataFirstTime(item);
    const etiVnd = calcUserPay(item);
    amountInputFormBuy.current.value = new Intl.NumberFormat("en-US").format(
      etiVnd
    );
    setLocalStorage(localStorageVariable.adsItem, item);
  };
  const fetchApiLoadListAds = function () {
    if (callApiAdsStatus === api_status.fetching) return;
    else setCallApiAdsStatus(api_status.fetching);
    switch (side.current) {
      case actionType.buy:
        getListAdsBuy({ limit: 999999999999, page: 1, symbol: symbol.current })
          .then((resp) => {
            setCallApiAdsStatus(api_status.fulfilled);
            setListAds(resp.data.data.array);
          })
          .catch((err) => {
            console.log(err);
            setCallApiAdsStatus(api_status.rejected);
            setListAds([]);
          });
        break;
      case actionType.sell:
        getListAdsSell({
          limit: 999999999999999999,
          page: 1,
          symbol: symbol.current,
        })
          .then((resp) => {
            setCallApiAdsStatus(api_status.fulfilled);
            setListAds(resp.data.data.array);
          })
          .catch((err) => {
            console.log(err);
            setCallApiAdsStatus(api_status.rejected);
            setListAds([]);
          });
        break;
      default:
        break;
    }
  };
  const renderClassAdsSpin = function () {
    if (
      callApiAdsStatus === api_status.pending ||
      !listAds ||
      listAds.length <= 0
    )
      return "";
    else return "--d-none";
  };
  const renderClassAds = function () {
    if (
      callApiAdsStatus !== api_status.pending &&
      listAds &&
      listAds.length > 0
    )
      return "";
    else return "--d-none";
  };
  const renderClassShowDropdownAds = function () {
    return isShowDropdownAds ? "show" : "";
  };
  const dropdownAdsToggle = function (e) {
    e.stopPropagation();
    const temp = isShowDropdownAds;
    closeDropdown();
    setIsShowDropdownAds(() => !temp);
  };
  return (
    <>
      <div
        style={{ marginTop: 200 }}
        className={`spin-container ${showContent ? "--d-none" : ""}`}
      >
        <Spin />
      </div>
      <div className={`transaction ${showContent ? "" : "--visible-hidden"}`}>
        <div className="container">
          <div className="box transaction__box transaction__header">
            <div>{renderHeader()}</div>
          </div>
          <div className="box transaction__box ">
            <div className="transaction__user-dropdown">
              <label>{t("trader")}:</label>
              <div
                onClick={dropdownAdsToggle}
                className="transaction__user-selected"
              >
                <span>{selectedAds.userName}</span>
                <span>
                  <i className="fa-solid fa-caret-down"></i>
                </span>
              </div>
              <div
                className={`transaction__user-menu ${renderClassShowDropdownAds()}`}
              >
                <div className="dropdown-menu ">
                  <div className={renderClassAds()}>{renderListAds()}</div>
                  <div className={`spin-container ${renderClassAdsSpin()}`}>
                    <Spin />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="box transaction__box">
            <form>
              <div
                className={`transaction__input-container ${
                  currentAction === actionType.buy ? " " : "--d-none"
                }`}
              >
                <div className="transaction__input">
                  <label htmlFor="amountInput">{t("iWillPay")}:</label>
                  <Input
                    ref={amountInputFormBuy}
                    onFocus={amountInputFormBuyFocusHandle}
                    onChange={amountInputFormBuyChangeHandle}
                    type="text"
                    errorMes={
                      controlErrorFormBuy[controlFormBuy.current.amountInput]
                    }
                  />
                  <span className="transaction__unit">VND</span>
                </div>
                <div className="transaction__input">
                  <label htmlFor="receiveInput">{t("toReceive")}:</label>
                  <Input
                    disabled
                    id="receiveInputTransactionFormBuy"
                    type="text"
                    className="transaction__input-result"
                  />
                  <span
                    id="receiveUnitTransaction"
                    className="transaction__unit result"
                  >
                    USDT
                  </span>
                </div>
              </div>
              <div
                className={`transaction__input-container ${
                  currentAction === actionType.sell ? " " : "--d-none"
                }`}
              >
                <div className="transaction__input">
                  <label>{t("iPay")}:</label>
                  <Input
                    name="amountInput"
                    onFocus={amountInputFormSellFocusHandle}
                    onChange={amountInputFormSellChangeHandle}
                    id="amountInputFormSell"
                    ref={amountInputFormSell}
                    type="text"
                    errorMes={
                      controlErrorFormSell[controlFormSell.current.amountInput]
                    }
                  />
                  <span className="transaction__unit">{symbol.current}</span>
                </div>
                <div className="transaction__input">
                  <label>{t("toReceive")}:</label>
                  <Input id="receiveInputFormSell" disabled type="text" />
                  <span className="transaction__unit">VND</span>
                </div>
              </div>
              <div className="transaction__dropdown">
                <label htmlFor="amountInput">{t("chooseYourPayment")}:</label>
                <div
                  id="paymentDropdownSelected"
                  onClick={dropdownPaymentToggle}
                  className="transaction__payment-dropdown"
                >
                  <div className="transaction__payment-dropdown-text">
                    Vietcombank (Nguyen Trung Hieu: 08370383231)
                  </div>
                  <span>
                    <i className="fa-solid fa-caret-down"></i>
                  </span>
                </div>
                <div
                  id="paymentDropdownMenu"
                  className="transaction__payment-dropdown-menu-container"
                >
                  <div
                    id="paymentDropdownMenuContent"
                    className="dropdown-menu"
                  >
                    <div className="dropdown-item">{t("name")}</div>
                  </div>
                </div>
              </div>
              <input id="agreeCheckBox" type="checkbox" className="--d-none" />
              <label className="transaction__checkbox" htmlFor="agreeCheckBox">
                <div className="transaction__checkbox-square">
                  <i className="fa-solid fa-check"></i>
                </div>
                <div className="transaction__checkbox-text">
                  {t("byClickingContinueYouAgreeToSeresos")}{" "}
                  <span className="transaction--green-header">
                    {t("p2PTermsOfService")}
                  </span>
                </div>
              </label>
              <button
                id="buyNowButton"
                type="submit"
                onClick={buyNowSubmitHandle}
              >
                <div className="loader --d-none"></div>
                {t("buyNow")}
              </button>
            </form>
          </div>
          <h3 className="transaction__title transaction--bold">
            {t("advertisementInformations")}
          </h3>
          <div className="box transaction__box">
            <div className="transaction__box-item">
              <span>{t("price")}:</span>
              <span id="transaction__price"></span>
            </div>
            <div className="transaction__box-item">
              <span>{t("trader")}:</span>
              <span className="transaction__username" id="transactionUserName">
                queencoin9999
              </span>
            </div>
            <div className="transaction__box-item amount">
              <span>{t("amountLimits")}:</span>
              <span className="transaction__box-amount-container">
                <span
                  id="transactionAmountMini"
                  className="transaction__box-amount"
                ></span>{" "}
                <span className="transaction__box-amount-dash">-</span>{" "}
                <span
                  id="transactionAmount"
                  className="transaction__box-amount"
                ></span>
              </span>
            </div>
            <div className="transaction__box-item">
              <span>{t("available")}:</span>
              <span id="transactionAvailable" className="transaction--bold">
                Vietcombank
              </span>
            </div>
            <div className="transaction__box-item">
              <span>{t("method")}:</span>
              <span id="transactionBankName" className="transaction--bold">
                Vietcombank
              </span>
            </div>
            <div className="transaction__box-item">
              <span>{t("paymentWindow")}:</span>
              <span>15 {t("minutes")}</span>
            </div>
          </div>
          <div className="box transaction__box">
            <div className="transaction__chat-container">
              <div className="transaction__chat-icon">
                <i className="fa-solid fa-comments"></i>
              </div>
              <div className="transaction__chat">
                <div className="transaction__chat-header">
                  {t("needMoreHelp")}?
                </div>
                <div className="transaction__chat-text">
                  {t("contactCustomerSupportVia")}{" "}
                  <span className="transaction__chat-support">
                    {t("onlineSupport")}.
                  </span>{" "}
                  {t("weAreAlwaysReadyToHelp")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Transaction;
