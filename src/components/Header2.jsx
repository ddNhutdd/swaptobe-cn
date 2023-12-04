import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../translation/i18n";
import {
  availableLanguage,
  availableLanguageMapper,
} from "../translation/i18n";
import { getLocalStorage, setLocalStorage } from "../util/common";
import { localStorageVariable } from "../constant";
import { Modal } from "antd";
export default function Header2({ history }) {
  //
  const [currentLanguage, setCurrentLanguage] = useState();
  const { t } = useTranslation();
  const [isModalSettingsOpen, setIsModalSettingsOpen] = useState(false);
  const checkboxShowLanguageMenu = useRef();
  useEffect(() => {
    const language =
      getLocalStorage(localStorageVariable.lng) || availableLanguage.vi;
    i18n.changeLanguage(language);
    setCurrentLanguage(language);

    const element = document.querySelector(".header2");
    element.classList.add("fadeInTopToBottom");
  }, []);
  //
  const showModalSettings = () => {
    setIsModalSettingsOpen(true);
  };
  const handleCancel = () => {
    setIsModalSettingsOpen(false);
    checkboxShowLanguageMenu.current.checked = false;
  };
  const renderListLanguage = (availableLanguage) =>
    Object.keys(availableLanguage).map((item) => (
      <li
        key={item}
        onClick={() => {
          setCurrentLanguage(item);
          setLocalStorage(localStorageVariable.lng, item);
          i18n.changeLanguage(item);
        }}
        className={`header2__model-dropdown-item ${
          item === currentLanguage ? "active" : ""
        }`}
      >
        <span>
          <img src={`./img/icon${item}.png`} alt={item} />
        </span>
        <span className="header2__model-dropdown-content">
          {availableLanguageMapper[item]}
        </span>
      </li>
    ));
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
          <input
            type="checkbox"
            id="checkBoxShowMenuLanguage"
            className="--d-none"
            ref={checkboxShowLanguageMenu}
          />
          <div className="header2__modal-title">{t("settings")}</div>
          <div className="header2__modal-language">
            <div className="header2__modal-language-left">
              <i className="fa-solid fa-globe"></i>
              <span>{t("language")}</span>
            </div>
            <label
              className="header2__modal-language-right"
              htmlFor="checkBoxShowMenuLanguage"
            >
              <div className="header2__modal-dropdown-selected">
                <span>
                  <img
                    src={`./img/icon${currentLanguage}.png`}
                    alt={currentLanguage}
                  />
                </span>
                <span>{availableLanguageMapper[currentLanguage]}</span>
                <span>
                  <i className="fa-solid fa-chevron-down"></i>
                </span>
              </div>
              <div className="header2__modal-dropdown-menu-container">
                <ul className="header2__model-dropdown-menu">
                  {renderListLanguage(availableLanguage)}
                </ul>
              </div>
            </label>
          </div>
        </div>
      </Modal>
    </>
  );
}
