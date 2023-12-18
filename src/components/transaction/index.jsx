/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { regularExpress, showAlertType, url } from "src/constant";
import { showAlert } from "src/function/showAlert";
import { getCurrent, getExchange } from "src/redux/constant/currency.constant";
import { getListCoinRealTime } from "src/redux/constant/listCoinRealTime.constant";
import { getAdsItem } from "src/redux/reducers/adsSlice";
import { getExchangeRateDisparity } from "src/redux/reducers/exchangeRateDisparitySlice";
import {
  convertStringToNumber,
  formatStringNumberCultureUS,
  getElementById,
  roundDecimalValues,
} from "src/util/common";
function Transaction() {
  const controlTouched = useRef({});
  const controlError = useRef({});
  const control = useRef({
    amountInput: "amountInput",
  });
  const history = useHistory();
  const listCoinRealtime = useSelector(getListCoinRealTime);
  const currency = useSelector(getCurrent);
  const exchangeRateDisparity = useSelector(getExchangeRateDisparity);
  const exchange = useSelector(getExchange);
  const selectedAds = useSelector(getAdsItem);
  const amount = useRef();
  const amountMinimum = useRef();
  const bankName = useRef();
  const userName = useRef();
  const side = useRef();
  const symbol = useRef();
  const amountInput = useRef(null); // input element
  useEffect(() => {
    loadDataFirstTime();
  }, []);
  useEffect(() => {
    renderPrice();
  }, [listCoinRealtime, currency, exchangeRateDisparity, exchange]);
  useEffect(() => {
    setValueInputReceive();
  }, [listCoinRealtime, exchange]);
  const validate = function () {
    let valid = true;
    if (controlTouched.current[control.amountInput]) {
      if (!amountInput.current.value) {
        controlError.current[control.amountInput] = "Require";
        valid &= false;
      } else if (Number(amountInput.current.value) <= 0) {
        controlError.current[control.amountInput] = "Invalid";
        valid &= false;
      } else {
        delete controlError.current[control.amountInput];
      }
    }
    return Object.keys(controlError).length <= 0 ? false : valid;
  };
  const renderError = function () {
    const ele = getElementById("amountInputError");
    if (
      controlTouched.current[control.amountInput] &&
      controlError.current[control.amountInput]
    ) {
      ele.innerHTML = controlError.current[control.amountInput];
    } else {
      ele.innerHTML = "";
    }
  };
  const renderPrice = function () {
    if (!selectedAds) {
      history.push(url.p2pTrading);
      return;
    }
    const priceUSd = listCoinRealtime
      .filter((item) => item.name === symbol.current)
      .at(0)?.price;
    const exch = exchange.filter((item) => item.title === currency).at(0).rate;
    const result = priceUSd * exch * exchangeRateDisparity;
    getElementById(
      "transaction__price"
    ).innerHTML = `<span class="transaction__box-price">${formatStringNumberCultureUS(
      String(result.toFixed(3))
    )}</span> ${currency}`;
  };
  const loadDataFirstTime = function () {
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
    getElementById(
      "transactionTitle"
    ).innerHTML = `<span class="transaction--green">${
      side.current.at(0).toUpperCase() + side.current.slice(1)
    }</span> Tether ${symbol.current} via Bank
    transfer (VND)`;
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
  };
  const buyNowSubmitHandle = function (e) {
    e.preventDefault();
    //
    for (const item of Object.keys(control)) {
      controlTouched.current[item] = true;
    }
    const valid = validate();
    if (!valid) {
      return;
    }
    const acceptEula = getElementById("agreeCheckBox").checked;
    if (!acceptEula) {
      showAlert(showAlertType.error, "not yet accept Eula");
      return;
    }
    console.log("submit");
  };
  const setValueInputReceive = function () {
    const inputReceive = getElementById("receiveInputTransaction");
    if (
      !amountInput.current.value ||
      !listCoinRealtime ||
      listCoinRealtime.length <= 0 ||
      !exchange ||
      exchange.length <= 0
    ) {
      inputReceive.value = 0;
      amountInput.current.value = "";
      return;
    }
    const amountInputValue = convertStringToNumber(amountInput.current.value);
    const rateDollar = exchange.find((item) => item.title === "VND").rate;
    const inputValueDollar = amountInputValue / rateDollar;
    const coinPrice = listCoinRealtime.find(
      (item) => item.name === symbol.current
    ).price;
    let amountCoin = Number(inputValueDollar) / coinPrice;
    inputReceive.value = roundDecimalValues(amountCoin, coinPrice);
  };
  const amountInputChangeHandle = function (e) {
    const inputValue = e.target.value;
    const inputValueNumber = convertStringToNumber(inputValue);
    if (!regularExpress.checkNumber.test(inputValueNumber)) {
      amountInput.current.value = amountInput.current.value.slice(
        0,
        amountInput.current.value.length - 1
      );
    } else {
      amountInput.current.value = formatStringNumberCultureUS(
        String(inputValueNumber)
      );
    }
    setValueInputReceive();
    //
    validate();
    renderError();
  };
  const amountInputFocusHandle = function () {
    controlTouched.current[control.amountInput] = true;
    validate();
    renderError();
  };
  /**
   * disable button submi
   */
  const disableButtonSubmit = function () {};
  return (
    <div className="transaction">
      <div className="container">
        <div className="box transaction__box transaction__header">
          <div id="transactionTitle"></div>
        </div>
        <div className="box transaction__box">
          <form>
            <div className="transaction__input-container">
              <div className="transaction__input">
                <label htmlFor="amountInput">I will pay:</label>
                <input
                  ref={amountInput}
                  onFocus={amountInputFocusHandle}
                  onChange={amountInputChangeHandle}
                  id="amountInputTransaction"
                  type="text"
                />
                <span className="transaction__unit">VND</span>
                <span id="amountInputError" className="input__error"></span>
              </div>
              <div className="transaction__input">
                <label htmlFor="receiveInput">to receive:</label>
                <input disabled id="receiveInputTransaction" type="text" />
                <span id="receiveUnitTransaction" className="transaction__unit">
                  USDT
                </span>
              </div>
              <div className="transaction__input payment">
                <label htmlFor="amountInput">Choose your payment:</label>
                <input type="text" />
                <span className="input__error"></span>
              </div>
            </div>
            <input id="agreeCheckBox" type="checkbox" className="--d-none" />
            <label className="transaction__checkbox" htmlFor="agreeCheckBox">
              <div className="transaction__checkbox-square">
                <i className="fa-solid fa-check"></i>
              </div>
              <div className="transaction__checkbox-text">
                By clicking Continue, you agree to Sereso's{" "}
                <span className="transaction--green-header">
                  P2P Terms of Service
                </span>
              </div>
            </label>
            <button type="submit" onClick={buyNowSubmitHandle}>
              <div className="loader --d-none"></div>Buy now
            </button>
          </form>
        </div>
        <h3 className="transaction--bold">Advertisement informations</h3>
        <div className="box transaction__box">
          <div className="transaction__box-item">
            <span>Price:</span>
            <span id="transaction__price"></span>
          </div>
          <div className="transaction__box-item amount">
            <span>Amount limits:</span>
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
            <span>Method:</span>
            <span id="transactionBankName" className="transaction--bold">
              Vietcombank
            </span>
          </div>
          <div className="transaction__box-item">
            <span>Payment window:</span>
            <span>15 minutes</span>
          </div>
        </div>
        <h3 className="transaction--bold">infomation about partners</h3>
        <div className="box transaction__box">
          <div className="transaction__box-item">
            <span>Username:</span>
            <span id="transactionUserName" className="transaction--green">
              queencoin9999
            </span>
          </div>
          <div className="transaction__box-item">
            <span>Status:</span>
            <span>Online</span>
          </div>
          <div className="transaction__box-item">
            <span>Country:</span>
            <span>Việt Nam</span>
          </div>
          <div className="transaction__box-item">
            <span>Feedback score:</span>
            <span>😃 X978</span>
          </div>
          <div className="transaction__box-item">
            <span>KYC:</span>
            <span className="transaction__kyc">
              <span>
                <span>
                  <i className="fa-solid fa-check"></i>
                </span>{" "}
                Phone number verified
              </span>
              <span>
                <span>
                  <i className="fa-solid fa-check"></i>
                </span>{" "}
                Identity and Residence Proof verified
              </span>
              <span>
                <span>
                  <i className="fa-solid fa-check"></i>
                </span>{" "}
                Bank verified
              </span>
            </span>
          </div>
        </div>
        <div className="box transaction__box">
          <div className="transaction__chat-container">
            <div className="transaction__chat-icon">
              <i className="fa-solid fa-comments"></i>
            </div>
            <div className="transaction__chat">
              <div className="transaction__chat-header">Need more help?</div>
              <div className="transaction__chat-text">
                Contact Customer support via{" "}
                <span className="transaction--green">Online support.</span> We
                are always ready to help
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Transaction;
