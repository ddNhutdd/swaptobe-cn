/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { api_status, regularExpress, showAlertType, url } from "src/constant";
import { showAlert } from "src/function/showAlert";
import { showToast } from "src/function/showToast";
import { getCurrent, getExchange } from "src/redux/constant/currency.constant";
import { getListCoinRealTime } from "src/redux/constant/listCoinRealTime.constant";
import { getAdsItem } from "src/redux/reducers/adsSlice";
import { getExchangeRateDisparity } from "src/redux/reducers/exchangeRateDisparitySlice";
import {
  addClassToElementById,
  convertStringToNumber,
  formatStringNumberCultureUS,
  getClassListFromElementById,
  getElementById,
  hideElement,
  roundDecimalValues,
  showElement,
} from "src/util/common";
import { createP2p, getListBanking } from "src/util/userCallApi";
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
  const idUserBanking = useRef();
  const amountInput = useRef(null); // input element
  const idAds = useRef();
  const callApiStatus = useRef(api_status.pending);
  useEffect(() => {
    loadDataFirstTime();
    //
    document.addEventListener("click", closeDropdownPayment);
    setElementWidth();
    window.addEventListener("resize", setElementWidth);
    return () => {
      document.removeEventListener("click", closeDropdownPayment);
    };
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
    const result = priceUSd * exch;
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
    idAds.current = selectedAds.id;
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
    //
    if (!renderPaymentDropdown()) {
      showToast(showAlertType.error, "load thong tin ngan hang that bai");
      return;
    }
  };
  const buyNowSubmitHandle = async function (e) {
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
    disableButtonSubmit();
    await fetchApiCreateP2p({
      amount: convertStringToNumber(
        getElementById("receiveInputTransaction").value
      ),
      idP2p: idAds.current,
      idBankingUser: idUserBanking.current,
    });
    enableButtonSubmit();
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
          showToast(showAlertType.success, "create success");
          return resolve(true);
        })
        .catch((error) => {
          callApiStatus.current = api_status.rejected;
          showToast(showAlertType.error, "create fail");
          console.log(error);
          const mess = error.message;
          switch (mess) {
            case "The quantity is too much and the order cannot be created":
              showAlert(showAlertType.error, mess);
              break;
            case "The quantity is too small to create an order":
              showAlert(showAlertType.error, mess);
              break;
            case "You have a transaction order that has not yet been processed":
              showAlert(showAlertType.error, mess);
              break;
            default:
              break;
          }
          return resolve(false);
        });
    });
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
  const dropdownPaymentToggle = function (e) {
    e.stopPropagation();
    getClassListFromElementById("paymentDropdownSelected").toggle("active");
    getClassListFromElementById("paymentDropdownMenu").toggle("show");
  };
  const closeDropdownPayment = function () {
    getClassListFromElementById("paymentDropdownMenu").remove("show");
  };
  const setElementWidth = function () {
    const windowWidth =
      window.innerWidth || document.documentElement.clientWidth;
    const dropdownPaymentSelected = getElementById("paymentDropdownSelected");
    if (windowWidth <= 576) {
      dropdownPaymentSelected.style.width = windowWidth - 100 + "px";
    } else {
      dropdownPaymentSelected.style.width = null;
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
    if (!apiRes) return apiRes;
    const container = getElementById("paymentDropdownMenuContent");
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
                <div
                  id="paymentDropdownSelected"
                  onClick={dropdownPaymentToggle}
                  className="transaction__payment-dropdown"
                >
                  <div className="transaction__payment-dropdown-text">
                    Vietcombank (Nguyen Trung Hieu: 08370383231)
                  </div>
                  <span>
                    <i className="fa-solid fa-angle-down"></i>
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
                    <div className="dropdown-item">name</div>
                  </div>
                </div>
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
            <button
              id="buyNowButton"
              type="submit"
              onClick={buyNowSubmitHandle}
            >
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
