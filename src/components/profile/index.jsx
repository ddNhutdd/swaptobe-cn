import React, { useEffect, useRef, useState } from "react";
import { Card } from "antd";
import QRCode from "react-qr-code";
import { useTranslation } from "react-i18next";
import { localStorageVariable } from "src/constant";
import { useFormik } from "formik";
import i18n, { availableLanguage } from "src/translation/i18n";
import { Modal } from "antd";
import { getLocalStorage } from "src/util/common";
import * as Yup from "yup";
function Profile() {
  //
  const listGender = ["Male", "Female"];
  const countries = [
    "Việt Nam",
    "English",
    "한국",
    "日本",
    "中国",
    "ไทย",
    "កម្ពុជា",
    "ພາສາລາວ",
    "Indonesia",
  ];
  //
  const { t } = useTranslation();
  const [isShowGenderDropdown, setIsShowGenderDropdown] = useState(false);
  const [gender, setGender] = useState(listGender[0]);
  const [isShowCountryDropdown, setIsShowCountryDropdown] = useState(false);
  const [contry, setCountry] = useState(countries[0]);
  const [frontIdentifyCardValue, setFrontIdentifyCardValue] = useState();
  const [backOfIdentifyCardValue, setBackOfIdentifyCardValue] = useState();
  const [portraitValue, setPortraitValue] = useState();
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  useEffect(() => {
    const language =
      getLocalStorage(localStorageVariable.lng) || availableLanguage.vi;
    i18n.changeLanguage(language);
    // close all dropdown
    window.addEventListener("click", closeAllDropdown);
    // them animation cho component khi nó được load
    const element = document.querySelector(".profile");
    element.classList.add("fadeInBottomToTop");
    return () => {
      window.removeEventListener("click", closeAllDropdown);
    };
  }, []);
  const frontIdentityCardFile = useRef();
  const backOfIdentityCardFile = useRef();
  const portraitFile = useRef();
  const inputFileLogo = useRef();
  const formik = useFormik({
    initialValues: {
      profile__firstName: "",
      profile__lastName: "",
      profile__password: "",
      profile__phone: "",
    },
    validationSchema: Yup.object({
      profile__firstName: Yup.string().required(t("require")),
      profile__lastName: Yup.string().required(t("require")),
      profile__password: Yup.string(),
      profile__phone: Yup.string()
        .required(t("require"))
        .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, t("invalidPhoneNumber")),
    }),
    onSubmit: (values) => {
      console.log("form submit ", values);
    },
  });
  //
  const dropdownGenderClickHandle = function (e) {
    e.stopPropagation();
    setIsShowCountryDropdown(() => false);
    setIsShowGenderDropdown((s) => !s);
  };
  const dropdownCountryClickHandle = function (e) {
    e.stopPropagation();
    setIsShowGenderDropdown(() => false);
    setIsShowCountryDropdown((s) => !s);
  };
  const closeAllDropdown = function () {
    setIsShowCountryDropdown(() => false);
    setIsShowGenderDropdown(() => false);
  };
  const renderDropdownMenu = function (list, itemClickHandle) {
    return list.map((item) => (
      <div
        key={item}
        onClick={() => itemClickHandle(item)}
        className="profile__dropdown__menu-item"
      >
        {item}
      </div>
    ));
  };
  const handleFileChange = function (e) {
    const file = e.target.files[0];
    switch (e.target.name) {
      case "frontIdentityCardFile":
        setFrontIdentifyCardValue(file);
        break;
      case "backOfIdentityCardFile":
        setBackOfIdentifyCardValue(file);
        break;
      case "portraitFile":
        setPortraitValue(file);
        break;
      default:
        break;
    }
  };
  const openDailogChooseFile = function (e) {
    switch (e.target.name) {
      case "frontIdentityCardFile":
        frontIdentityCardFile.current.click();
        break;
      case "backOfIdentityCardFile":
        backOfIdentityCardFile.current.click();
        break;
      case "portraitFile":
        portraitFile.current.click();
        break;
      default:
        break;
    }
  };
  const inputFilelogoOnChangeHandle = function () {
    console.log("chon file ", inputFileLogo.current.files[0].name);
    // upload server
  };
  const showModal2FA = () => {
    setIs2FAModalOpen(true);
  };
  const modal2FAHandleCancel = () => {
    setIs2FAModalOpen(false);
  };
  const modal2FANextHandleCLick = function (e) {
    const classDisplayNone = "--d-none";
    //
    const nextElement = document.getElementById("profile__modal__code");
    nextElement.classList.add("fadeInRightToLeft");
    nextElement.classList.remove(classDisplayNone);
    document
      .querySelector(".profile__2faModal .profile__2faModel__body p")
      .classList.add(classDisplayNone);
    document
      .querySelector(
        ".profile__2faModal .profile__2faModel__body .profile__2faModel__qr"
      )
      .classList.add(classDisplayNone);
    //
    document
      .getElementById("profile__modalButton_turnOn2Fa")
      .classList.remove(classDisplayNone);
    document
      .getElementById("profile__modalButton_previous")
      .classList.remove(classDisplayNone);
    e.target.classList.add(classDisplayNone);
  };
  const modal2FAPreviousHandleClick = function (e) {
    const classDisplayNone = "--d-none";
    const classEffect = "fadeInLeftToRight";
    //
    document
      .getElementById("profile__modalButton_next")
      .classList.remove(classDisplayNone);
    document
      .getElementById("profile__modalButton_turnOn2Fa")
      .classList.add(classDisplayNone);
    e.target.classList.add(classDisplayNone);
    //
    const pElement = document.querySelector(
      ".profile__2faModal .profile__2faModel__body p"
    );
    pElement.classList.remove(classDisplayNone);
    pElement.classList.add(classEffect);
    const qrElement = document.querySelector(
      ".profile__2faModal .profile__2faModel__body .profile__2faModel__qr"
    );
    qrElement.classList.remove(classDisplayNone);
    qrElement.classList.add(classEffect);
    document
      .getElementById("profile__modal__code")
      .classList.add(classDisplayNone);
    //
    setTimeout(() => {
      qrElement.classList.remove(classEffect);
      pElement.classList.remove(classEffect);
    }, 600);
  };
  //
  return (
    <div className="profile">
      <div className="container">
        <div className="profile__info">
          <Card bodyStyle={{ backgroundColor: "#f5f5f5" }}>
            <div className="profile__card-container">
              <div className="profile__title">{t("profile")}</div>
              <div className="profile__user-img">
                <span className="profile__icon">
                  <i className="fa-solid fa-user"></i>
                </span>
                <div className="profile__upload-avatar">
                  <input
                    type="file"
                    className="--d-none"
                    ref={inputFileLogo}
                    onChange={inputFilelogoOnChangeHandle}
                  />
                  <button
                    onClick={() => {
                      inputFileLogo.current.click();
                    }}
                    className="profile__button"
                  >
                    {t("uploadAvatar")}
                  </button>
                </div>
              </div>
              <div className="profile__info-user">
                <div className="profile__input">
                  <label htmlFor="profile__info-email">{t("email")}</label>
                  <input
                    id="profile__info-email"
                    disabled
                    type="text"
                    value={"dvkien"}
                  />
                </div>
                <div className="profile__input">
                  <label htmlFor="profile__info-username">
                    {t("username")}
                  </label>
                  <input
                    id="profile__info-username"
                    disabled
                    type="text"
                    value={"dvkien"}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="profile__account">
          <Card bodyStyle={{ backgroundColor: "#f5f5f5" }}>
            <div className="profile__card-container">
              <div className="profile__title">{t("updateInfomation")}</div>
              <ul className="profile__account-content">
                <li>
                  <img src={process.env.PUBLIC_URL + "/img/!.png"} alt="..." />
                  <p>{t("toKeepYourAssetsSafeWeNeedToVerifyYourIdentity")}</p>
                </li>
                <li>
                  <img src={process.env.PUBLIC_URL + "/img/!.png"} alt="..." />
                  <p>
                    {t(
                      "pleaseFillInTheInformationCorrectlyOnceTheIdentityVerificationIsCompleteTheInformationCannotBeEditedAnymore"
                    )}
                  </p>
                </li>
              </ul>
              <form onSubmit={formik.handleSubmit} className="profile__form">
                <div className="profile__form-item">
                  <div className="profile__input">
                    <label htmlFor="profile__firstName">{t("firstName")}</label>
                    <input
                      id="profile__firstName"
                      {...formik.getFieldProps("profile__firstName")}
                      type="text"
                    />
                    <div
                      className={`profile__input__error ${
                        formik.errors.profile__firstName &&
                        formik.touched.profile__firstName
                          ? ""
                          : "--visible-hidden"
                      }`}
                    >
                      {formik.errors.profile__firstName}
                    </div>
                  </div>
                </div>
                <div className="profile__form-item">
                  <div className="profile__input">
                    <label htmlFor="profile__lastName">{t("lastName")}</label>
                    <input
                      id="profile__lastName"
                      {...formik.getFieldProps("profile__lastName")}
                      type="text"
                    />
                    <div
                      className={`profile__input__error ${
                        formik.errors.profile__lastName &&
                        formik.touched.profile__lastName
                          ? ""
                          : "--visible-hidden"
                      }`}
                    >
                      {formik.errors.profile__lastName}
                    </div>
                  </div>
                </div>
                <div className="profile__form-item">
                  <div className="profile__dropdown">
                    <label className="profile__dropdown__title">
                      {t("gender")}
                    </label>
                    <div
                      onClick={dropdownGenderClickHandle}
                      className={`profile__dropdown__selected ${
                        isShowGenderDropdown ? "active" : ""
                      }`}
                    >
                      <span>{gender}</span>
                      <i className="fa-solid fa-chevron-down"></i>
                    </div>
                    <div
                      className={`profile__dropdown__menu ${
                        isShowGenderDropdown
                          ? "profile__dropdown__menu__show"
                          : ""
                      }`}
                    >
                      {renderDropdownMenu(listGender, setGender)}
                    </div>
                  </div>
                </div>
                <div className="profile__form-item">
                  <div className="profile__input">
                    <label htmlFor="profile__password">{t("password")}</label>
                    <input
                      id="profile__password"
                      {...formik.getFieldProps("profile__password")}
                    />
                    <div
                      className={`{profile__input__error ${
                        formik.errors.profile__password &&
                        formik.touched.profile__password
                          ? ""
                          : "--visible-hidden"
                      }}`}
                    >
                      {formik.errors.profile__password}
                    </div>
                  </div>
                </div>
                <div className="profile__form-item">
                  <div className="profile__dropdown">
                    <label className="profile__dropdown__title">
                      {t("country")}
                    </label>
                    <div
                      onClick={dropdownCountryClickHandle}
                      className={`profile__dropdown__selected ${
                        isShowCountryDropdown ? "active" : ""
                      }`}
                    >
                      <span>{contry}</span>
                      <i className="fa-solid fa-chevron-down"></i>
                    </div>
                    <div
                      className={`profile__dropdown__menu ${
                        isShowCountryDropdown
                          ? "profile__dropdown__menu__show"
                          : ""
                      }`}
                    >
                      {renderDropdownMenu(countries, setCountry)}
                    </div>
                  </div>
                </div>
                <div className="profile__form-item">
                  <div className="profile__input">
                    <label htmlFor="profile__phone">{t("phone")}</label>
                    <input
                      id="profile__phone"
                      {...formik.getFieldProps("profile__phone")}
                      type="text"
                    />
                    <div
                      className={`profile__input__error ${
                        formik.errors.profile__phone &&
                        formik.touched.profile__phone
                          ? ""
                          : "--visible-hidden"
                      }`}
                    >
                      {formik.errors.profile__phone}
                    </div>
                  </div>
                </div>
                <div className="profile__form-item">
                  <div className="profile__fileInput">
                    <label>
                      {t("frontImageOfCitizenIdentificationCardOrIdentityCard")}
                    </label>
                    <input
                      type="file"
                      id="frontIdentityCardFile"
                      className="--d-none"
                      ref={frontIdentityCardFile}
                      onChange={handleFileChange}
                      name="frontIdentityCardFile"
                    />
                    <label htmlFor="frontIdentityCardFile">
                      <button
                        name="frontIdentityCardFile"
                        type="button"
                        onClick={openDailogChooseFile}
                      >
                        {t("chooseFile")}
                      </button>
                      <span>
                        {frontIdentifyCardValue?.name || t("noFileSelected")}
                      </span>
                    </label>
                  </div>
                </div>
                <div className="profile__form-item">
                  <div className="profile__fileInput">
                    <label>
                      {t("backOfCitizenIdentificationCardOrIdentityCard")}
                    </label>
                    <input
                      type="file"
                      className="--d-none"
                      id="backOfIdentityCardFile"
                      ref={backOfIdentityCardFile}
                      name="backOfIdentityCardFile"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="backOfIdentityCardFile">
                      <button
                        name="backOfIdentityCardFile"
                        type="button"
                        onClick={openDailogChooseFile}
                      >
                        {t("chooseFile")}
                      </button>
                      <span>
                        {backOfIdentifyCardValue?.name || t("noFileSelected")}
                      </span>
                    </label>
                  </div>
                </div>
                <div className="profile__form-item">
                  <div className="profile__fileInput">
                    <label>{t("portrait")}</label>
                    <input
                      type="file"
                      className="--d-none"
                      id="portraitFile"
                      ref={portraitFile}
                      name="portraitFile"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="portraitFile">
                      <button
                        name="portraitFile"
                        type="button"
                        onClick={openDailogChooseFile}
                      >
                        {t("chooseFile")}
                      </button>
                      <span>{portraitValue?.name || t("noFileSelected")}</span>
                    </label>
                  </div>
                </div>
                <div className="profile__form-item profile__formSumit">
                  <button type="submit" className="profile__button">
                    {t("save")}
                  </button>
                </div>
              </form>
              <div className="profile__verified --d-none">
                <i className="fa-solid fa-circle-check"></i>
                <span>{t("verified")}</span>
              </div>
            </div>
          </Card>
        </div>
        <div className=" profile__security">
          <Card bodyStyle={{ backgroundColor: "#f5f5f5" }}>
            <div className="profile__card-container">
              <div className="profile__title">{t("security")}</div>
              <div className="profile__security-item">
                <div className="profile__left">
                  <h4>{t("password")}</h4>
                  <p>{t("doYouWantToChangeYourPasswordClickHereToChange")}</p>
                </div>
                <div className="profile__right">
                  <button className="profile__button">
                    {t("changePassword")}
                  </button>
                  <p>{t("youMustTurnOn2FAToChangePassword")}</p>
                </div>
              </div>
              <div className="profile__security-item">
                <div className="profile__left">
                  <h4>2FA</h4>
                  <p>{t("requiredToWithdrawOrUpdateTheSecurity")}</p>
                </div>
                <div className="profile__right">
                  <button onClick={showModal2FA} className="profile__button">
                    {t("turnOn2FA")}
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <Modal
        footer={false}
        open={is2FAModalOpen}
        onCancel={modal2FAHandleCancel}
      >
        <div className="profile__2faModal">
          <div className="profile__2faModel__header">
            <div className="profile__2faModel__title">
              {t("twoFactorAuthentication2FA")}
            </div>
            <div
              className="profile__2faModel__close"
              onClick={modal2FAHandleCancel}
            >
              <i className="fa-solid fa-xmark"></i>
            </div>
          </div>
          <div className="profile__2faModel__body">
            <p>
              {t("scanThisQRCodeInTheAuthenticatorApp") +
                ", " +
                t("orEnterTheCodeBelowManuallyIntoTheApp")}
            </p>
            <div className="profile__2faModel__qr">
              <QRCode
                style={{
                  height: "auto",
                  maxWidth: "200px",
                  width: "100%",
                }}
                value={"addressCode"}
              />
              <div>HBWUA43DDBNUEWJR</div>
            </div>
            <div id="profile__modal__code" className="profile__input --d-none">
              <label htmlFor="profile__modal-code">
                {t("enterThe6DigitCodeFromAuthenticatorApp")}
              </label>
              <input id="profile__modal-code" type="text" />
            </div>
          </div>
          <div className="profile__2faModal__footer">
            <button
              onClick={modal2FAPreviousHandleClick}
              id="profile__modalButton_previous"
              className="profile__button ghost --d-none"
            >
              {t("previous")}
            </button>
            <button
              id="profile__modalButton_next"
              onClick={modal2FANextHandleCLick}
              className="profile__button"
            >
              {t("next")}
            </button>
            <button
              id="profile__modalButton_turnOn2Fa"
              className="profile__button --d-none"
            >
              {t("turnOn2FA")}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
export default Profile;
