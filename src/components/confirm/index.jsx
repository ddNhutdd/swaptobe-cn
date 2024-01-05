/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import i18n from "src/translation/i18n";
import {
  api_status,
  defaultLanguage,
  localStorageVariable,
  url,
} from "src/constant";
import { useParams, useHistory } from "react-router-dom";
import { getInfoP2p, getProfile } from "src/util/userCallApi";
import ConfirmItem from "./confirmItem";
import { Spin } from "antd";
import { getElementById, getLocalStorage, hideElement } from "src/util/common";
import { callToastError } from "src/function/toast/callToast";
import socket from "src/util/socket";
import { useTranslation } from "react-i18next";
function Confirm() {
  const idAds = useParams().id;
  const history = useHistory();
  const [callApiStatus, setCallApiStatus] = useState(api_status.pending);
  const [data, setData] = useState(null);
  const [render, setRender] = useState(1);
  const { t } = useTranslation();
  useEffect(() => {
    loadData();
  }, [render]);
  useEffect(() => {
    const language =
      getLocalStorage(localStorageVariable.lng) || defaultLanguage;
    i18n.changeLanguage(language);
    //
    socket.on("operationP2p", (idP2p) => {
      console.log(idP2p, "operationP2p");
      loadData();
    });
  }, []);
  const fetchApiGetInfoP2p = function () {
    return new Promise((resolve) => {
      if (callApiStatus === api_status.fetching) {
        return resolve(false);
      }

      getInfoP2p({
        idP2p: idAds,
      })
        .then((resp) => {
          setCallApiStatus(api_status.fulfilled);
          return resolve(resp.data.data);
        })
        .catch((error) => {
          setCallApiStatus(api_status.rejected);
          return resolve(false);
        })
        .finally(() => {
          hideElement(getElementById("confirm__spinner"));
        });
    });
  };
  const fetchApiGetProfile = function () {
    return new Promise((resolve) => {
      getProfile()
        .then((resp) => {
          resolve(resp.data.data);
        })
        .catch((error) => {
          callToastError(t("can'tFindUserInformation"));
          resolve(false);
          console.log(error);
        });
    });
  };
  /**
   * fetch data and render html
   */
  const loadData = async function () {
    const profile = await fetchApiGetProfile();
    if (!profile) {
      callToastError(t("can'tFindUserInformation"));
      history.push(url.login);
      return;
    }
    const { id: profileId } = profile;
    const apiRes = await fetchApiGetInfoP2p();
    if (!apiRes) {
      history.push(url.p2p_management);
      return;
    }
    console.log("pass");
    const result = apiRes.map((item, index) => (
      <ConfirmItem
        key={index}
        index={index}
        content={item}
        profileId={profileId}
        render={setRender}
      />
    ));
    setData(() => result);
  };
  const classStyle = {
    paddingTop: "120px",
    paddingBottom: "30px",
    display: "flex",
    gap: "30px",
    flexDirection: "column",
  };
  return (
    <>
      <div
        id="confirm__spinner"
        className={`spin-container `}
        style={classStyle}
      >
        <Spin />
      </div>
      <div
        className={`${callApiStatus === api_status.fetching ? "--d-none" : ""}`}
        style={classStyle}
      >
        {data}
      </div>
    </>
  );
}
export default Confirm;
