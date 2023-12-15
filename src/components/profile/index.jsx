/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Card, Spin, Empty } from "antd";
import QRCode from "react-qr-code";
import { useTranslation } from "react-i18next";
import {
  api_status,
  defaultLanguage,
  localStorageVariable,
  showAlertType,
  url,
} from "src/constant";
import i18n from "src/translation/i18n";
import { Modal } from "antd";
import { getLocalStorage } from "src/util/common";
import { useHistory } from "react-router-dom";
import {
  generateOTPToken,
  getProfile,
  turnOff2FA,
  turnOn2FA,
  uploadKyc,
} from "src/util/userCallApi";
import { showToast } from "src/function/showToast";
import { showAlert } from "src/function/showAlert";
function Profile() {
  const kycControl = {
    fullName: "fullName",
    address: "address",
    phone: "phone",
    company: "company",
    passport: "passport",
    frontID: "frontID",
    behindID: "behindID",
    portrait: "portrait",
  };
  const kycTourch = {};
  const kycError = {};
  const content = {
    undefined: -1,
    verifing: 2,
    verified: 3,
    notVerifiedYet: 4,
  };
  //
  const { t } = useTranslation();
  const history = useHistory();
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [callApiKYCStatus, setCallApiKYCStatus] = useState(api_status.pending);
  const [callApiLoadInfoUserStatus, setCallApiLoadInfoUserStatus] = useState(
    api_status.pending
  );
  const [callApiTurnONOff2faStatus, setCallApiTurnONOff2faStatus] = useState(
    api_status.pending
  );
  const [isEnabled_twofa, setIsEnabled_twofa] = useState(false); // 2fa status
  const [qrValue, setQrvalue] = useState({
    addressCode: null,
    textCode: null,
  });
  const [callApi2FAStatus, setCallApi2FAStatus] = useState(api_status.pending);
  const [showContent, setShowConTent] = useState(content.undefined);
  useEffect(() => {
    const dataUser = getLocalStorage(localStorageVariable.user);
    if (!dataUser) {
      history.push(url.login);
      return;
    }
    //
    const language =
      getLocalStorage(localStorageVariable.lng) || defaultLanguage;
    i18n.changeLanguage(language);
    // them animation cho component khi nó được load
    const element = document.querySelector(".profile");
    element.classList.add("fadeInBottomToTop");
    // load du lieu len cac control
    fetchUserProfile();
    return () => {};
  }, []);
  const inputFileLogo = useRef(null);
  //
  const handleFileChange = function (e) {
    const file = e.target.files[0];
    switch (e.target.name) {
      case "frontIdentityCardFile":
        document.getElementById("frontIdentifyCardValueText").innerHTML =
          file.name;
        break;
      case "backOfIdentityCardFile":
        document.getElementById("backOfIdentityCardFileText").innerHTML =
          file.name;
        break;
      case "portraitFile":
        document.getElementById("portraitFileText").innerHTML = file.name;
        break;
      default:
        break;
    }
    kycValidate();
    kycRenderError();
  };
  const openDailogChooseFile = function (e) {
    switch (e.target.name) {
      case "frontIdentityCardFile":
        kycTourch[kycControl.frontID] = true;
        kycRenderError();
        document.getElementById("frontIdentityCardFile").click();
        break;
      case "backOfIdentityCardFile":
        kycTourch[kycControl.behindID] = true;
        kycRenderError();
        document.getElementById("backOfIdentityCardFile").click();
        break;
      case "portraitFile":
        kycTourch[kycControl.portrait] = true;
        kycRenderError();
        document.getElementById("portraitFile").click();
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
    // open modal
    setIs2FAModalOpen(true);
    // fetch data for modal
    setTimeout(() => {
      fetchDataFor2Fa();
    }, 0);
  };
  const modal2FAHandleCancel = () => {
    //close modal
    setIs2FAModalOpen(false);
    // set modal 2fa display
    setTimeout(() => {
      const hideClass = "--d-none";
      document
        .querySelector(".profile__2faModal .profile__2faModel__stepQR")
        .classList.remove(hideClass);
      document
        .querySelector(".profile__2faModal .profile__2faModel__stepVerify")
        .classList.add(hideClass);
      document.getElementById("profile__modal-code").value = "";
    }, 100);
  };
  const modal2FANextHandleCLick = function (e) {
    const hideClass = "--d-none";
    const effectClass = "fadeInRightToLeft";
    // hide step 1
    const step1Element = document.querySelector(
      ".profile__2faModal .profile__2faModel__stepQR"
    );
    step1Element.classList.add(hideClass);
    // show step 2
    const step2Element = document.querySelector(
      ".profile__2faModal .profile__2faModel__stepVerify"
    );
    step2Element.classList.add(effectClass);
    step2Element.classList.remove(hideClass);
    setTimeout(() => {
      step2Element.classList.remove(effectClass);
    }, 600);
  };
  const modal2FAPreviousHandleClick = function (e) {
    const hideClass = "--d-none";
    const effectClass = "fadeInLeftToRight";
    // hide step 2
    document
      .querySelector(".profile__2faModal .profile__2faModel__stepVerify")
      .classList.add(hideClass);
    // show step 1
    const step1Element = document.querySelector(
      ".profile__2faModal .profile__2faModel__stepQR"
    );
    step1Element.classList.add(effectClass);
    step1Element.classList.remove(hideClass);
    setTimeout(() => {
      step1Element.classList.remove(effectClass);
    }, 600);
  };
  const kycValidate = function () {
    let isValid = true;
    // fullname
    const fullNameElement = document.getElementById("profile__fullName");
    if (!fullNameElement) return false;
    const fullNameElementValue = fullNameElement.value;
    if (!fullNameElementValue && kycTourch[kycControl.fullName] === true) {
      isValid &= false;
      kycError[kycControl.fullName] = t("require");
    } else {
      delete kycError[kycControl.fullName];
    }
    // address
    const addressElement = document.getElementById("profile__address");
    const addressElementValue = addressElement.value;
    if (!addressElementValue && kycTourch[kycControl.address] === true) {
      isValid &= false;
      kycError[kycControl.address] = t("require");
    } else {
      delete kycError[kycControl.address];
    }
    //phone
    const phoneElement = document.getElementById("profile__phone");
    const phoneElementValue = phoneElement.value ?? "";
    const phonePattern = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (kycTourch[kycControl.phone]) {
      if (!phonePattern.test(phoneElementValue)) {
        isValid &= false;
        kycError[kycControl.phone] = t("invalidData");
      }
      if (!phoneElementValue) {
        isValid &= false;
        kycError[kycControl.phone] = t("require");
      }
      if (phonePattern.test(phoneElementValue) && phoneElementValue) {
        delete kycError[kycControl.phone];
      }
    }
    //company
    const companyElement = document.getElementById("profile__company");
    const companyElementValue = companyElement.value;
    if (!companyElementValue && kycTourch[kycControl.company]) {
      isValid &= false;
      kycError[kycControl.company] = t("require");
    } else {
      delete kycError[kycControl.company];
    }
    //passport
    const passportElement = document.getElementById("profile__passport");
    const passportElementValue = passportElement.value;
    if (!passportElementValue && kycTourch[kycControl.passport]) {
      isValid &= false;
      kycError[kycControl.passport] = t("require");
    } else {
      delete kycError[kycControl.passport];
    }
    //frontID
    const frontIDElement = document.getElementById("frontIdentityCardFile");
    const frontIDElementValue = frontIDElement.files;
    if (kycTourch[kycControl.frontID]) {
      if (!frontIDElementValue || frontIDElementValue.length <= 0) {
        kycError[kycControl.frontID] = t("require");
        isValid &= false;
      } else {
        delete kycError[kycControl.frontID];
      }
    }
    //behindID
    const behindIDElement = document.getElementById("backOfIdentityCardFile");
    const behindIDElementValue = behindIDElement.files;
    if (kycTourch[kycControl.behindID]) {
      if (!behindIDElementValue || behindIDElementValue.length <= 0) {
        kycError[kycControl.behindID] = t("require");
        isValid &= false;
      } else {
        delete kycError[kycControl.behindID];
      }
    }
    //portrait
    const portraitElement = document.getElementById("portraitFile");
    const portraitElementValue = portraitElement.files;
    if (kycTourch[kycControl.portrait]) {
      if (!portraitElementValue || portraitElementValue.length <= 0) {
        kycError[kycControl.portrait] = t("require");
        isValid &= false;
      } else {
        delete kycError[kycControl.portrait];
      }
    }
    //
    return Object.keys(kycTourch).length <= 0 ? false : Boolean(isValid);
  };
  const kycHandleSubmit = function (e) {
    e.preventDefault();
    //validate all control
    for (let [key] of Object.entries(kycControl)) {
      kycTourch[key] = true;
    }
    let isValid = kycValidate();
    if (!isValid) {
      kycRenderError();
      return;
    }
    // submit
    const formData = new FormData();
    formData.append(
      "fullname",
      document.getElementById("profile__fullName").value
    );
    formData.append(
      "address",
      document.getElementById("profile__address").value
    );
    formData.append("phone", document.getElementById("profile__phone").value);
    formData.append(
      "company",
      document.getElementById("profile__company").value
    );
    formData.append(
      "passport",
      document.getElementById("profile__passport").value
    );
    formData.append(
      "photo",
      document.getElementById("frontIdentityCardFile").files[0]
    );
    formData.append(
      "photo",
      document.getElementById("backOfIdentityCardFile").files[0]
    );
    formData.append("photo", document.getElementById("portraitFile").files[0]);
    formData.append("userid", getLocalStorage(localStorageVariable.user).id);
    if (callApiKYCStatus === api_status.fetching) return;
    else setCallApiKYCStatus(api_status.fetching);
    uploadKyc(formData)
      .then((resp) => {
        //show notify
        const mes = resp.data.message;
        showToast(showAlertType.success, mes);
        // reload component
        setShowConTent(content.verifing);
        //
        setCallApiKYCStatus(api_status.fulfilled);
      })
      .catch((error) => {
        setCallApiKYCStatus(api_status.rejected);
        showAlert(showAlertType.error, error.message, t("ok"));
        console.log(error);
      });
  };
  const kycControlHandleChange = function () {
    kycValidate();
    kycRenderError();
  };
  const kycControlHandleFocus = function (control) {
    kycTourch[control] = true;
    kycValidate();
    kycRenderError();
  };
  const kycRenderError = function () {
    const fullname = document.getElementById("profile__fullName__error");
    const address = document.getElementById("profile__address__error");
    const phone = document.getElementById("profile__phone__error");
    const company = document.getElementById("profile__company__error");
    const passport = document.getElementById("profile__passport__error");
    const frontID = document.getElementById("frontIdentityCardFileError");
    const behindID = document.getElementById("behindIdentityCardFileError");
    const portraitID = document.getElementById("portraitIdentityCardFileError");
    if (kycTourch[kycControl.fullName])
      fullname.innerHTML = kycError[kycControl.fullName] ?? "";
    if (kycTourch[kycControl.address])
      address.innerHTML = kycError[kycControl.address] ?? "";
    if (kycTourch[kycControl.phone])
      phone.innerHTML = kycError[kycControl.phone] ?? "";
    if (kycTourch[kycControl.company])
      company.innerHTML = kycError[kycControl.company] ?? "";
    if (kycTourch[kycControl.passport])
      passport.innerHTML = kycError[kycControl.passport] ?? "";
    if (kycTourch[kycControl.frontID])
      frontID.innerHTML = kycError[kycControl.frontID] ?? "";
    if (kycTourch[kycControl.behindID])
      behindID.innerHTML = kycError[kycControl.behindID] ?? "";
    if (kycTourch[kycControl.portrait])
      portraitID.innerHTML = kycError[kycControl.portrait] ?? "";
  };
  const fetchUserProfile = function () {
    if (callApiLoadInfoUserStatus === api_status.fetching) return;
    else setCallApiLoadInfoUserStatus(api_status.fetching);
    getProfile()
      .then((resp) => {
        const userInfo = resp?.data?.data;
        if (userInfo) {
          const { username, email, verified, enabled_twofa } = userInfo;
          document.getElementById("profile__info-email").value = email;
          document.getElementById("profile__info-username").value = username;
          if (verified === 2) {
            setShowConTent(content.verifing);
          } else if (verified === 1) {
            setShowConTent(content.verified);
          } else if (verified !== 1 && verified !== 2) {
            setShowConTent(content.notVerifiedYet);
          }
          setIsEnabled_twofa(Boolean(enabled_twofa));
        }
        setCallApiLoadInfoUserStatus(api_status.fulfilled);
      })
      .catch((error) => {
        setCallApiLoadInfoUserStatus(api_status.rejected);
        console.log(error);
      });
  };
  const renderUserProfileControl = function () {
    const style = {
      width: "100%",
      height: "100px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };
    if (callApiLoadInfoUserStatus === api_status.fetching) {
      return (
        <div style={style}>
          <Spin />
        </div>
      );
    } else if (showContent === content.undefined) return;
    else if (showContent === content.verified)
      return (
        <div className="profile__verified">
          <i className="fa-solid fa-circle-check"></i>
          <span>{t("verified")}</span>
        </div>
      );
    else if (showContent === content.verifing)
      return (
        <div className="profile__verifing">
          <i className="fa-solid fa-circle-check"></i>
          <span>Vui lòng chờ admin xác nhận.</span>
        </div>
      );
    else if (showContent === content.notVerifiedYet)
      return (
        <form onSubmit={kycHandleSubmit} className="profile__form">
          <div className="profile__form-item">
            <div className="profile__input">
              <label htmlFor="profile__fullName">{t("fullName")}</label>
              <input
                onFocus={() => {
                  kycControlHandleFocus(kycControl.fullName);
                }}
                onChange={kycControlHandleChange}
                id="profile__fullName"
                type="text"
              />
              <div
                id="profile__fullName__error"
                className={`input__error`}
              ></div>
            </div>
          </div>
          <div className="profile__form-item">
            <div className="profile__input">
              <label htmlFor="profile__address">{t("address")}</label>
              <input
                onFocus={() => {
                  kycControlHandleFocus(kycControl.address);
                }}
                onChange={kycControlHandleChange}
                id="profile__address"
                type="text"
              />
              <div
                id="profile__address__error"
                className={`input__error`}
              ></div>
            </div>
          </div>
          <div className="profile__form-item">
            <div className="profile__input">
              <label htmlFor="profile__phone">{t("phone")}</label>
              <input
                onFocus={() => {
                  kycControlHandleFocus(kycControl.phone);
                }}
                onChange={kycControlHandleChange}
                id="profile__phone"
                type="text"
              />
              <div id="profile__phone__error" className={`input__error`}></div>
            </div>
          </div>

          <div className="profile__form-item">
            <div className="profile__input">
              <label htmlFor="profile__company">{t("company")}</label>
              <input
                onFocus={() => {
                  kycControlHandleFocus(kycControl.company);
                }}
                onChange={kycControlHandleChange}
                id="profile__company"
                type="text"
              />
              <div
                id="profile__company__error"
                className={`input__error `}
              ></div>
            </div>
          </div>

          <div className="profile__form-item">
            <div className="profile__input">
              <label htmlFor="profile__passport">{t("passport")}</label>
              <input
                onFocus={() => {
                  kycControlHandleFocus(kycControl.passport);
                }}
                onChange={kycControlHandleChange}
                id="profile__passport"
                type="text"
              />
              <div
                id="profile__passport__error"
                className={`input__error`}
              ></div>
            </div>
          </div>

          <div className="profile__form-item"></div>
          <div className="profile__form-item">
            <div className="profile__fileInput">
              <label>
                {t("frontImageOfCitizenIdentificationCardOrIdentityCard")}
              </label>
              <input
                type="file"
                id="frontIdentityCardFile"
                className="--d-none"
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
                <span id="frontIdentifyCardValueText">
                  {t("noFileSelected")}
                </span>
              </label>
              <div
                id="frontIdentityCardFileError"
                className="profile__fileInput__error "
              ></div>
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
                <span id="backOfIdentityCardFileText">
                  {t("noFileSelected")}
                </span>
              </label>
              <div
                id="behindIdentityCardFileError"
                className="profile__fileInput__error "
              ></div>
            </div>
          </div>
          <div className="profile__form-item">
            <div className="profile__fileInput">
              <label>{t("portrait")}</label>
              <input
                type="file"
                className="--d-none"
                id="portraitFile"
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
                <span id="portraitFileText">{t("noFileSelected")}</span>
              </label>
              <div
                id="portraitIdentityCardFileError"
                className="profile__fileInput__error "
              ></div>
            </div>
          </div>
          <div className="profile__form-item profile__formSumit">
            <button
              type="submit"
              className={`profile__button ${
                callApiKYCStatus === api_status.fetching ? "disable" : ""
              } `}
            >
              <div
                className={`loader ${
                  callApiKYCStatus === api_status.fetching ? "" : "--d-none"
                }`}
              ></div>
              {t("save")}
            </button>
          </div>
        </form>
      );
  };
  const fetchDataFor2Fa = function () {
    if (isEnabled_twofa === true) {
      //set control cho 2fa modal
      const hideClass = "--d-none";
      const step1Element = document.querySelector(
        ".profile__2faModal .profile__2faModel__stepQR"
      );
      step1Element.classList.add(hideClass);
      const step2Element = document.querySelector(
        ".profile__2faModal .profile__2faModel__stepVerify"
      );
      step2Element.classList.remove(hideClass);
    } else if (isEnabled_twofa === false) {
      //call api
      if (callApi2FAStatus === api_status.fetching) return;
      else setCallApi2FAStatus(api_status.fetching);
      generateOTPToken()
        .then((resp) => {
          const { otpAuth, secret } = resp.data.data;
          setQrvalue(() => ({
            addressCode: otpAuth,
            textCode: secret,
          }));
          setCallApi2FAStatus(api_status.fulfilled);
        })
        .catch((error) => {
          setCallApi2FAStatus(api_status.rejected);
          setQrvalue(() => ({
            addressCode: null,
            textCode: null,
          }));
          console.log(error);
        });
    }
  };
  const turnOnOff2faClickHandle = function () {
    // validate
    const inputCodeValue = document.getElementById("profile__modal-code").value;
    const regularIsNumberString = /^[0-9]+$/;
    if (
      !inputCodeValue ||
      !(inputCodeValue.length === 6) ||
      !regularIsNumberString.test(inputCodeValue)
    ) {
      showAlert(showAlertType.error, t("invalidData"), t("ok"));
      return;
    }
    //cal api
    if (callApiTurnONOff2faStatus === api_status.fetching) return;
    else setCallApiTurnONOff2faStatus(api_status.fetching);
    if (isEnabled_twofa) {
      // turn off twofa
      turnOff2FA({ otp: inputCodeValue })
        .then((resp) => {
          setIsEnabled_twofa(() => false);
          modal2FAHandleCancel();
          showToast(showAlertType.success, t("turnOffSuccessfully"));
          setCallApiTurnONOff2faStatus(api_status.fulfilled);
        })
        .catch((error) => {
          console.log(error);
          setCallApiTurnONOff2faStatus(api_status.rejected);
        });
    } else {
      //turn on twofa
      turnOn2FA({ otp: inputCodeValue })
        .then((resp) => {
          setIsEnabled_twofa(() => true); // get new user info
          modal2FAHandleCancel();
          showToast(showAlertType.success, t("turnOnSuccessfully"));
          setCallApiTurnONOff2faStatus(api_status.fulfilled);
        })
        .catch((error) => {
          console.log(error);
          const message = error?.response?.data?.message;
          switch (message) {
            case "Incorrect code ! ":
              showAlert(showAlertType.error, t("incorrectCode"), t("ok"));
              break;
            default:
              showAlert(showAlertType.error, t("anErrorHasOccurred"), t("ok"));
              break;
          }
          setCallApiTurnONOff2faStatus(api_status.rejected);
        });
    }
  };
  const renderContent2FaQr = function () {
    const style = {
      display: "flex",
      with: "100%",
      height: "100px",
      alignItems: "center",
      justifyContent: "center",
    };
    if (callApi2FAStatus === api_status.fetching) {
      return (
        <div className={style}>
          <Spin />
        </div>
      );
    } else if (qrValue.addressCode === null) {
      return (
        <div className={style}>
          <Empty />
        </div>
      );
    } else {
      return (
        <>
          <QRCode
            style={{
              height: "auto",
              maxWidth: "200px",
              width: "100%",
            }}
            value={qrValue.addressCode}
          />
          <div>{qrValue.textCode}</div>
        </>
      );
    }
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
                  <input id="profile__info-email" disabled type="text" />
                </div>
                <div className="profile__input">
                  <label htmlFor="profile__info-username">
                    {t("username")}
                  </label>
                  <input id="profile__info-username" disabled type="text" />
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
              {renderUserProfileControl()}
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
                    {isEnabled_twofa ? t("turnOff2FA") : t("turnOn2FA")}
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
          <div className="profile__2faModel__stepQR">
            <div className="profile__2faModel__body">
              <p>
                {t("scanThisQRCodeInTheAuthenticatorApp") +
                  ", " +
                  t("orEnterTheCodeBelowManuallyIntoTheApp")}
              </p>
              <div className="profile__2faModel__qr">
                {renderContent2FaQr()}
              </div>
            </div>
            <div className="profile__2faModal__footer">
              <button
                id="profile__modalButton_next"
                onClick={modal2FANextHandleCLick}
                className="profile__button"
              >
                {t("next")}
              </button>
            </div>
          </div>
          <div className="profile__2faModel__stepVerify --d-none">
            <div className="profile__2faModel__body">
              <div id="profile__modal__code" className="profile__input">
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
                className="profile__button ghost"
              >
                {t("previous")}
              </button>
              <button
                onClick={turnOnOff2faClickHandle}
                id="profile__modalButton_turnOn2Fa"
                className={`profile__button ${
                  callApi2FAStatus === api_status.fetching ? "disabled" : ""
                } `}
              >
                <div
                  className={`loader ${
                    callApi2FAStatus === api_status.fetching ? "" : "--d-none"
                  }`}
                ></div>
                {isEnabled_twofa ? t("turnOff2FA") : t("turnOn2FA")}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
export default Profile;
