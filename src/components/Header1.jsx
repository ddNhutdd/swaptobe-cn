/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../function/showToast";
import { useEffect, useRef } from "react";
import { api_status, currency, localStorageVariable, url } from "src/constant";
import { getWalletApi } from "src/util/userCallApi";
import socket from "src/util/socket";
import { Spin } from "antd";
import { coinUserWallet } from "src/redux/actions/coin.action";
import { userWalletFetchCount } from "src/redux/constant/coin.constant";
import {
  removeLocalStorage,
  roundDecimalValues,
  setLocalStorage,
} from "src/util/common";
import { currencySetCurrent } from "src/redux/actions/currency.action";
import { getCurrent } from "src/redux/constant/currency.constant";
export default function Header1({ history }) {
  //
  const { isLogin, username } = useSelector((root) => root.loginReducer);
  const fetchUserWallet = useSelector(userWalletFetchCount);
  const userSelectedCurrency = useSelector(getCurrent);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [callApiStatus, setCallApiStatus] = useState(api_status.pending);
  const [listOwnedCoins, setListOwnedCoins] = useState([]);
  const userMenuElement = useRef();
  const walletMenuElement = useRef();
  const listCoin = useRef();
  const loadListMyCoin = function () {
    setCallApiStatus(api_status.fetching);
    const listOwnedCoins = getWalletApi();
    listOwnedCoins
      .then((resp) => {
        const result = [];
        const dataResp = resp.data.data;
        if (dataResp) {
          Object.keys(dataResp).forEach((item) => {
            const price =
              listCoin.current.filter(
                (record) =>
                  record.name.toLowerCase() === item.replace("_balance", "")
              )[0]?.price || 0;
            dataResp[item] = roundDecimalValues(dataResp[item], price);
          });
          dispatch(coinUserWallet(dataResp));
          const value = dataResp["btc_balance"];
          const newObj = {
            btc: value,
          };
          result.push(newObj);
        }
        setListOwnedCoins(result);
        setCallApiStatus(api_status.fulfilled);
      })
      .catch((error) => {
        console.log(error);
        setCallApiStatus(api_status.rejected);
      });
  };
  useEffect(() => {
    //
    const element = document.querySelector(".header1");
    element.classList.add("fadeInTopToBottom");
    //
    window.addEventListener("click", closeAllSubMenu);
    //
    return () => {
      window.removeEventListener("click", closeAllSubMenu);
    };
  }, []);
  useEffect(() => {
    if (isLogin) {
      if (!listCoin.current) {
        socket.once("listCoin", (res) => {
          listCoin.current = res;
          loadListMyCoin();
        });
      } else if (listCoin.current) {
        loadListMyCoin();
      }
    }
  }, [fetchUserWallet]);
  //
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    removeLocalStorage(localStorageVariable.currency);
    dispatch(currencySetCurrent(currency.usd));
    history.push("/");
    dispatch({ type: "USER_LOGOUT" });
    showToast("success", "Logged out");
  };
  const userNameOnClickHandle = function (e) {
    e.stopPropagation();
    userMenuElement.current.classList.toggle("show");
    walletMenuElement.current.classList.remove("show");
  };
  const walletOnClickHandle = function (e) {
    e.stopPropagation();
    walletMenuElement.current.classList.toggle("show");
    userMenuElement.current.classList.remove("show");
  };
  const closeAllSubMenu = function () {
    if (userMenuElement.current && walletMenuElement.current) {
      userMenuElement.current.classList.remove("show");
      walletMenuElement.current.classList.remove("show");
    }
  };
  const currencyOnClickHandle = function (e, value) {
    e.stopPropagation();
    const listCurrentcy = document.querySelectorAll(
      ".header1 .header1__list-currency span"
    );
    if (listCurrentcy) {
      for (const item of listCurrentcy) {
        item.classList.remove("active");
      }
    }
    e.target.classList.add("active");
    dispatch(currencySetCurrent(value));
    setLocalStorage(localStorageVariable.currency, value);
  };
  return (
    <header className="header1">
      <div className="container">
        {isLogin ? (
          <>
            <div className="header1__item" onClick={walletOnClickHandle}>
              {t("wallets")}
              <div ref={walletMenuElement} className="header1__subMenu wallet">
                <div className="header1__subMenu__user-info">
                  <div>
                    {t("totalValue")} <i className="fa-regular fa-eye"></i>
                  </div>
                  <div className="header1__list-coin">
                    {callApiStatus === api_status.fetching ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100px",
                          width: "100%",
                        }}
                      >
                        <Spin />
                      </div>
                    ) : (
                      listOwnedCoins.map((item) => (
                        <span
                          className={`header1__coin-item`}
                          key={Object.keys(item)[0]}
                        >
                          {Object.keys(item)[0].toUpperCase()}:{" "}
                          <span className="header1__coin-item-number">
                            {Object.values(item)[0]}{" "}
                          </span>
                          coins
                        </span>
                      ))
                    )}
                  </div>
                  <div>0 VND</div>
                  <div className="header1__list-currency">
                    <span
                      className={
                        userSelectedCurrency === currency.vnd ? "active" : ""
                      }
                      onClick={(e) => currencyOnClickHandle(e, currency.vnd)}
                    >
                      VND
                      <div>
                        <i className="fa-solid fa-check"></i>
                      </div>
                    </span>
                    <span
                      className={
                        userSelectedCurrency === currency.eur ? "active" : ""
                      }
                      onClick={(e) => currencyOnClickHandle(e, currency.eur)}
                    >
                      EUR
                      <div>
                        <i className="fa-solid fa-check"></i>
                      </div>
                    </span>
                    <span
                      className={
                        userSelectedCurrency === currency.usd ? "active" : ""
                      }
                      onClick={(e) => currencyOnClickHandle(e, currency.usd)}
                    >
                      USD
                      <div>
                        <i className="fa-solid fa-check"></i>
                      </div>
                    </span>
                  </div>
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    walletMenuElement.current.classList.remove("show");
                    history.push(url.wallet);
                  }}
                  className="header1__subMenu-item"
                >
                  {t("wallets")}
                </div>
                <div className="header1__subMenu-item">{t("p2PHistory")} </div>
                <div className="header1__subMenu-item">
                  {t("instantTradeHistory")}
                </div>
                <div className="header1__subMenu-item">{t("swapHistory")}</div>
                <div className="header1__subMenu-item">
                  {t("waveRidingHistory")}
                </div>
              </div>
            </div>
            <div className="header1__item" onClick={userNameOnClickHandle}>
              {username}
              <div ref={userMenuElement} className="header1__subMenu">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    userMenuElement.current.classList.remove("show");
                    history.push(url.profile);
                  }}
                  className="header1__subMenu-item"
                >
                  <i className="fa-regular fa-user"></i>
                  {t("profile")}
                </div>
                <div onClick={logout} className="header1__subMenu-item">
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                  {t("logOut")}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="header1__item" onClick={() => history.push("/login")}>
            {t("login")} / {t("register")}
          </div>
        )}
      </div>
    </header>
  );
}
