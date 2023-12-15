import { Button } from "antd";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as Yup from "yup";
import { showAlert } from "../function/showAlert";
import { showToast } from "../function/showToast";
import { axiosService } from "../util/service";
import {
  defaultLanguage,
  localStorageVariable,
  showAlertType,
  url,
} from "src/constant";
import { useEffect } from "react";
import { getLocalStorage, removeLocalStorage } from "src/util/common";
import i18n, { availableLanguage } from "src/translation/i18n";
import { userWalletFetchCount } from "src/redux/actions/coin.action";
export default function Login({ history }) {
  //
  const [isLoading, setIsLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Required"),
      password: Yup.string().required("Required"),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      login(values.username, values.password);
    },
  });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [typeInputPassword, setTypeInputPassword] = useState("password");
  useEffect(() => {
    const language =
      getLocalStorage(localStorageVariable.lng) || defaultLanguage;
    i18n.changeLanguage(language);
    //
    const element = document.querySelector(".login-register");
    if (element) element.classList.add("fadeInBottomToTop");
  }, []);
  //
  const login = async (e, p) => {
    setIsLoading(true);
    try {
      let response = await axiosService.post("/api/user/login", {
        userName: e,
        password: p,
      });
      showToast(showAlertType.success, t("loggedInSuccessfully"));
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data));
      dispatch({ type: "USER_LOGIN" });
      // menu load list mycoin
      dispatch(userWalletFetchCount());
      // search previos page and redirect
      const previousPage = getLocalStorage(localStorageVariable.previousePage);
      history.push("wallet-2");
      if (previousPage) {
        history.replace(previousPage.pathname + previousPage.search);
        removeLocalStorage(localStorageVariable.previousePage);
      } else {
        history.push(url.p2pTrading);
      }
    } catch (error) {
      showAlert("error", error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-register">
      <div className="container">
        <div className="box">
          <h2 className="title">{t("login")}</h2>
          <form>
            <div className="field">
              <label htmlFor="email">{t("userName")}</label>
              <input
                id="username"
                name="username"
                value={formik.values.email}
                onChange={formik.handleChange}
                size="large"
              />
              {formik.errors.username ? (
                <div className="error">{formik.errors.username}</div>
              ) : null}
            </div>
            <div className="field">
              <label htmlFor="password">{t("password")}</label>
              <input
                size="large"
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                type={typeInputPassword}
              />
              {formik.errors.password ? (
                <div className="error">{formik.errors.password}</div>
              ) : null}
              <span
                id="eyeShow"
                className={typeInputPassword === "text" ? "" : "--d-none"}
                onClick={() => {
                  setTypeInputPassword(() => "password");
                }}
              >
                <i className="fa-regular fa-eye"></i>
              </span>
              <span
                className={typeInputPassword === "password" ? "" : "--d-none"}
                onClick={() => {
                  setTypeInputPassword(() => "text");
                }}
                id="eyeHide"
              >
                <i className="fa-solid fa-eye-slash"></i>
              </span>
            </div>
          </form>
          <Button
            loading={isLoading}
            type="primary"
            size="large"
            className="loginBtn"
            onClick={formik.handleSubmit}
          >
            {t("logIn")}
          </Button>
          <div className="toSignUp" onClick={() => history.replace(url.signup)}>
            {t("dontHaveAnAccount")}{" "}
            <span style={{ fontWeight: 500 }}>{t("letsSignUp")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
