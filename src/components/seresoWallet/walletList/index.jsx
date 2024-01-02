/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import i18n, { availableLanguage } from "src/translation/i18n";
import {
  currency,
  image_domain,
  localStorageVariable,
  url,
} from "src/constant";
import { formatStringNumberCultureUS, getLocalStorage } from "src/util/common";
import { DOMAIN } from "src/util/service";
import { Spin } from "antd";
import { coinSetAmountCoin, coinSetCoin } from "src/redux/actions/coin.action";
import { useHistory } from "react-router-dom";
import { getUserWallet } from "src/redux/constant/coin.constant";
import { getCurrent, getExchange } from "src/redux/constant/currency.constant";
import { getListCoinRealTime } from "src/redux/constant/listCoinRealTime.constant";
import {
  actionContent,
  setShow as setShowContent,
} from "src/redux/reducers/wallet2Slice";
import {
  form,
  setShow as setShowWithdrawTab,
} from "src/redux/reducers/walletWithdraw";
function SeresoWalletList() {
  //
  const history = useHistory();
  const allCoin = useSelector(getListCoinRealTime);
  const myListCoin = useSelector(getUserWallet);
  const userSelectedCurrency = useSelector(getCurrent);
  const exchange = useSelector(getExchange);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => {
    //lay ngon ngu khi load page
    const language =
      getLocalStorage(localStorageVariable.lng) || availableLanguage.vi;
    i18n.changeLanguage(language);
  }, []);

  const getMyCoin = function (coinName) {
    if (myListCoin) {
      const key = coinName.toLowerCase() + "_balance";
      return myListCoin[key] ? myListCoin[key] : 0;
    }
  };
  const swapOnClickHandle = function (coinName, amount) {
    dispatch(coinSetCoin(coinName));
    dispatch(coinSetAmountCoin(amount));
    history.push(url.swap);
  };
  const convertCurrency = function (usd, currency, exchange) {
    if (usd === 0) return 0;
    if (!usd || !currency || !exchange || !exchange.length) return -1;
    const rate =
      exchange.filter((item) => item.title === currency)[0]?.rate ?? 0;
    return (usd * rate).toFixed(3);
  };
  const renderListCurrency = (listCurrencyData) => {
    return listCurrencyData?.map((item) => (
      <li key={item.token_key} className="list-item">
        <div className="name">
          <img src={DOMAIN + item.image} alt=".." />
          <span>{item.name}</span>
          <div>{item.token_key}</div>
        </div>
        <div className="price">
          <span>
            {formatStringNumberCultureUS(
              String(
                convertCurrency(item.price, userSelectedCurrency, exchange)
              )
            )}
            {userSelectedCurrency === currency.usd && "$"}
            {userSelectedCurrency === currency.eur && "€"}
            {userSelectedCurrency === currency.vnd && "đ"}
          </span>
          <span>
            Own: {getMyCoin(item.name, myListCoin)}{" "}
            <img
              src={image_domain.replace("USDT", item.name)}
              alt={item.name}
            />
          </span>
        </div>
        <div className="action">
          <button
            onClick={() => {
              dispatch(coinSetCoin(item.name));
              dispatch(setShowContent(actionContent.desposite));
              window.scrollTo(0, 0);
            }}
            className="primary-button"
          >
            {t("deposit")}
          </button>

          <button
            onClick={() => {
              dispatch(coinSetCoin(item.name));
              dispatch(setShowContent(actionContent.withdraw));
              dispatch(setShowWithdrawTab(form.Wallet));
              window.scrollTo(0, 0);
            }}
            className="seconary-button"
          >
            {t("withdraw")}
          </button>
          <button
            onClick={() => {
              dispatch(coinSetCoin(item.name));
              dispatch(setShowContent(actionContent.withdraw));
              dispatch(setShowWithdrawTab(form.Aliases));
              window.scrollTo(0, 0);
            }}
            className="seconary-button"
          >
            {t("transfer")}
          </button>
          <button
            onClick={() => swapOnClickHandle(item.name, getMyCoin(item.name))}
            className="seconary-button"
          >
            {t("swap")}
          </button>
        </div>
      </li>
    ));
  };
  //
  return (
    <div className="swaptobeWalletList">
      <ul className="list">
        {!allCoin && (
          <div style={{ width: "100%", textAlign: "center" }}>
            <Spin style={{ margin: "auto" }}></Spin>
          </div>
        )}
        {renderListCurrency(allCoin)}
      </ul>
    </div>
  );
}
export default SeresoWalletList;
