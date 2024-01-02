import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../translation/i18n";
import {
  availableLanguage,
  availableLanguageMapper,
} from "../translation/i18n";
import {
  getLocalStorage,
  setLocalStorage,
  getClassListFromElementById,
  getElementById,
} from "../util/common";
import { defaultLanguage, localStorageVariable } from "../constant";
import { Modal } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { getExchange } from "src/redux/constant/currency.constant";
import { currencySetCurrent } from "src/redux/actions/currency.action";
export default function Header2({ history }) {
  const renderListLanguage = (availableLanguage) =>
    Object.keys(availableLanguage).map((item) => (
      <li
        key={item}
        onClick={() => {
          setCurrentLanguage(item);
          setLocalStorage(localStorageVariable.lng, item);
          i18n.changeLanguage(item);
        }}
        className={`dropdown-item ${item === currentLanguage ? "active" : ""}`}
      >
        <span>
          <img
            src={process.env.PUBLIC_URL + "/img/icon" + item + ".png"}
            alt={item}
          />
        </span>
        <span className="header2__model-dropdown-content">
          {availableLanguageMapper[item]}
        </span>
      </li>
    ));
  const selectCurrency = function (currency) {
    if (!currency) return;
    // edit html
    getElementById("dropdownCurrencySelectedText").innerHTML =
      currency.toUpperCase();
    // dispatch seleted currency to redux
    dispatch(currencySetCurrent(currency));
  };
  const [currentLanguage, setCurrentLanguage] = useState();
  const { t } = useTranslation();
  const listExChange = useSelector(getExchange);
  const dispatch = useDispatch();
  useEffect(() => {
    const language =
      getLocalStorage(localStorageVariable.lng) || defaultLanguage;
    i18n.changeLanguage(language);
    setCurrentLanguage(language);
  }, []);
  return (
    <header className="header2 fadeInTopToBottom">
      <div className="container">
        <input type="checkbox" id="checkboxShowMenu" className="--d-none" />
        <div className="logo" onClick={() => history.push("/")}>
          <img src="/img/logowhite.png" alt="Remitano Logo" />
        </div>
        <div className="menu">
          <NavLink
            exact
            className="navlink"
            activeClassName="navlink-active"
            to="/swap"
          >
            {t("swap")}
          </NavLink>
          <NavLink
            exact
            className="navlink"
            activeClassName="navlink-active"
            to="/p2p-trading"
          >
            {t("p2pTrading")}
          </NavLink>
        </div>
        <label
          className="header__bar-button-container"
          htmlFor="checkboxShowMenu"
        >
          <div className="bar-button">
            <i className="fa-solid fa-bars-staggered"></i>
          </div>
        </label>
        <div className="header2__right show">
          <div className="header2__language">
            <div className="header2__language-seletor">
              <img
                src={process.env.PUBLIC_URL + "/img/iconvi.png"}
                alt="language"
              />
            </div>
            <div className="header2__language-menu">
              <div className="header2__language-item active">
                <span>
                  <img
                    src={process.env.PUBLIC_URL + "/img/iconvi.png"}
                    alt="vn"
                  />
                </span>
                <span>Vietnamese</span>
              </div>
              <div className="header2__language-item">
                <span>
                  <img
                    src={process.env.PUBLIC_URL + "/img/iconen.png"}
                    alt="en"
                  />
                </span>
                <span>Vietnamese</span>
              </div>
            </div>
          </div>
          <div className="header2__currency">
            <div className="header2__currency-selector">USD</div>
            <div className="header2__currrency-menu">
              <div className="header2__currrency-item active">USD</div>
              <div className="header2__currrency-item">EUR</div>
            </div>
          </div>
          <div className="header2__wallet">
            <div className="header2__wallet-title">Wallet</div>
            <div className="header2__wallet-menu">
              <div className="header2__wallet-info">
                <div className="header2__wallet-info-item">
                  <span className="header2__wallet-info-icon">
                    <i className="fa-brands fa-bitcoin"></i>
                  </span>
                  <span>data</span>
                </div>
                <div className="header2__wallet-info-item">
                  <span className="header2__wallet-info-icon">
                    <i className="fa-solid fa-dollar-sign"></i>
                  </span>
                  <span>data</span>
                </div>
              </div>
              <div className="header2__wallet-item">
                <i className="fa-solid fa-wallet"></i>
                <span>Wallet</span>
              </div>
              <div className="header2__wallet-item">
                <i className="fa-solid fa-rectangle-ad"></i>
                <span>Advertising History</span>
              </div>
              <div className="header2__wallet-item">
                <i className="fa-solid fa-comments-dollar"></i>
                <span>p2pHistory</span>
              </div>
            </div>
          </div>
          <div className="header2__user">
            <div className="header2__username">test</div>
            <div className="header2__user-info">
              <div className="header2__user-info-item">
                <i className="fa-regular fa-user"></i>
                <span>Profile</span>
              </div>
              <div className="header2__user-info-item">
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                <span>Logout</span>
              </div>
            </div>
          </div>
          <div className="header2__login">login / register</div>
        </div>
      </div>
    </header>
  );
}
