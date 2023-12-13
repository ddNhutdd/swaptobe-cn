/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Modal } from "antd";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";
import { getCurrent, getExchange } from "src/redux/constant/currency.constant";
import { getListCoinRealTime } from "src/redux/constant/listCoinRealTime.constant";
import { getExchangeRateDisparity } from "src/redux/reducers/exchangeRateDisparitySlice";
import { getBankListV2 } from "src/assets/resource/getBankListV2";
import {
  addClassToElementById,
  formatStringNumberCultureUS,
  getClassListFromElementById,
  getElementById,
} from "src/util/common";
import { DOMAIN } from "src/util/service";
import { companyAddAds, getProfile } from "src/util/userCallApi";
import { api_status, regularExpress, showAlertType, url } from "src/constant";
import { showToast } from "src/function/showToast";
import { showAlert } from "src/function/showAlert";
export default function CreateBuy() {
  const actionType = {
    sell: "sell",
    buy: "buy",
  };
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();
  const action = location.pathname.split("/").at(-1);
  const data = useRef([]);
  const [currentCoin, setCurrentCoin] = useState("BTC");
  const [isModalCoinVisible, setIsModalCoinVisible] = useState(false);
  const [isModalPreviewOpen, setIsModalPreviewOpen] = useState(false);
  const listCoinRealTime = useSelector(getListCoinRealTime);
  const currentCurrency = useSelector(getCurrent);
  const exchage = useSelector(getExchange);
  const exchangeRateDisparity = useSelector(getExchangeRateDisparity);
  const selectedBank = useRef("OCB");
  const userName = useRef("");
  const controls = useRef({
    amount: "amount",
    mini: "mini",
    fullname: "fullname",
    accountNumber: "accountNumber",
  });
  const controlsTourched = useRef({});
  const controlsErrors = useRef({});
  const callApiStatus = useRef(api_status.pending);
  useEffect(() => {
    data.current = listCoinRealTime ?? [];
    renderMarketBuyPrice();
  }, [listCoinRealTime]);
  useEffect(() => {
    document.addEventListener("click", closeDropdownBank);
    bankDropdownSelect(selectedBank.current);
    renderBankDropdown();
    //
    const callProfile = async function () {
      return await fetchUserNameProfile();
    };
    callProfile().then((resp) => {
      userName.current = resp;
    });
    return () => {
      document.removeEventListener("click", closeDropdownBank);
    };
  }, []);
  const showCoinModal = () => setIsModalCoinVisible(true);
  const modalCoinHandleOk = () => setIsModalCoinVisible(false);
  const modalCoinHandleCancel = () => setIsModalCoinVisible(false);
  const showModalPreview = () => {
    setIsModalPreviewOpen(true);
    setTimeout(() => {
      renderModalReview();
    }, 0);
  };
  const modalPreviewHandleOk = () => {
    setIsModalPreviewOpen(false);
  };
  const modalPreviewHandleCancel = () => {
    setIsModalPreviewOpen(false);
  };
  const renderMarketBuyPrice = function () {
    const result = calcBuyPrice();
    // set html
    getElementById("marketBuyPrice").innerHTML =
      formatStringNumberCultureUS(String(result)) + " " + currentCurrency;
  };
  const calcBuyPrice = function () {
    if (data.length <= 0 || exchage.length <= 0 || !exchangeRateDisparity)
      return;
    // find current price
    let ccCoin = data.current.filter((item) => item.name === currentCoin)[0]
      ?.price;
    if (!ccCoin) return;
    // process price
    ccCoin += (ccCoin * exchangeRateDisparity) / 100;
    const rate = exchage.filter((item) => item.title === currentCurrency)[0]
      ?.rate;
    ccCoin *= rate;
    return ccCoin.toFixed(3);
  };
  const renderModalReview = function () {
    getElementById("modalPreviewUserName").innerHTML = userName.current;
    getElementById("modalPreviewPrice").innerHTML =
      formatStringNumberCultureUS(calcBuyPrice()) + " " + currentCurrency;
    getElementById("modalPreviewAmount").innerHTML =
      getElementById("amoutInput").value;
    getElementById("modalPreviewMinimumAmount").innerHTML =
      getElementById("minimumAmoutInput").value;
    getElementById("modalBankName").innerHTML = selectedBank.current;
    getElementById("modalAction").innerHTML = String(action).toUpperCase();
  };
  const toggleDropdownBank = function (e) {
    e.stopPropagation();
    getClassListFromElementById("dropdownBankMenu").toggle("show");
    getClassListFromElementById("dropdownBankSelected").toggle("active");
  };
  const closeDropdownBank = function () {
    getClassListFromElementById("dropdownBankMenu").remove("show");
    getClassListFromElementById("dropdownBankSelected").remove("active");
  };
  const renderBankDropdown = function () {
    const containerElement =
      getElementById("dropdownBankMenu").querySelector("ul");
    containerElement.innerHTML = "";
    for (const item of getBankListV2()) {
      containerElement.innerHTML += `<li class="field-dropdown-item">
      <span>
        <img src=${item.logo} alt="${item.code}" />
      </span>
      <span class="field-dropdown-content">${" " + item.name} (${
        item.code
      })</span>
    </li>`;
    }
    // add event
    for (const item of containerElement.children) {
      item.addEventListener("click", bankDropdownItemClickHandle);
    }
  };
  const bankDropdownItemClickHandle = function (event) {
    const element = event.target.closest(".field-dropdown-item");
    const name = element.querySelector(".field-dropdown-content").innerHTML;
    const bankName = name.split(" ")[1].trim();
    bankDropdownSelect(bankName);
  };
  const bankDropdownSelect = function (bankName) {
    const item = getBankListV2().filter((item) => item.name === bankName)[0];
    if (!item) return;
    const selectedElement = getElementById("dropdownBankSelected");
    const selectedElementImg = selectedElement.querySelector("img");
    selectedElementImg.src = item.logo;
    selectedElementImg.alt = item.name;
    const selectedElementContent = getElementById("dropdownBankSelectedText");
    selectedElementContent.innerHTML = item.name + ` (${item.code})`;
    selectedBank.current = bankName;
  };
  const fetchUserNameProfile = function () {
    return getProfile()
      .then((resp) => {
        return resp.data.data.username;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  };
  const validate = function () {
    let valid = true;
    const amountElement = getElementById("amoutInput");
    const miniElement = getElementById("minimumAmoutInput");
    const fullnameElement = getElementById("fullnameInput");
    const accountNumberElement = getElementById("accountNumberInput");
    if (controlsTourched.current[controls.current.amount]) {
      if (
        !regularExpress.checkNumber.test(amountElement.value) &&
        amountElement.value
      ) {
        valid &= false;
        controlsErrors.current[controls.current.amount] = "Format Incorrect";
      } else if (!amountElement.value) {
        valid &= false;
        controlsErrors.current[controls.current.amount] = "Require";
      } else {
        delete controlsErrors.current[controls.current.amount];
      }
    }
    if (controlsTourched.current[controls.current.mini]) {
      if (
        !regularExpress.checkNumber.test(miniElement.value) &&
        miniElement.value
      ) {
        valid &= false;
        controlsErrors.current[controls.current.mini] = "Format Incorrect";
      } else if (!miniElement.value) {
        valid &= false;
        controlsErrors.current[controls.current.mini] = "Require";
      } else {
        delete controlsErrors.current[controls.current.mini];
      }
    }
    if (action === actionType.sell) {
      if (controlsTourched.current[controls.current.fullname]) {
        if (!fullnameElement.value) {
          valid &= false;
          controlsErrors.current[controls.current.fullname] = "require";
        } else {
          delete controlsErrors.current[controls.current.fullname];
        }
      }
      if (controlsTourched.current[controls.current.accountNumber]) {
        if (!accountNumberElement.value) {
          valid &= false;
          controlsErrors.current[controls.current.accountNumber] = "require";
        } else {
          delete controlsErrors.current[controls.current.accountNumber];
        }
      }
    }
    return Object.keys(controlsTourched.current).length <= 0
      ? false
      : Boolean(valid);
  };
  const renderControlsError = function () {
    //hide all
    addClassToElementById("amountError", "--visible-hidden");
    addClassToElementById("miniError", "--visible-hidden");
    addClassToElementById("fullnameError", "--visible-hidden");
    addClassToElementById("accountNumberError", "--visible-hidden");
    // check
    if (
      controlsErrors.current[controls.current.amount] &&
      controlsTourched.current[controls.current.amount]
    ) {
      getClassListFromElementById("amountError").remove("--visible-hidden");
      getElementById("amountError").innerHTML =
        controlsErrors.current[controls.current.amount];
    }
    if (
      controlsErrors.current[controls.current.mini] &&
      controlsTourched.current[controls.current.mini]
    ) {
      getClassListFromElementById("miniError").remove("--visible-hidden");
      getElementById("miniError").innerHTML =
        controlsErrors.current[controls.current.mini];
    }
    if (
      controlsErrors.current[controls.current.fullname] &&
      controlsTourched.current[controls.current.fullname]
    ) {
      getClassListFromElementById("fullnameError").remove("--visible-hidden");
      getElementById("fullnameError").innerHTML =
        controlsErrors.current[controls.current.fullname];
    }
    if (
      controlsErrors.current[controls.current.accountNumber] &&
      controlsTourched.current[controls.current.accountNumber]
    ) {
      getClassListFromElementById("accountNumberError").remove(
        "--visible-hidden"
      );
      getElementById("accountNumberError").innerHTML =
        controlsErrors.current[controls.current.accountNumber];
    }
  };
  const controlOnfocusHandle = function (e) {
    const name = e.target.name;
    controlsTourched.current[name] = true;
    validate();
    renderControlsError();
  };
  const controlOnChangeHandle = function () {
    validate();
    renderControlsError();
  };
  const callApiCreateAds = function (data) {
    return new Promise((resolve) => {
      if (callApiStatus.current === api_status.fetching) resolve(null);
      else callApiStatus.current = api_status.fetching;
      companyAddAds(data)
        .then((resp) => {
          callApiStatus.current = api_status.fulfilled;
          showToast(showAlertType.success, resp.data.message);
          getElementById("buyAdsForm").reset();
          resolve(resp);
        })
        .catch((error) => {
          callApiStatus.current = api_status.rejected;
          console.log(error);
          const mess = error?.response?.data?.message;
          switch (mess) {
            case "Insufficient balance":
              showAlert(showAlertType.error, mess);
              break;

            default:
              showAlert(showAlertType, t("anErrorHasOccurred"));
              break;
          }
          resolve(null);
        });
    });
  };
  const submitHandle = async function (event) {
    if (event) {
      event.preventDefault();
    }
    //validation
    for (const item of Object.entries(controls.current)) {
      controlsTourched.current[item.at(0)] = true;
    }
    const isValid = validate();
    renderControlsError();
    if (!isValid) return;
    // get data
    showLoadingButtonSubmit();
    const amout = getElementById("amoutInput").value;
    const mini = getElementById("minimumAmoutInput").value;
    const fullname = getElementById("fullnameInput").value;
    const accountNumber = getElementById("accountNumberInput").value;
    const sendData = {};
    sendData.amount = Number(amout);
    sendData.amountMinimum = Number(mini);
    sendData.symbol = currentCoin;
    sendData.side = action;
    if (action === actionType.sell) {
      sendData.bankName = selectedBank.current;
      sendData.ownerAccount = fullname;
      sendData.numberBank = accountNumber;
    }
    await callApiCreateAds(sendData);
    closeLoadingButtonSubmit();
  };
  const showLoadingButtonSubmit = function () {
    addClassToElementById("buttonSubmit", "disable");
    getClassListFromElementById("buttonSubmitLoader").remove("--d-none");
  };
  const closeLoadingButtonSubmit = function () {
    getClassListFromElementById("buttonSubmit").remove("disable");
    addClassToElementById("buttonSubmitLoader", "--d-none");
  };
  const buyOrSellDirect = function () {
    if (action === actionType.buy) {
      history.push(url.create_ads_sell);
    } else {
      history.push(url.create_ads_buy);
    }
  };
  const modalButtonCreateClickHandle = function () {
    modalPreviewHandleCancel();
    submitHandle();
  };
  //
  return (
    <div className="create-buy-ads fadeInBottomToTop">
      <div className="container">
        <div className="box">
          <h2 className="title">
            {action === actionType.buy
              ? "Create New Buy Advertisement"
              : "Create New Sell Advertisement"}
          </h2>
          <span onClick={buyOrSellDirect} className="switch">
            {action === actionType.buy
              ? "Do you want to sell?"
              : "Do you want to buy?"}
          </span>
          <div className="head-area">
            <h2>Ads to buy {currentCoin}</h2>
            <div>
              Market buy price:{" "}
              <span
                id="marketBuyPrice"
                className="create-buy-ads__head-area-price"
              >
                ---
              </span>
            </div>
            <i
              className="fa-solid fa-pen-to-square"
              onClick={showCoinModal}
            ></i>
          </div>
          <form id="buyAdsForm">
            <div className="amount-area">
              <h2>Amount</h2>
              <div className="field">
                <label>Amount of {currentCoin}:</label>
                <input
                  onChange={controlOnChangeHandle}
                  onFocus={controlOnfocusHandle}
                  name="amount"
                  key={"a1va"}
                  id="amoutInput"
                />
                <small id="amountError" className="--visible-hidden">
                  Errro
                </small>
              </div>
              <div className="field">
                <label>Minimum {currentCoin} amount:</label>
                <input
                  onChange={controlOnChangeHandle}
                  onFocus={controlOnfocusHandle}
                  name="mini"
                  key={"a2va"}
                  id="minimumAmoutInput"
                />
                <small id="miniError" className="--visible-hidden">
                  Errro
                </small>
              </div>
            </div>
            <div
              className={`payment-area ${
                action === actionType.buy ? "--d-none" : ""
              }`}
            >
              <h2>Payment details</h2>
              <div className="field --d-none">
                <label>Payment method:</label>
              </div>
              <div className="field">
                <label>Bank name:</label>
                <div
                  id="dropdownBankSelected"
                  onClick={toggleDropdownBank}
                  className="field__dropdown-selected"
                >
                  <span>
                    <img
                      src={process.env.PUBLIC_URL + "/img/iconen.png"}
                      alt={"currentLanguage"}
                    />
                  </span>
                  <span id="dropdownBankSelectedText">thien</span>
                  <span>
                    <i className="fa-solid fa-chevron-down"></i>
                  </span>
                </div>
                <div
                  id="dropdownBankMenu"
                  className="field-dropdown-menu-container"
                >
                  <ul className="field-dropdown-menu"></ul>
                </div>
              </div>
              <div className="field">
                <label htmlFor="fullnameInput">Full name:</label>
                <input
                  onChange={controlOnChangeHandle}
                  onFocus={controlOnfocusHandle}
                  id="fullnameInput"
                  name="fullname"
                  type="text"
                />
                <small id="fullnameError" className="--visible-hidden">
                  2
                </small>
              </div>
              <div className="field">
                <label htmlFor="accountNumberInput">Account number: </label>
                <input
                  onChange={controlOnChangeHandle}
                  onFocus={controlOnfocusHandle}
                  id="accountNumberInput"
                  name="accountNumber"
                  type="text"
                />
                <small id="accountNumberError" className="--visible-hidden">
                  2
                </small>
              </div>
            </div>
            <div className="review-area">
              <span onClick={showModalPreview}>
                <i className="fa-solid fa-eye"></i>
                <span>Review your ad</span>
              </span>
            </div>
            <div className="button-area">
              <button
                id="buttonSubmit"
                onClick={submitHandle}
                type="submit"
                className="button-area-primary"
              >
                <div id="buttonSubmitLoader" className="loader --d-none"></div>
                Create new advertisement
              </button>
            </div>
          </form>
        </div>
      </div>
      <Modal
        title="Choose your coin"
        open={isModalCoinVisible}
        onOk={modalCoinHandleOk}
        onCancel={modalCoinHandleCancel}
        footer={null}
        width={400}
      >
        <div className="create-buy-ads__modal-coin" style={{ padding: 20 }}>
          {data.current.map((item, i) => {
            return (
              <Button
                className="btn-choice-coin"
                type={item.name === currentCoin ? "primary" : "default"}
                key={i}
                onClick={() => {
                  setCurrentCoin(item.name);
                  setIsModalCoinVisible(false);
                }}
              >
                <img
                  className="create-buy-ads__modal-image"
                  src={DOMAIN + item.image}
                  alt={item.image}
                />
                {item.name}
              </Button>
            );
          })}
        </div>
      </Modal>
      <Modal
        open={isModalPreviewOpen}
        onOk={modalPreviewHandleOk}
        onCancel={modalPreviewHandleCancel}
        footer={null}
      >
        <div className="create-buy-ads__modal-preview">
          <div className="create-buy-ads__modal-preview-header">
            Preview
            <span
              onClick={modalPreviewHandleCancel}
              className="create-buy-ads__modal-preview-close"
            >
              <i className="fa-solid fa-xmark"></i>
            </span>
          </div>
          <div className="create-buy-ads__modal-preview-body">
            <table>
              <tbody>
                <tr>
                  <td>User name: </td>
                  <td id="modalPreviewUserName">123</td>
                </tr>
                <tr>
                  <td>Price: </td>
                  <td id="modalPreviewPrice">test</td>
                </tr>
                <tr>
                  <td>Amount: </td>
                  <td id="modalPreviewAmount">test</td>
                </tr>
                <tr>
                  <td>Amount Minimum: </td>
                  <td id="modalPreviewMinimumAmount">test</td>
                </tr>
                <tr>
                  <td>Bank name: </td>
                  <td id="modalBankName">test</td>
                </tr>
                <tr>
                  <td>Action: </td>
                  <td id="modalAction">test</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="create-buy-ads__modal-preview-footer">
            <button onClick={modalButtonCreateClickHandle}>Create</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}