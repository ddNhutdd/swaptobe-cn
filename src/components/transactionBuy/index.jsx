/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import { Spin } from "antd";
import { Input } from "../Common/Input";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  api_status,
  currencyMapper,
  localStorageVariable,
  url,
} from "src/constant";
import { getListBanking, searchSellQuick } from "src/util/userCallApi";
import { coin, getCoin } from "src/redux/constant/coin.constant";
import {
  findIntegerMultiplier,
  formatStringNumberCultureUS,
  getLocalStorage,
  getRandomElementFromArray,
} from "src/util/common";
import { callToastError } from "src/function/toast/callToast";
import { getListCoinRealTime } from "src/redux/constant/listCoinRealTime.constant";
import { getCurrent, getExchange } from "src/redux/constant/currency.constant";
function TransactionBuy() {
  const isLogin = useSelector((state) => state.loginReducer.isLogin);
  const history = useHistory();
  const amount = getLocalStorage(
    localStorageVariable.amountFromP2pExchange || 0
  );
  const selectedCoinRedux = useSelector(getCoin);
  const [callApiLoadTraderStatus, setCallApiLoadTraderStatus] = useState(
    api_status.pending
  );
  const [selectedDropdownTrader, setSelectedDropdownTrader] = useState({
    userName: "Random",
  }); // variable used to display on the interface, dropdown trader
  const [selectedTrader, setSelectedTrader] = useState();
  const [listTrader, setListTrader] = useState();
  const [isShowDropdownTrader, setIsShowDropdownTrader] = useState(false);
  const [isShowDropdownPayment, setIsShowDropdownPayment] = useState(false);
  const [userListBank, setUserListBank] = useState();
  const [selectedBank, setSelectedBank] = useState();
  const [callApiLoadPaymentStatus, setCallApiLoadPaymentStatus] = useState(
    api_status.pending
  );
  const currencyRedux = useSelector(getCurrent);
  const listCoinRealTime = useSelector(getListCoinRealTime);
  const exchangeRedux = useSelector(getExchange);
  const inputMoneyElement = useRef();
  const [price, setPrice] = useState();
  const control = useRef({
    amount: "amount",
  });
  const touchedControl = useRef({});
  const [errorControl, setErrorControl] = useState({});

  const validate = function () {
    let valid = true;
    if (touchedControl.current[control.current.amount]) {
      const coinInput = inputMoneyElement.current?.value;
      if (!coinInput) {
        setErrorControl((error) => {
          return {
            ...error,
            [control.current.amount]: "Require",
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
  const validationPageLoad = function () {
    if (!isLogin) {
      history.push(url.login);
      return;
    }
  };
  const renderTraderSpin = function () {
    if (callApiLoadTraderStatus === api_status.fetching) return "";
    else return "--d-none";
  };
  const fetchApiTrader = function () {
    return new Promise((resolve) => {
      if (callApiLoadTraderStatus === api_status.fetching)
        return resolve(false);
      else setCallApiLoadTraderStatus(api_status.fetching);
      searchSellQuick({
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
  const traderSelect = function (item) {
    setSelectedTrader(() => item);
    setSelectedDropdownTrader(() => item);
  };
  const renderClassAdsSpin = function () {
    return callApiLoadTraderStatus === api_status.fetching ? "" : "--d-none";
  };
  const traderRandomSelect = function () {
    setSelectedDropdownTrader(() => ({ userName: "Random" }));
    setSelectedTrader(() => getRandomElementFromArray(listTrader));
  };
  const closeAllDrodown = function () {
    setIsShowDropdownTrader(() => false);
    setIsShowDropdownPayment(() => false);
  };
  const dropdownTraderToggle = function (e) {
    e.stopPropagation();
    const showFlag = isShowDropdownTrader;
    closeAllDrodown();
    setIsShowDropdownTrader(() => !showFlag);
  };
  const dropdownPaymentToggle = function (e) {
    e.stopPropagation();
    const showFlag = isShowDropdownPayment;
    closeAllDrodown();
    setIsShowDropdownPayment(() => !showFlag);
  };
  const renderClassTraderMenu = function () {
    return isShowDropdownTrader ? "show" : "";
  };
  const renderAdsInfo = function () {
    if (!selectedTrader) return;
    return (
      <>
        <div className="transaction__box-item">
          <span>Price:</span>
          <span>{price}</span>
        </div>
        <div className="transaction__box-item amount">
          <span>amountLimits:</span>
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
          <span>available: </span>
          <span className="transaction--bold">
            {selectedTrader.amount - selectedTrader.amountSuccess}
          </span>
        </div>
        <div className="transaction__box-item">
          <span>method:</span>
          <span className="transaction--bold">{selectedTrader.bankName}</span>
        </div>
        <div className="transaction__box-item">
          <span>paymentWindow:</span>
          <span>15 minutes</span>
        </div>
      </>
    );
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
        callToastError("Người dùng chưa có thông tin tài khoản");
        history.push(url.profile);
        return;
      });
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
  const renderClassDropdownPaymentMenu = function () {
    return isShowDropdownPayment ? "show" : "";
  };
  const renderClassPaymentSpin = function () {
    return callApiLoadPaymentStatus === api_status.fetching ? "" : "--d-none";
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
  const renderPaymentDropdownSelected = function () {
    if (!selectedBank) return;
    return `${selectedBank.name_banking} (${selectedBank.owner_banking}: ${selectedBank.number_banking})`;
  };
  const inputCoinFocusHandle = function () {
    touchedControl.current[control.current.amount] = true;
    validate();
  };
  const inputCoinChangeHandle = function () {
    formatValueInput();
    validate();
  };
  const formatValueInput = function () {
    const inputValue = inputMoneyElement.current.value;
    const inputValueWithoutComma = inputValue.replace(/,/g, "");
    const regex = /^$|^[0-9]+(\.[0-9]*)?$/;
    if (!regex.test(inputValueWithoutComma)) {
      inputMoneyElement.current.value = inputValue.slice(0, -1);
      return;
    }
    const inputValueFormated = formatStringNumberCultureUS(
      inputValueWithoutComma
    );
    inputMoneyElement.current.value = inputValueFormated;
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
  const calcCoin = function (listCoin, coinName, exchange, vnd) {
    if (
      !listCoin ||
      listCoin.length <= 0 ||
      !coinName ||
      !exchange ||
      exchange.length <= 0 ||
      !vnd
    )
      return;

    const priceUsd = listCoin.find((item) => item.name === coinName)?.price;
    const exchangeVnd = exchange.find((item) => item.title === "VND")?.rate;
    const mt = findIntegerMultiplier([priceUsd, exchangeVnd, vnd]);
    const newPriceUsd = priceUsd * mt;
    const newExchangeVnd = exchangeVnd * mt;
    const newVnd = vnd * mt;
    const result = newVnd / newExchangeVnd / newPriceUsd;
    return result * mt;
  };
  const roundRule = function (value) {
    if (value > 10000) return 8;
    else if (value >= 100 && value <= 9999) return 6;
    else return 2;
  };
  const inputCoinElement = useRef();

  useEffect(() => {
    validationPageLoad();
    firstLoad();
    document.addEventListener("click", closeAllDrodown);
    return () => {
      document.removeEventListener("click", closeAllDrodown);
    };
  }, []);
  useEffect(() => {
    // Display price in the advertising information section
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
    // calculates the value for input vnd
    try {
      const amountCoin = calcCoin(
        listCoinRealTime,
        selectedCoinRedux,
        exchangeRedux,
        +inputMoneyElement.current.value.replace(",", "")
      );
      const price = listCoinRealTime.find(
        (item) => item.name === selectedCoinRedux
      )?.price;

      inputCoinElement.current.value = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: roundRule(price),
      }).format(amountCoin);
    } catch (error) {
      inputCoinElement.current.value = 0;
    }
  }, [listCoinRealTime, selectedCoinRedux, exchangeRedux, currencyRedux]);

  return (
    <div className={`transaction`}>
      <div className="container">
        <div className="box transaction__box transaction__header">
          <div>
            <span className="transaction__title-action green">Mua</span>{" "}
            {selectedCoinRedux} qua chuyen khoan ngan hang
          </div>
        </div>
        <div className="box transaction__box ">
          <div className="transaction__user-dropdown">
            <label>Trader:</label>
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
              className={`transaction__user-menu  ${renderClassTraderMenu()}`}
            >
              <div className={`dropdown-menu`}>
                {renderListTrader()}
                <div className={`spin-container ${renderTraderSpin()}`}>
                  <Spin />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="box transaction__box">
          <form>
            <div className={`transaction__input-container`}>
              <div className="transaction__input">
                <label htmlFor="amountInput">I will pay:</label>
                <Input
                  onChange={inputCoinChangeHandle}
                  onFocus={inputCoinFocusHandle}
                  ref={inputMoneyElement}
                  type="text"
                  errorMes={errorControl[control.current.amount]}
                />
                <span className="transaction__unit">VND</span>
              </div>
              <div className="transaction__input">
                <label htmlFor="receiveInput">to receive:</label>
                <Input
                  ref={inputCoinElement}
                  disabled
                  type="text"
                  className="transaction__input-result"
                />
                <span
                  id="receiveUnitTransaction"
                  className="transaction__unit result"
                >
                  {selectedCoinRedux}
                </span>
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
            <input id="agreeCheckBox" type="checkbox" className="--d-none" />
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
            <button className="disable" type="submit">
              <div className="loader --d-none"></div>
              Buy
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
export default TransactionBuy;
