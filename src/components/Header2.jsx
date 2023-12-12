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
  //
  const showModalSettings = () => {
    setIsModalSettingsOpen(true);
    setTimeout(() => {
      renderDropdownCurrencyMenu(listExChange);
    }, 0);
  };
  const handleCancel = () => {
    setIsModalSettingsOpen(false);
    closeAllDropdown();
    document.removeEventListener("click", closeAllDropdown);
  };
  const renderListLanguage = (availableLanguage) =>
    Object.keys(availableLanguage).map((item) => (
      <li
        key={item}
        onClick={() => {
          setCurrentLanguage(item);
          setLocalStorage(localStorageVariable.lng, item);
          i18n.changeLanguage(item);
          closeDropdownLanguage();
        }}
        className={`header2__model-dropdown-item ${
          item === currentLanguage ? "active" : ""
        }`}
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
  const toggleDropdownLanguage = function (event) {
    event.stopPropagation();
    getClassListFromElementById("dropdownLanguageSelected").toggle("active");
    getClassListFromElementById("dropdownLanguageMenu").toggle("show");
    closeDropdownCurrency();
  };
  const toggleDropdownCurrency = function (e) {
    e.stopPropagation();
    getClassListFromElementById("dropdownCurrencySelected").toggle("active");
    getClassListFromElementById("dropdownCurrencyMenuContainer").toggle("show");
    closeDropdownLanguage();
  };
  const closeAllDropdown = function () {
    closeDropdownLanguage();
    closeDropdownCurrency();
  };
  const closeDropdownLanguage = function () {
    getClassListFromElementById("dropdownLanguageSelected") &&
      getClassListFromElementById("dropdownLanguageSelected").remove("active");
    getClassListFromElementById("dropdownLanguageMenu") &&
      getClassListFromElementById("dropdownLanguageMenu").remove("show");
  };
  const closeDropdownCurrency = function () {
    getClassListFromElementById("dropdownCurrencySelected") &&
      getClassListFromElementById("dropdownCurrencySelected").remove("active");
    getClassListFromElementById("dropdownCurrencyMenuContainer") &&
      getClassListFromElementById("dropdownCurrencyMenuContainer").remove(
        "show"
      );
  };
  const selectCurrency = function (currency) {
    if (!currency) return;
    closeAllDropdown();
    // edit html
    getElementById("dropdownCurrencySelectedText").innerHTML =
      currency.toUpperCase();
    // dispatch seleted currency to redux
    dispatch(currencySetCurrent(currency));
  };
  const renderDropdownCurrencyMenu = function (listExChange) {
    if (!listExChange || listExChange.length <= 0) return;
    const containerElement = getElementById("dropdonwCurrencyMenyList");
    if (!containerElement) return;
    containerElement.innerHTML = "";
    for (const item of listExChange) {
      containerElement.innerHTML += `<li class="header2__model-dropdown-item">${item.title}</li>`;
    }
    for (const item of containerElement.children) {
      item.addEventListener("click", selectCurrency.bind(null, item.innerHTML));
    }
  };
  //
  const [currentLanguage, setCurrentLanguage] = useState();
  const { t } = useTranslation();
  const listExChange = useSelector(getExchange);
  const dispatch = useDispatch();
  const [isModalSettingsOpen, setIsModalSettingsOpen] = useState(false);
  useEffect(() => {
    const language =
      getLocalStorage(localStorageVariable.lng) || defaultLanguage;
    i18n.changeLanguage(language);
    setCurrentLanguage(language);
    //
    const element = document.querySelector(".header2");
    element.classList.add("fadeInTopToBottom");
  }, []);
  //
  return (
    <>
      <header className="header2">
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
          <div className="header2__setting">
            <span onClick={showModalSettings}>
              <i className="fa-solid fa-gear"></i>
            </span>
          </div>
        </div>
      </header>
      <Modal open={isModalSettingsOpen} onCancel={handleCancel} footer={false}>
        <div className="header2__modal">
          <div className="header2__modal-title">{t("settings")}</div>
          <div className="header2__modal-record">
            <div className="header2__modal-record-left">
              <i className="fa-solid fa-globe"></i>
              <span>{t("language")}</span>
            </div>
            <div className="header2__modal-record-right">
              <div
                id="dropdownLanguageSelected"
                className="header2__modal-dropdown-selected"
                onClick={toggleDropdownLanguage}
              >
                <span>
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      "/img/icon" +
                      currentLanguage +
                      ".png"
                    }
                    alt={currentLanguage}
                  />
                </span>
                <span>{availableLanguageMapper[currentLanguage]}</span>
                <span>
                  <i className="fa-solid fa-chevron-down"></i>
                </span>
              </div>
              <div
                id="dropdownLanguageMenu"
                className="header2__modal-dropdown-menu-container"
              >
                <ul className="header2__model-dropdown-menu">
                  {renderListLanguage(availableLanguage)}
                </ul>
              </div>
            </div>
          </div>
          <div className="header2__modal-record">
            <div className="header2__modal-record-left">
              <i className="fa-solid fa-coins"></i>
              <span>Currency</span>
            </div>
            <div className="header2__modal-record-right">
              <div
                id="dropdownCurrencySelected"
                className="header2__modal-dropdown-selected"
                onClick={toggleDropdownCurrency}
              >
                <span id="dropdownCurrencySelectedText">USD</span>
                <span>
                  <i className="fa-solid fa-chevron-down"></i>
                </span>
              </div>
              <div
                id="dropdownCurrencyMenuContainer"
                className="header2__modal-dropdown-menu-container"
              >
                <ul
                  id="dropdonwCurrencyMenyList"
                  className="header2__model-dropdown-menu"
                >
                  <li className="header2__model-dropdown-item">USD</li>
                  <li className="header2__model-dropdown-item">EUR</li>
                  <li className="header2__model-dropdown-item">CVB</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
