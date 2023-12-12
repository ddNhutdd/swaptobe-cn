/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Button, Empty } from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
  convertStringToNumber,
  formatStringNumberCultureUS,
  getLocalStorage,
  roundDecimalValues,
} from "src/util/common";
import {
  api_status,
  defaultLanguage,
  localStorageVariable,
  showAlertType,
  url,
} from "src/constant";
import i18n from "src/translation/i18n";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { Pagination, Spin } from "antd";
import { DOMAIN } from "src/util/service";
import { useHistory } from "react-router-dom";
import {
  getAmountCoin,
  getCoin,
  getUserWallet,
} from "src/redux/constant/coin.constant";
import { getHistorySwapApi, swapCoinApi } from "src/util/userCallApi";
import { showAlert } from "src/function/showAlert";
import { showToast } from "src/function/showToast";
import { userWalletFetchCount } from "src/redux/actions/coin.action";
import { showConfirm } from "src/function/showConfirm";
import { getListCoinRealTime } from "src/redux/constant/listCoinRealTime.constant";
import socket from "src/util/socket";
export default function Swap() {
  //
  const { isLogin } = useSelector((root) => root.loginReducer);
  const history = useHistory();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const data = useSelector(getListCoinRealTime) ?? [];
  const data2 = useSelector(getListCoinRealTime) ?? [];
  const [swapFromCoin, setSwapFromCoin] = useState(useSelector(getCoin));
  const [swapToCoin, setSwapToCoin] = useState("USDT");
  const amountCoin = useSelector(getAmountCoin);
  const userWallet = useSelector(getUserWallet);
  const [fromCoinValueString, setFromCoinValueString] = useState(
    amountCoin > 0 ? amountCoin.toString() : ""
  );
  const [toCoinValueString, setToCoinValueString] = useState("");
  const [searchCoinName, setSearchCoinName] = useState("");
  const searchCoinResult = useRef();
  const [coinSwapHistory, setCoinSwapHistory] = useState([]);
  const [callApiHistoryStatus, setCallApiHistoryStatus] = useState(
    api_status.pending
  );
  const [callApiSwapStatus, setCallApiSwapStatus] = useState(
    api_status.pending
  );
  const [swapHistoryCurrentPage, setSwapHistoryCurrentPage] = useState(1);
  const [swapHistoryTotalPage, setSwapHistoryTotalPage] = useState(1);
  const allCoinPrice = useRef([]);
  const dispatch = useDispatch();
  useEffect(() => {
    //
    const language =
      getLocalStorage(localStorageVariable.lng) || defaultLanguage;
    i18n.changeLanguage(language);
    //
    const element = document.querySelector(".swap");
    element.classList.add("fadeInBottomToTop");
    //
    socket.once("listCoin", (resp) => {
      if (resp && resp.length > 0) allCoinPrice.current = resp;
    });
  }, []);
  useEffect(() => {}, [userWallet]);
  useEffect(() => {
    if (data.length > 0) {
      setToCoinValueCalc();
    }
  }, [fromCoinValueString, swapFromCoin, swapToCoin, data]);
  useEffect(() => {
    fetchCoinSwapHistory();
  }, [swapFromCoin, swapToCoin, swapHistoryCurrentPage]);
  //
  const { t } = useTranslation();
  const showModal = () => setIsModalVisible(true);
  const handleOk = () => setIsModalVisible(false);
  const handleCancel = () => {
    setSearchCoinName("");
    setIsModalVisible(false);
  };
  const showModal2 = () => setIsModalVisible2(true);
  const handleOk2 = () => setIsModalVisible2(false);
  const handleCancel2 = () => {
    setSearchCoinName("");
    setIsModalVisible2(false);
  };
  const transfer = () => {
    const currentFrom = swapFromCoin;
    const currentTo = swapToCoin;
    setSwapFromCoin(currentTo);
    setSwapToCoin(currentFrom);
  };
  const fromCoinOnChange = function (e) {
    const inputValue = e.target.value;
    const inputValueWithoutComma = inputValue.replace(/,/g, "");
    const regex = /^$|^[0-9]+(\.[0-9]*)?$/;
    if (!regex.test(inputValueWithoutComma)) {
      setFromCoinValueString(inputValue.slice(0, -1));
      return;
    }
    const inputValueFormated = formatStringNumberCultureUS(
      inputValueWithoutComma
    );
    setFromCoinValueString(inputValueFormated);
    //
  };
  const setToCoinValueCalc = function () {
    if (data.length > 0) {
      const fromCoin = convertStringToNumber(fromCoinValueString);
      const fromPrice = data.filter((item) => item.name === swapFromCoin)[0]
        .price;
      const toPrice = data.filter((item) => item.name === swapToCoin)[0].price;
      const result = convertCacl(fromCoin, fromPrice, toPrice);
      setToCoinValueString(formatStringNumberCultureUS(result.toString()));
    }
  };
  const coinPriceDifference = function () {
    if (data.length > 0) {
      const stringConvertCacl = formatStringNumberCultureUS(
        convertCacl(
          1,
          data.filter((item) => item.name === swapFromCoin)[0].price,
          data.filter((item) => item.name === swapToCoin)[0].price
        ).toString()
      );
      const coinValue = data.filter((item) => item.name === swapToCoin)[0]
        .price;
      const result = roundDecimalValues(
        convertStringToNumber(stringConvertCacl),
        coinValue
      );
      return formatStringNumberCultureUS(result.toString());
    }
  };
  const convertCacl = function (inputValue, fromPrice, toPrice) {
    return (inputValue * fromPrice) / toPrice;
  };
  const searchCoinOnChange = function (e) {
    setSearchCoinName(e.target.value);
  };
  const mainButtonOnClickHandle = function () {
    if (isLogin && callApiSwapStatus !== api_status.fetching) {
      setCallApiSwapStatus(api_status.fetching);
      const swapValue = convertStringToNumber(fromCoinValueString);
      const maxAvailable = convertStringToNumber(
        userWallet[swapFromCoin.toLowerCase() + "_balance"].toString()
      );
      if (swapValue <= 0) {
        showAlert(showAlertType.error, t("invalidValue"));
        setCallApiSwapStatus(api_status.rejected);
        return;
      } else if (swapValue > maxAvailable) {
        showAlert(
          showAlertType.error,
          t("theAmountOfCryptocurrencyIsInsufficient. ")
        );
        setCallApiSwapStatus(api_status.rejected);
        return;
      }
      showConfirm(
        t(
          `bạn có muốn đổi <span class="confirm-green">${fromCoinValueString}</span> <span class="confirm-green">${swapFromCoin}</span> sang <span class="confirm-green">${toCoinValueString}</span> <span class="confirm-green">${swapToCoin}</span> hay không?`
        ),
        () => {
          console.log("confirm");
          swapCoinApi({
            symbolForm: swapFromCoin,
            symbolTo: swapToCoin,
            amountForm: convertStringToNumber(fromCoinValueString).toString(),
          })
            .then((resp) => {
              showToast(
                showAlertType.success,
                resp?.data?.message || t("anErrorHasOccurred")
              );
              fetchCoinSwapHistory();
              // sau khi swap tải lại thông tin để render cho các component khác
              dispatch(userWalletFetchCount());
              setCallApiSwapStatus(api_status.fulfilled);
            })
            .catch((error) => {
              const responseError = error?.response?.data?.message;
              switch (responseError) {
                case "Insufficient balance":
                  showAlert(showAlertType.error, t("insufficientBalance"));
                  break;
                default:
                  showAlert(showAlertType.error, t("anErrorHasOccurred"));
                  break;
              }
              setCallApiSwapStatus(api_status.rejected);
            });
        },
        () => {
          console.log("khong");
          setCallApiSwapStatus(api_status.rejected);
        }
      );
    } else if (!isLogin) {
      history.push(url.login);
    }
  };
  const fetchCoinSwapHistory = function () {
    setCallApiHistoryStatus(api_status.fetching);
    getHistorySwapApi({
      symbolForm: swapFromCoin,
      symbolTo: swapToCoin,
      limit: "10",
      page: swapHistoryCurrentPage,
    })
      .then((resp) => {
        setCoinSwapHistory(resp.data.data.array);
        setSwapHistoryTotalPage(resp.data.data.total);
        setCallApiHistoryStatus(api_status.fulfilled);
      })
      .catch((error) => {
        console.log(error);
        setCallApiHistoryStatus(api_status.rejected);
      });
  };
  const renderCoinSwapHistory = function () {
    if (callApiHistoryStatus === api_status.fetching) {
      return (
        <div
          style={{
            width: "100%",
            height: "100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin />
        </div>
      );
    } else if (
      callApiHistoryStatus !== api_status.fetching &&
      coinSwapHistory.length <= 0
    ) {
      return <Empty />;
    } else if (
      callApiHistoryStatus !== api_status.fetching &&
      coinSwapHistory.length > 0
    ) {
      return (
        <div className="swap__history fadeInBottomToTop">
          {coinSwapHistory.map((item, index) => (
            <div key={index} className="swap__history-item">
              <div className="swap__history-time">
                <i className="fa-solid fa-calendar"></i> {item.created_at}
              </div>
              <div className="swap__history-item-main">
                <span>{item.coin_key}: </span>
                <span className="swap__history-minus">
                  -{item.amount} coins
                </span>
                <span>{item.wallet}: </span>
                <span className="swap__history-add">
                  +
                  {roundDecimalValues(
                    item.wallet_amount,
                    allCoinPrice.current.filter(
                      (it) => it.name === item.wallet
                    )[0]?.price
                  )}{" "}
                  coins
                </span>
              </div>
              <div className="swap__history-final">
                <span>Rate {item.wallet}:</span>
                <span>
                  {roundDecimalValues(
                    item.rate,
                    allCoinPrice.current.filter(
                      (it) => it.name === item.wallet
                    )[0]?.price
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };
  const historyPagingOnChangeHandle = function (page) {
    setSwapHistoryCurrentPage(page);
  };
  return (
    <div className="swap">
      <div className="container">
        <div className="box">
          <h2 className="title">{t("swap")}</h2>
          <div className="field">
            <label>
              {t("amountOf")} {swapFromCoin}
            </label>
            <div className="input-area">
              <input
                style={{ paddingRight: "55px" }}
                className="swap__input"
                value={fromCoinValueString}
                onChange={fromCoinOnChange}
              />
              <button className="max">{t("max")}</button>

              <button className="selectBtn" onClick={showModal}>
                <div className="selectBtn-container">
                  <img
                    src={`https://remitano.dk-tech.vn/images/${swapFromCoin}.png`}
                    alt="swapFromCoin"
                  />
                  {swapFromCoin}
                  <i className="fa-solid fa-caret-down"></i>
                </div>
              </button>
            </div>
            <div>
              Số dư:{" "}
              {isLogin
                ? userWallet[swapFromCoin.toLowerCase() + "_balance"] ?? 0
                : ""}
            </div>
          </div>
          <div style={{ textAlign: "center", margin: 20 }}>
            <Button
              type="primary"
              shape="circle"
              onClick={transfer}
              size="large"
            >
              <i className="fa-solid fa-up-down" style={{ fontSize: 16 }}></i>
            </Button>
          </div>
          <div className="field">
            <label>
              {t("amountOf")} {swapToCoin}
            </label>
            <div className="input-area">
              <input
                className="swap__input"
                value={toCoinValueString}
                readOnly
              />
              <button className="selectBtn" onClick={showModal2}>
                <div className="selectBtn-container">
                  <img
                    src={`https://remitano.dk-tech.vn/images/${swapToCoin}.png`}
                    alt="swapToCoin"
                  />
                  {swapToCoin}
                  <i className="fa-solid fa-caret-down"></i>
                </div>
              </button>
            </div>
            <span style={{ display: "block", marginTop: 8 }}>
              1 {swapFromCoin} = {coinPriceDifference()} {swapToCoin}
            </span>
          </div>
          <button
            onClick={mainButtonOnClickHandle}
            className={`buyBtn ${
              callApiSwapStatus === api_status.fetching ? "disabled" : ""
            }`}
            size="large"
            type="primary"
          >
            {isLogin ? t("buy") + " " + swapToCoin : t("login")}
          </button>
        </div>
        <div className="box" style={{ marginTop: 30 }}>
          <h2 className="title">{t("swapOrder")}</h2>
          {renderCoinSwapHistory()}
          <div className="swap__history-paging">
            <Pagination
              onChange={historyPagingOnChangeHandle}
              total={swapHistoryTotalPage}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
      <Modal
        title="Swap from"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div style={{ padding: 20 }}>
          <input
            className="swap__modal-search"
            type="text"
            value={searchCoinName}
            placeholder="Enter the coin name."
            onChange={searchCoinOnChange}
          />
          <div ref={searchCoinResult}>
            {data
              .filter((item) =>
                item.name.toLowerCase().includes(searchCoinName.toLowerCase())
              )
              .map((item, i) => {
                return (
                  <Button
                    className="btn-choice-coin"
                    type={item.name === swapFromCoin ? "primary" : "default"}
                    key={i}
                    onClick={() => {
                      setSwapFromCoin(item.name);
                      setIsModalVisible(false);
                      setSearchCoinName("");
                    }}
                  >
                    <div className="btn-choice-coin-content">
                      <img src={DOMAIN + item.image} alt={item.image} />
                      <span>{item.name}</span>
                    </div>
                  </Button>
                );
              })}
          </div>
        </div>
      </Modal>
      <Modal
        title="Swap to"
        open={isModalVisible2}
        onOk={handleOk2}
        onCancel={handleCancel2}
        footer={null}
      >
        <div style={{ padding: 20 }}>
          <input
            className="swap__modal-search"
            type="text"
            value={searchCoinName}
            placeholder="Enter the coin name."
            onChange={searchCoinOnChange}
          />
          {data2
            .filter((item) =>
              item.name.toLowerCase().includes(searchCoinName.toLowerCase())
            )
            .map((item, i) => {
              return (
                <Button
                  className="btn-choice-coin"
                  type={item.name === swapToCoin ? "primary" : "default"}
                  key={i}
                  onClick={() => {
                    setSwapToCoin(item.name);
                    setSearchCoinName("");
                    setIsModalVisible2(false);
                  }}
                >
                  <div className="btn-choice-coin-content">
                    <img src={DOMAIN + item.image} alt={item.image} />
                    <span>{item.name}</span>
                  </div>
                </Button>
              );
            })}
        </div>
      </Modal>
    </div>
  );
}
