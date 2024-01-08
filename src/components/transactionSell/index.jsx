/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Spin } from "antd";
import { Input } from "../Common/Input";
import {
  findIntegerMultiplier,
  formatStringNumberCultureUS,
  getLocalStorage,
  getRandomElementFromArray,
  processString,
  roundIntl,
} from "src/util/common";
import {
  api_status,
  currencyMapper,
  defaultLanguage,
  localStorageVariable,
  url,
} from "src/constant";
import i18n from "src/translation/i18n";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  createP2p,
  getListBanking,
  searchBuyQuick,
} from "src/util/userCallApi";
import { getCoin } from "src/redux/constant/coin.constant";
import { callToastError, callToastSuccess } from "src/function/toast/callToast";
import { useTranslation } from "react-i18next";
import { getListCoinRealTime } from "src/redux/constant/listCoinRealTime.constant";
import { getCurrent, getExchange } from "src/redux/constant/currency.constant";

function TransactionSell() {
  const amount = getLocalStorage(localStorageVariable.coinFromP2pExchange || 0);

  const selectedCoinRedux = useSelector(getCoin);
  const exchangeRedux = useSelector(getExchange);
  const currencyRedux = useSelector(getCurrent);
  const listCoinRealTime = useSelector(getListCoinRealTime);
  const isLogin = useSelector((state) => state.loginReducer.isLogin);
  const { t } = useTranslation();
  const history = useHistory();

  const [selectedDropdownTrader, setSelectedDropdownTrader] = useState({
    userName: "Random",
  }); // variable used to display on the interface, dropdown trader
  const [price, setPrice] = useState();
  const [isShowDropdownTrader, setIsShowDropdownTrader] = useState(false);
  const [isShowDropdownPayment, setIsShowDropdownPayment] = useState(false);
  const [selectedTrader, setSelectedTrader] = useState();
  const [selectedBank, setSelectedBank] = useState();
  const [userListBank, setUserListBank] = useState();
  const [listTrader, setListTrader] = useState();
  const [errorControl, setErrorControl] = useState({});
  const [callApiCreateP2p, setCallApiCreateP2p] = useState(api_status.pending);
  const [eulaChecked, setEulaChecked] = useState(false);

  const touchedControl = useRef({});
  const control = useRef({
    amount: "amount",
  });
  const payInputElement = useRef();
  const receiveInputElement = useRef();

  const [callApiLoadPaymentStatus, setCallApiLoadPaymentStatus] = useState(
    api_status.pending
  );
  const [callApiLoadTraderStatus, setCallApiLoadTraderStatus] = useState(
    api_status.pending
  );

  useEffect(() => {
    const language =
      getLocalStorage(localStorageVariable.lng) || defaultLanguage;
    i18n.changeLanguage(language);
    validationPageLoad();
    firstLoad();
    document.addEventListener("click", closeAllDrodown);
    return () => {
      document.removeEventListener("click", closeAllDrodown);
    };
  }, []);
  useEffect(() => {
    const price = calcPrice(
      listCoinRealTime,
      selectedCoinRedux,
      exchangeRedux,
      currencyRedux
    );
    setPrice(() =>
      new Intl.NumberFormat(currencyMapper.USD, {
        style: "currency",
        currency: currencyRedux,
      }).format(price)
    );
    // Calculate the value for the received input
    const amountCoin = payInputElement.current?.value?.replaceAll(",", "");
    const amountVnd = calcVND(
      listCoinRealTime,
      selectedCoinRedux,
      exchangeRedux,
      amountCoin
    );
    if (!amountVnd || isNaN(amountVnd)) {
      receiveInputElement.current.value = 0;
    } else {
      receiveInputElement.current.value = new Intl.NumberFormat(
        currencyMapper.USD,
        roundIntl(3)
      ).format(amountVnd);
    }
  }, [listCoinRealTime, selectedCoinRedux, exchangeRedux, currencyRedux]);

  const validationPageLoad = function () {
    if (!isLogin) {
      history.push(url.login);
      return;
    }
  };
  const closeAllDrodown = function () {
    setIsShowDropdownTrader(() => false);
    setIsShowDropdownPayment(() => false);
  };
  const renderClassPaymentDropdown = function () {
    if (
      callApiLoadPaymentStatus !== api_status.fetching &&
      userListBank &&
      userListBank.length > 0
    )
      return "";
    else return "--d-none";
  };
  const dropdownTraderToggle = function (e) {
    e.stopPropagation();
    const showFlag = isShowDropdownTrader;
    closeAllDrodown();
    setIsShowDropdownTrader(() => !showFlag);
  };
  const renderClassTraderMenu = function () {
    return isShowDropdownTrader ? "show" : "";
  };
  const fetchApiTrader = function () {
    return new Promise((resolve) => {
      if (callApiLoadTraderStatus === api_status.fetching)
        return resolve(false);
      else setCallApiLoadTraderStatus(api_status.fetching);
      searchBuyQuick({
        limit: 999999999999999999,
        page: 1,
        symbol: selectedCoinRedux,
        amount,
      })
        .then((resp) => {
          setCallApiLoadTraderStatus();
          setListTrader(resp.data.data.array);
          return resolve(resp.data.data.array);
        })
        .catch((err) => {
          console.log(err);
          setCallApiLoadTraderStatus(api_status.rejected);
          return resolve(false);
        });
    });
  };
  const firstLoad = function () {
    fetchApiTrader().then((resp) => {
      setSelectedDropdownTrader(() => ({ userName: "Random" }));
      setSelectedTrader(() => getRandomElementFromArray(resp));
    });
    fetchApiGetListBank()
      .then((resp) => {
        if (resp) {
          setUserListBank(() => resp);
          setSelectedBank(() => resp.at(0));
        }
      })
      .catch((err) => {
        callToastError("can'tFindUserInformation");
        history.push(url.profile);
        return;
      });
    console.log(amount);
    payInputElement.current.value = new Intl.NumberFormat(
      currencyMapper.USD,
      roundIntl(10)
    ).format(amount);
  };
  const fetchApiGetListBank = function () {
    return new Promise((resolve, reject) => {
      if (callApiLoadPaymentStatus === api_status.fetching)
        return resolve(false);
      else setCallApiLoadPaymentStatus(() => api_status.fetching);
      getListBanking({
        limit: "999999999999999999",
        page: "1",
      })
        .then((resp) => {
          setCallApiLoadPaymentStatus(() => api_status.fulfilled);
          return resolve(resp.data.data.array);
        })
        .catch((err) => {
          console.log(err);
          setCallApiLoadPaymentStatus(() => api_status.rejected);
          return reject(false);
        });
    });
  };
  const renderListTrader = function () {
    if (!listTrader || listTrader.length <= 0) return;
    const listResult = [];
    listResult.push(
      <span onClick={traderRandomSelect} key={-1} className="dropdown-item">
        Random
      </span>
    );
    return listResult.concat(
      listTrader.map((item) => (
        <span
          key={item.id}
          onClick={traderSelect.bind(null, item)}
          className="dropdown-item"
        >
          {item.userName}
        </span>
      ))
    );
  };
  const traderRandomSelect = function () {
    setSelectedDropdownTrader(() => ({ userName: "Random" }));
    setSelectedTrader(() => getRandomElementFromArray(listTrader));
  };
  const traderSelect = function (item) {
    setSelectedTrader(() => item);
    setSelectedDropdownTrader(() => item);
  };
  const renderTraderSpin = function () {
    if (callApiLoadTraderStatus === api_status.fetching) return "";
    else return "--d-none";
  };
  const renderClassPaymentSpin = function () {
    return callApiLoadPaymentStatus === api_status.fetching ? "" : "--d-none";
  };
  const renderPaymentDropdownSelected = function () {
    if (!selectedBank) return;
    return `${selectedBank.name_banking} (${selectedBank.owner_banking}: ${selectedBank.number_banking})`;
  };
  const dropdownPaymentToggle = function (e) {
    e.stopPropagation();
    const showFlag = isShowDropdownPayment;
    closeAllDrodown();
    setIsShowDropdownPayment(() => !showFlag);
  };
  const renderClassDropdownPaymentMenu = function () {
    return isShowDropdownPayment ? "show" : "";
  };
  const renderUserListBank = function () {
    if (!userListBank || userListBank.length <= 0) return;
    return userListBank.map((item) => (
      <div
        onClick={bankClickHandle.bind(null, item)}
        key={item.id}
        className="dropdown-item"
      >
        {`${item.name_banking} (${item.owner_banking}: ${item.number_banking})`}
      </div>
    ));
  };
  const bankClickHandle = function (item) {
    setSelectedBank(() => item);
  };
  const renderAdsInfo = function () {
    if (!selectedTrader) return;
    return (
      <>
        <div className="transaction__box-item">
          <span>{t("price")}:</span>
          <span>{price}</span>
        </div>
        <div className="transaction__box-item amount">
          <span>{t("amountLimits")}:</span>
          <span className="transaction__box-amount-container">
            <span className="transaction__box-amount">
              {selectedTrader.amountMinimum}
            </span>{" "}
            <span className="transaction__box-amount-dash">-</span>{" "}
            <span className="transaction__box-amount">
              {selectedTrader.amount}
            </span>
          </span>
        </div>
        <div className="transaction__box-item">
          <span>{t("available")}: </span>
          <span className="transaction--bold">
            {selectedTrader.amount - selectedTrader.amountSuccess}
          </span>
        </div>
        <div className="transaction__box-item">
          <span>{t("method")}:</span>
          <span className="transaction--bold">{selectedTrader.bankName}</span>
        </div>
        <div className="transaction__box-item">
          <span>{t("paymentWindow")}:</span>
          <span>15 {t("minutes")}</span>
        </div>
      </>
    );
  };
  const renderClassAdsSpin = function () {
    return callApiLoadTraderStatus === api_status.fetching ? "" : "--d-none";
  };
  const calcPrice = function (listCoin, coinName, exchange, currency) {
    if (
      !listCoin ||
      listCoin.length <= 0 ||
      !coinName ||
      !exchange ||
      exchange.length <= 0 ||
      !currency
    )
      return;
    const price = listCoin.find((item) => item.name === coinName)?.price;
    const rate = exchange.find((item) => item.title === currency)?.rate;

    const mt = findIntegerMultiplier([price, rate]);
    const newPrice = price * mt;
    const newRate = rate * mt;
    return (newPrice * newRate) / (mt * mt);
  };
  const renderHeader = function () {
    const str = t("sellEthViaBankTransferVnd");
    const listSubString = ["122se12ll122", "45BTC54"];
    const callback = function (matched, index) {
      switch (matched) {
        case listSubString.at(0):
          return (
            <span key={index} className="transaction__title-action red">
              {t("sell")}
            </span>
          );
        case listSubString.at(1):
          return selectedCoinRedux;
        default:
          break;
      }
    };
    return processString(str, listSubString, callback);
  };
  const formatValueInput = function () {
    const inputValue = payInputElement.current.value;
    const inputValueWithoutComma = inputValue.replace(/,/g, "");
    const regex = /^$|^[0-9]+(\.[0-9]*)?$/;
    if (!regex.test(inputValueWithoutComma)) {
      payInputElement.current.value = inputValue.slice(0, -1);
      return;
    }
    const inputValueFormated = formatStringNumberCultureUS(
      inputValueWithoutComma
    );
    payInputElement.current.value = inputValueFormated;
  };
  const payInputChangeHandle = function () {
    formatValueInput();
    validate();
  };
  const validate = function () {
    let valid = true;
    if (touchedControl.current[control.current.amount]) {
      const coinInput = payInputElement.current?.value;
      if (!coinInput) {
        valid &= false;
        setErrorControl((error) => {
          return {
            ...error,
            [control.current.amount]: t("require"),
          };
        });
      } else {
        setErrorControl((error) => {
          const newError = { ...error };
          delete newError[control.current.amount];
          return newError;
        });
      }
    }
    return Object.keys(touchedControl).length <= 0 ? false : Boolean(valid);
  };
  const inputCoinFocusHandle = function () {
    touchedControl.current[control.current.amount] = true;
    validate();
  };
  const calcVND = function (listCoin, selectedCoin, exchange, amountCoin) {
    if (
      !listCoin ||
      listCoin.length <= 0 ||
      !selectedCoin ||
      !exchange ||
      exchange.length <= 0 ||
      !amountCoin
    )
      return;
    const priceUsd = listCoin.find((item) => item.name === selectedCoin)?.price;
    const rate = exchange.find((item) => item.title === "VND")?.rate;
    const mt = findIntegerMultiplier([priceUsd, rate, amountCoin]);
    const newAmountCoin = amountCoin * mt;
    const newRate = rate * mt;
    const newPriceUsd = priceUsd * mt;
    const result = (newAmountCoin * newRate * newPriceUsd) / (mt * mt * mt);
    return result;
  };
  const eulaCheckboxChangeHandle = function () {
    setEulaChecked(!eulaChecked);
  };
  const fetchApiCreateP2p = function (amount, idP2p, idBankingUser) {
    return new Promise((resolve, reject) => {
      if (callApiCreateP2p === api_status.fetching) reject(false);
      else setCallApiCreateP2p(() => api_status.fetching);

      createP2p({
        amount,
        idP2p,
        idBankingUser,
      })
        .then((resp) => {
          callToastSuccess(t("success"));
          setCallApiCreateP2p(() => api_status.fulfilled);
          resolve(true);
        })
        .catch((err) => {
          console.log(err);
          const mess = err.response.data.message;
          switch (mess) {
            case "You cannot buy your own advertising":
              callToastError("You cannot buy your own advertising");
              break;
            case "The quantity is too small to create an order":
              callToastError(t("theQuantityIsTooSmallToCreateAnOrder"));
              break;
            case "The quantity is too much and the order cannot be created":
              callToastError(
                t("theQuantityIsTooMuchAndTheOrderCannotBeCreated")
              );
              break;
            default:
              break;
          }
          setCallApiCreateP2p(() => api_status.rejected);
          reject(false);
        });
    });
  };
  const renderClassMainButton = function () {
    const condition1 = callApiLoadTraderStatus === api_status.fetching;
    const condition2 = callApiLoadPaymentStatus === api_status.fetching;
    let condition3 = !eulaChecked;
    const condition4 = callApiCreateP2p === api_status.fetching;

    if (condition1 || condition2 || condition3 || condition4) return "disable";
    else return "";
  };
  const submitHandle = function (e) {
    e.preventDefault();
    touchedControl.current[control.current.amount] = true;
    const valid = validate();
    if (!valid) return;
    const amount = payInputElement.current.value.replaceAll(",", "");
    const idP2p = selectedTrader.id;
    const idBankingUser = selectedBank.id;
    fetchApiCreateP2p(amount, idP2p, idBankingUser)
      .then(() => {
        history.push(url.confirm.replace(":id", idP2p));
      })
      .catch(() => {});
  };

  return (
    <div className={`transaction fadeInBottomToTop`}>
      <div className="container">
        <div className="box transaction__box transaction__header">
          <div>{renderHeader()}</div>
        </div>
        <div className="box transaction__box">
          <div className="transaction__user-dropdown">
            <label>{t("trader")}:</label>
            <div
              onClick={dropdownTraderToggle}
              className="transaction__user-selected"
            >
              <span>{selectedDropdownTrader.userName}</span>
              <span>
                <i className="fa-solid fa-caret-down"></i>
              </span>
            </div>
            <div
              className={`transaction__user-menu ${renderClassTraderMenu()}`}
            >
              <div className="dropdown-menu ">
                {renderListTrader()}
                <div className={`spin-container ${renderTraderSpin()}`}>
                  <Spin />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="box transaction__box">
          <form onSubmit={submitHandle}>
            <div className={`transaction__input-container `}>
              <div className="transaction__input">
                <label>I pay:</label>
                <Input
                  ref={payInputElement}
                  onChange={payInputChangeHandle}
                  type="text"
                  onFocus={inputCoinFocusHandle}
                  errorMes={errorControl[control.current.amount]}
                />
                <span className="transaction__unit">{selectedCoinRedux}</span>
              </div>
              <div className="transaction__input">
                <label>toReceive:</label>
                <Input ref={receiveInputElement} disabled type="text" />
                <span className="transaction__unit">VND</span>
              </div>
            </div>
            <div
              className={`transaction__dropdown ${renderClassPaymentDropdown()}`}
            >
              <label htmlFor="amountInput">chooseYourPayment:</label>
              <div
                onClick={dropdownPaymentToggle}
                className="transaction__payment-dropdown"
              >
                <div className="transaction__payment-dropdown-text">
                  {renderPaymentDropdownSelected()}
                </div>
                <span>
                  <i className="fa-solid fa-caret-down"></i>
                </span>
              </div>
              <div
                className={`transaction__payment-dropdown-menu-container ${renderClassDropdownPaymentMenu()}`}
              >
                <div className="dropdown-menu">{renderUserListBank()}</div>
              </div>
            </div>
            <div className={`spin-container ${renderClassPaymentSpin()}`}>
              <Spin />
            </div>
            <input
              checked={eulaChecked}
              onChange={eulaCheckboxChangeHandle}
              id="agreeCheckBox"
              type="checkbox"
              className="--d-none"
            />
            <label className="transaction__checkbox" htmlFor="agreeCheckBox">
              <div className="transaction__checkbox-square">
                <i className="fa-solid fa-check"></i>
              </div>
              <div className="transaction__checkbox-text">
                byClickingContinueYouAgreeToSerepays
                <span className="transaction--green-header">
                  p2PTermsOfService
                </span>
              </div>
            </label>
            <button className={renderClassMainButton()} type="submit">
              Sell
            </button>
          </form>
        </div>
        <h3 className="transaction__title transaction--bold">fdsafdsfd</h3>
        <div className="box transaction__box">
          {renderAdsInfo()}
          <div className={`spin-container ${renderClassAdsSpin()}`}>
            <Spin />
          </div>
        </div>
        <div className="box transaction__box">
          <div className="transaction__chat-container">
            <div className="transaction__chat-icon">
              <i className="fa-solid fa-comments"></i>
            </div>
            <div className="transaction__chat">
              <div className="transaction__chat-header">needMoreHelp?</div>
              <div className="transaction__chat-text">
                contactCustomerSupportVia
                <span className="transaction__chat-support">
                  onlineSupport.
                </span>{" "}
                weAreAlwaysReadyToHelp
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default TransactionSell;
