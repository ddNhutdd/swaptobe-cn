/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Card, Modal, Table } from "antd";
import { Spin } from "antd";
import { useHistory } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import P2PTrading2 from "./P2PTrading2";
import { useTranslation } from "react-i18next";
import {
  formatStringNumberCultureUS,
  getLocalStorage,
  setLocalStorage,
} from "src/util/common";
import {
  currency,
  defaultLanguage,
  localStorageVariable,
  url,
} from "src/constant";
import i18n from "src/translation/i18n";
import { DOMAIN } from "src/util/service";
import { coinSetCoin } from "src/redux/actions/coin.action";
import { getCurrent, getExchange } from "src/redux/constant/currency.constant";
import { getListCoinRealTime } from "src/redux/constant/listCoinRealTime.constant";
import PhoneApps from "./PhoneApps";
import { getExchangeRateDisparity } from "src/redux/reducers/exchangeRateDisparitySlice";
//
export default function P2PTrading({ history }) {
  const redirectPage = useHistory();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isLogin = useSelector((state) => state.loginReducer.isLogin);
  const data = useSelector(getListCoinRealTime);
  const [sellPrice, setSellPrice] = useState(0);
  const [buyPrice, setBuyPrice] = useState(0);
  const [coinImage, setCoinImage] = useState(DOMAIN + "images/BTC.png");
  const { coin } = useSelector((root) => root.coinReducer);
  const userSelectedCurrency = useSelector(getCurrent);
  const exChangeFromRedux = useSelector(getExchange);
  const exchangeRateDisparityFromRedux = useSelector(getExchangeRateDisparity);
  const exchange = useRef();
  const [coinFullName, setCoinFullName] = useState();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  useEffect(() => {
    setLocalStorage(localStorageVariable.coin, coin);
    //
    const language =
      getLocalStorage(localStorageVariable.lng) || defaultLanguage;
    i18n.changeLanguage(language);
    //
    const element = document.querySelector(".p2ptrading");
    element.classList.add("fadeInBottomToTop");
    //
  }, []);
  useEffect(() => {
    if (data && data.length !== 0) {
      const x = data.find((item) => item.name === coin);
      setBuyPrice(x?.price + (x?.price / 100) * exchangeRateDisparityFromRedux);
      setSellPrice(
        x?.price - (x?.price / 100) * exchangeRateDisparityFromRedux
      );
      setCoinFullName(x?.token_key);
      setCoinImage(DOMAIN + x?.image);
    }
  }, [data, coin]);
  useEffect(() => {
    exchange.current = exChangeFromRedux;
  }, [exChangeFromRedux]);
  //
  const showModal = () => setIsModalVisible(true);
  const handleOk = () => setIsModalVisible(false);
  const handleCancel = () => setIsModalVisible(false);
  const handleSelectedRow = (record) => {
    setIsModalVisible(false);
    setLocalStorage(localStorageVariable.coin, record.name);
    dispatch(coinSetCoin(record.name));
  };
  const columns = [
    {
      title: t("name"),
      key: "coinName",
      dataIndex: "token_key",
      render: (_, record) => {
        return (
          <span
            style={{
              cursor: "pointer",
              display: "flex",
              gap: "5px",
              alignItems: "flex-start",
            }}
            onClick={() => handleSelectedRow(record)}
          >
            <img
              style={{
                display: "block",
                width: "20px",
                height: "20px",
                objectFit: "cover",
                marginTop: "1px",
              }}
              src={DOMAIN + record.image}
              alt={record.token_key}
            />
            {record.token_key} - {record.name}
          </span>
        );
      },
    },
    {
      title: t("24hChange"),
      key: "24hChange",
      dataIndex: "percent",
      render: (_, { percent }) => {
        let color = "black";
        if (percent > 0) {
          color = "green";
        } else if (percent < 0) {
          color = "red";
        }
        return <span style={{ color: color }}>{percent}%</span>;
      },
    },
    {
      title: t("price"),
      key: "price",
      dataIndex: "price",
      width: "25%",
      render: (_, { price }) => {
        return (
          <span>
            {formatStringNumberCultureUS(convertCurrency(price).toFixed(3))}
            {userSelectedCurrency === currency.usd && "$"}
            {userSelectedCurrency === currency.eur && "€"}
            {userSelectedCurrency === currency.vnd && "đ"}
          </span>
        );
      },
    },
    {
      title: t("24hVolume"),
      key: "24hVolume",
      dataIndex: "volume",
    },
  ];
  const convertCurrency = function (usd) {
    if (
      !exchange.current ||
      exchange.current.length <= 0 ||
      !userSelectedCurrency
    )
      return;
    const rate =
      exchange.current.filter((item) => item.title === userSelectedCurrency)[0]
        ?.rate || 0;
    return usd * rate;
  };
  const buyNowClickHandle = function () {
    if (isLogin) {
      redirectPage.push(url.create_ads_buy);
    } else {
      redirectPage.push(url.login);
    }
  };
  const sellNowClickHandle = function () {
    if (isLogin) {
      redirectPage.push(url.create_ads_sell);
    } else {
      redirectPage.push(url.login);
    }
  };
  //
  return (
    <>
      <div className="p2ptrading">
        <div className="container">
          <div className="top box">
            <div>
              <img src={coinImage} alt={coin} />
              <span>{coinFullName}</span>
            </div>
            <Button onClick={showModal}>{t("chooseAnother")} </Button>
          </div>
          <div className="center">
            <div className="left box">
              <div className="left1">
                <i className="fa-solid fa-flag"></i>
                <span>{t("sellingPrice")}:</span>
              </div>
              <div className="left2">
                {formatStringNumberCultureUS(
                  convertCurrency(sellPrice)?.toFixed(3) ?? ""
                )}
                <span> {userSelectedCurrency}</span>
              </div>
              <Button onClick={buyNowClickHandle} className="buyNowBtn">
                {t("buyNow")}
              </Button>
            </div>
            <div className="right box">
              <div className="right1">
                <i className="fa-solid fa-flag"></i>
                <span>{t("buyingPrice")}:</span>
              </div>
              <div className="right2">
                {formatStringNumberCultureUS(
                  convertCurrency(buyPrice)?.toFixed(3) ?? ""
                )}
                <span> {userSelectedCurrency}</span>
              </div>
              <Button onClick={sellNowClickHandle} className="sellNowBtn">
                {t("sellNow")}
              </Button>
            </div>
          </div>
          <div className="bottom box">
            <i className="fa-solid fa-bolt"></i>
            {t("receiveBitcoinWithin15MinutesOrBeRefunded")}
            <span>{t("moreDetails")}</span>
          </div>
        </div>
        <Modal
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <Card bodyStyle={{ padding: "0" }}>
            {data && data.length ? (
              <Table
                className="p2ptrading__table"
                columns={columns}
                dataSource={data}
                rowKey={(record) => record.id}
                pagination={{
                  onChange: () => {
                    setTimeout(() => {
                      document.querySelector(".ant-modal-wrap").scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }, 0);
                  },
                }}
              />
            ) : (
              <div className="p2ptrading__model-spinner-container">
                <Spin style={{ width: "100%" }} />
              </div>
            )}
          </Card>
        </Modal>
      </div>
      <P2PTrading2 history={history} />
      <PhoneApps />
    </>
  );
}
