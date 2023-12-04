/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Spin, Pagination, Empty } from "antd";
import {
  convertStringToNumber,
  formatStringNumberCultureUS,
  getLocalStorage,
} from "src/util/common";
import { useSelector } from "react-redux";
import i18n, { availableLanguage } from "src/translation/i18n";
import {
  api_status,
  api_url,
  localStorageVariable,
  showAlertType,
} from "src/constant";
import {
  getHistoryWidthdraw,
  transferToAddress,
  transferToUsername,
} from "src/util/userCallApi";
import { getCoin, getUserWallet } from "src/redux/constant/coin.constant";
import { showToast } from "src/function/showToast";
import { showAlert } from "src/function/showAlert";
import { historytransfer as historytransferApi } from "src/util/userCallApi";
function FormWithdraw() {
  //
  const form = {
    Wallet: "wallet",
    Aliases: "Aliases",
  };
  const withdrawTypeEnum = {
    TRC20: "TRC20",
    ERC20: "ERC20",
    BEP20: "BEP20",
  };
  //
  const [showForm, setShowForm] = useState(form.Wallet);
  const { t } = useTranslation();
  const [withdrawType, setWithdrawType] = useState(withdrawTypeEnum.TRC20);
  const [inputAmountCurrency, setInputAmountCurrency] = useState("");
  const inputNoteValue = useRef();
  const formWallet = useRef();
  const userNameInputElement = useRef();
  const withdrawHistoryCurrentPage = useRef(1);
  const transferHistoryCurrentPage = useRef(1);
  const addressElement = useRef();
  const messageElement = useRef();
  const coin = useSelector(getCoin);
  const userWallet = useSelector(getUserWallet);
  const [callApiSubmitStatus, setCallApiSubmitStatus] = useState(
    api_status.pending
  );
  const [callApiGetWithdrawHistoryStatus, setCallApiGetWithdrawHistoryStatus] =
    useState(api_status.pending);
  const [callApiGetTransferHistoryStatus, setCallApiGetTransferHistoryStatus] =
    useState(api_status.pending);
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [historytransfer, setHistoryTransfer] = useState([]);
  const [withdrawHistoryTotalItems, setWithdrawHistoryTotalItems] = useState(1);
  const [transferHistoryTotalItems, setTransferHistoryTotalItems] = useState(1);
  useEffect(() => {
    const language =
      getLocalStorage(localStorageVariable.lng) || availableLanguage.vi;
    i18n.changeLanguage(language);
    fetchWithdrawHistory();
    fetTransferHistory();
    document
      .getElementsByClassName("FormWithdraw")[0]
      .classList.add("fadeInBottomToTop");
  }, []);
  const headerItemClickHandle = function (value) {
    setShowForm(() => value);
    setInputAmountCurrency("");
  };
  const inputAmountCurrencyOnChangeHandles = function (e) {
    const inputValue = e.target.value;
    const inputValueWithoutComma = inputValue.replace(/,/g, "");
    const regex = /^$|^[0-9]+(\.[0-9]*)?$/;
    if (!regex.test(inputValueWithoutComma)) {
      setInputAmountCurrency(inputValue.slice(0, -1));
      return;
    }
    const inputValueFormated = formatStringNumberCultureUS(
      inputValueWithoutComma
    );
    setInputAmountCurrency(inputValueFormated);
  };
  const submitFormWalletHandle = function (e) {
    e.preventDefault();
    if (callApiSubmitStatus !== api_status.fetching) {
      setCallApiSubmitStatus(api_status.fetching);
      transferToAddress({
        to_address: addressElement.current.value,
        symbol: coin,
        amount: convertStringToNumber(inputAmountCurrency).toString(),
        note: inputNoteValue.current.value,
        type: "1",
      })
        .then(() => {
          showToast(
            showAlertType.success,
            t("createASuccessfulMoneyTransferOrderWaitingForAdminApproval")
          );
          setCallApiSubmitStatus(api_status.fulfilled);
          formWallet.current.reset();
          setInputAmountCurrency("");
          withdrawHistoryCurrentPage.current = 1;
          addressElement.current.value = "";
          fetchWithdrawHistory();
        })
        .catch((error) => {
          console.log(error);
          const messageError = error?.response?.data?.message;
          switch (messageError) {
            case "Insufficient balance or incorrect withdrawal minimum amount.":
              showAlert(
                showAlertType.error,
                t("insufficientBalanceOrWithdrawalAmount")
              );
              break;
            default:
              showAlert(showAlertType.error, t("anErrorHasOccurred"));
              break;
          }
          setCallApiSubmitStatus(api_status.rejected);
        });
    }
  };
  const fetchWithdrawHistory = function () {
    setCallApiGetWithdrawHistoryStatus(api_status.fetching);
    getHistoryWidthdraw({
      symbol: coin,
      limit: "10",
      page: withdrawHistoryCurrentPage.current,
    })
      .then((resp) => {
        setWithdrawHistory(resp.data.data.array);
        setWithdrawHistoryTotalItems(resp.data.data.total);
        setCallApiGetWithdrawHistoryStatus(api_status.fulfilled);
      })
      .catch((error) => {
        console.log(error);
        setCallApiGetWithdrawHistoryStatus(api_status.rejected);
      });
  };
  const renderWithdrawHistory = function () {
    if (callApiGetWithdrawHistoryStatus === api_status.fetching) {
      return (
        <div className="loading">
          <Spin />
        </div>
      );
    } else if (
      callApiGetWithdrawHistoryStatus !== api_status.fetching &&
      withdrawHistory.length <= 0
    ) {
      return <Empty />;
    } else if (
      callApiGetWithdrawHistoryStatus !== api_status.fetching &&
      withdrawHistory.length > 0
    ) {
      return (
        <>
          <div className="formWithdraw__title">{t("withdrawalHistory")}</div>
          <div className="formWithdraw__Wallet-list fadeInBottomToTop">
            {withdrawHistory.map((item) => (
              <div key={item.id} className="formWithdraw__Wallet-item">
                <div className="formWithdraw__Wallet-header">
                  <i className="fa-solid fa-calendar"></i>
                  {item.created_at}
                </div>
                <div className="formWithdraw__Wallet-body">
                  <div>Coin: {item.wallet.toUpperCase()}</div>
                  <div>
                    {t("note")}: {item.note}
                  </div>
                  <div>
                    {t("amount")}: {item.amount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      );
    }
  };
  const withdrawHistoryPagingOnChangeHandle = function (page) {
    withdrawHistoryCurrentPage.current = page;
    fetchWithdrawHistory();
  };
  const getMaxAvailable = function () {
    return userWallet[coin.toLowerCase() + "_balance"];
  };
  const transferToUserNameSubmitHandle = function (e) {
    e.preventDefault();
    if (callApiSubmitStatus === api_status.fetching) {
      return;
    }
    setCallApiSubmitStatus(api_status.fetching);

    transferToUsername({
      symbol: coin,
      userName: userNameInputElement.current.value,
      amount: inputAmountCurrency,
      note: messageElement.current.value,
    })
      .then((resp) => {
        showToast(showAlertType.success, t("transferSuccessful"));
        userNameInputElement.current.value = "";
        setInputAmountCurrency("");
        messageElement.current.value = "";
        transferHistoryCurrentPage.current = 1;
        fetTransferHistory();
        setCallApiSubmitStatus(api_status.fulfilled);
      })
      .catch((error) => {
        const errorMessage = error?.response?.data?.message;
        console.log(error?.response?.data, errorMessage);
        switch (errorMessage) {
          case "UserName is not exit":
            showAlert(showAlertType.error, t("userNameNotExists"));
            break;
          case "Invalid balance":
            showAlert(showAlertType.error, t("invalidBalance"));
            break;
          case "Not be empty": {
            const errorMessage = error?.response?.data?.errors[0];
            errorMessage === "userName is not empty" &&
              showAlert(showAlertType.error, t("userNameNotEmpty"));
            errorMessage === "amount is not empty" &&
              showAlert(showAlertType.error, t("transferHistory"));
            break;
          }
          default:
            showAlert(showAlertType.error, t("anErrorHasOccurred"));
            break;
        }
        setCallApiSubmitStatus(api_url.rejected);
      });
  };
  const fetTransferHistory = function () {
    setCallApiGetTransferHistoryStatus(api_status.fetching);
    historytransferApi({
      limit: "10",
      page: transferHistoryCurrentPage.current,
      symbol: coin,
    })
      .then((resp) => {
        setHistoryTransfer(resp.data.data.array);
        setTransferHistoryTotalItems(resp.data.data.total);
        setCallApiGetTransferHistoryStatus(api_status.fulfilled);
      })
      .catch((error) => {
        console.log(error);
        setCallApiGetTransferHistoryStatus(api_status.rejected);
      });
  };
  const renderTransferHistory = function () {
    if (callApiGetTransferHistoryStatus === api_status.fetching) {
      return (
        <div className="loading">
          <Spin />
        </div>
      );
    } else if (
      callApiGetTransferHistoryStatus !== api_status.fetching &&
      historytransfer.length <= 0
    ) {
      return <Empty />;
    } else if (
      callApiGetTransferHistoryStatus !== api_status.fetching &&
      historytransfer.length > 0
    ) {
      return (
        <>
          <div className="formWithdraw__title">
            lịch sử chuyển {t("transferHistory")}
            {coin}
          </div>
          <div className="formWithdraw__Wallet-list fadeInBottomToTop">
            {historytransfer.map((item) => (
              <div key={item.id} className="formWithdraw__Wallet-item">
                <div className="formWithdraw__Wallet-header">
                  <i className="fa-solid fa-calendar"></i>
                  {item.created_at}
                </div>
                <div className="formWithdraw__Wallet-body">
                  <div>Coin: {item.coin_key.toUpperCase()}</div>
                  <div>Amount: {item.amount}</div>
                  <div>Type : {item.type_exchange}</div>
                  <div>Note: {item.note}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      );
    }
  };
  const transferHistoryPagingOnChangeHandle = function (page) {
    transferHistoryCurrentPage.current = page;
    fetTransferHistory();
  };
  const maxButtonClickHandle = function () {
    let valueString = getMaxAvailable()?.toString();
    setInputAmountCurrency(formatStringNumberCultureUS(valueString || ""));
  };
  return (
    <div className="container">
      <div className="FormWithdraw">
        <div className="left">
          <div className="header">
            <span
              onClick={() => {
                headerItemClickHandle(form.Wallet);
              }}
              className={`${showForm === form.Wallet ? "active" : ""}  ${
                callApiSubmitStatus === api_status.fetching ? "disabled" : ""
              }`}
            >
              Wallet {coin}
            </span>
            <span
              onClick={() => {
                headerItemClickHandle(form.Aliases);
              }}
              className={`${showForm === form.Aliases ? "active" : ""}  ${
                callApiSubmitStatus === api_status.fetching ? "disabled" : ""
              }`}
            >
              Aliases
            </span>
          </div>
          <form
            ref={formWallet}
            className={`wallet ${showForm !== form.Wallet ? "--d-none" : ""}`}
          >
            <div className="withdraw-type">
              <span
                onClick={() => setWithdrawType("TRC20")}
                className={`withdraw-type-items ${
                  withdrawType === "TRC20" ? "active" : ""
                }`}
              >
                TRC20
              </span>
              <span
                onClick={() => setWithdrawType("ERC20")}
                className={`withdraw-type-items ${
                  withdrawType === "ERC20" ? "active" : ""
                }`}
              >
                ERC20
              </span>
              <span
                onClick={() => setWithdrawType("BEP20")}
                className={`withdraw-type-items ${
                  withdrawType === "BEP20" ? "active" : ""
                }`}
              >
                BEP20
              </span>
            </div>
            <div className="input">
              <p>Address</p>
              <input ref={addressElement} type="text" />
            </div>
            <div className="input">
              <p>{t("note")}</p>
              <input ref={inputNoteValue} type="text" />
            </div>
            <div className="input">
              <p>
                {t("amountOf")} {coin}
              </p>
              <input
                value={inputAmountCurrency}
                onChange={inputAmountCurrencyOnChangeHandles}
                type="text"
              />
              <div className="list-tag">
                <span>{coin}</span>
                <span onClick={maxButtonClickHandle} className="active">
                  MAX
                </span>
              </div>
            </div>
            <div className="max-available">
              <span>{t("maxAvailable")}:</span>{" "}
              <span>
                {getMaxAvailable()} {coin}
              </span>
            </div>
            <ul className="list-notify">
              <li className="notify-item">
                <span>
                  <img src="./img/!.png" alt="" />
                </span>
                <p>
                  {t(
                    "youMustKeepAMinimumOf20TRXInYourWalletToSecureEnoughGasFeesForTradingTRC20Tokens"
                  )}
                </p>
              </li>
              <li className="notify-item">
                <span>
                  <img src="./img/!.png" alt="" />
                </span>
                <p>
                  {t(
                    "youMustKeepAMinimumOf20TRXInYourWalletToSecureEnoughGasFeesForTradingTRC20Tokens"
                  )}
                </p>
              </li>
              <li className="notify-item">
                <span>
                  <img src="./img/!.png" alt="" />
                </span>
                <p>
                  {t(
                    "theOverheadFeesAreNotFixedSubjectToChangeDependingOnTheStateOfTheBlockchainNetworks"
                  )}
                </p>
              </li>
              <li className="notify-item">
                <span>
                  <img src="./img/!.png" alt="" />
                </span>
                <p>{t("estimatedCompletionTime2Minutes")}</p>
              </li>
            </ul>
            <div className="button-submit-container">
              <button
                className={`${
                  callApiSubmitStatus === api_status.fetching ? "disabled" : ""
                }`}
                type="submit"
                onClick={submitFormWalletHandle}
              >
                {t("send")}
              </button>
            </div>
          </form>
          <form
            className={`aliases ${showForm !== form.Aliases ? "--d-none" : ""}`}
          >
            <div className="input">
              <p>{t("userName")}</p>
              <input ref={userNameInputElement} type="text" />
            </div>
            <div className="input">
              <p>
                {t("amountOf")} {coin}
              </p>
              <input
                value={inputAmountCurrency}
                onChange={inputAmountCurrencyOnChangeHandles}
                type="text"
              />
              <div className="list-tag">
                <span>{coin}</span>
              </div>
            </div>
            <div className="max-available">
              <span>{t("maxAvailable")}:</span>{" "}
              <span>
                {getMaxAvailable()} {coin}
              </span>
            </div>
            <div className="input">
              <p>{t("message")}</p>
              <textarea
                ref={messageElement}
                placeholder="I'm fine, tks. And u!"
                cols="30"
                rows="10"
              ></textarea>
            </div>

            <div className="button-submit-container">
              <button
                className={`${
                  callApiSubmitStatus === api_status.fetching ? "disabled" : ""
                }`}
                onClick={transferToUserNameSubmitHandle}
              >
                {t("send")}
              </button>
            </div>
          </form>
        </div>
        <div className="right">
          {showForm === form.Wallet ? (
            <>
              {renderWithdrawHistory()}
              <div className="paging">
                <Pagination
                  onChange={withdrawHistoryPagingOnChangeHandle}
                  total={withdrawHistoryTotalItems}
                />
              </div>
            </>
          ) : (
            <>
              {renderTransferHistory()}
              <div className="paging">
                <Pagination
                  onChange={transferHistoryPagingOnChangeHandle}
                  total={transferHistoryTotalItems}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default FormWithdraw;
