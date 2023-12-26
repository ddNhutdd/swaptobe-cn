/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { api_status, showAlertType, url } from "src/constant";
import { useParams, useHistory } from "react-router-dom";
import { getInfoP2p, getProfile } from "src/util/userCallApi";
import { showAlert } from "src/function/showAlert";
import ConfirmItem from "./confirmItem";
import { Spin } from "antd";
import { getElementById, hideElement } from "src/util/common";
function Confirm() {
  const idAds = useParams().id;
  const history = useHistory();
  const [callApiStatus, setCallApiStatus] = useState(api_status.pending);
  const [data, setData] = useState(null);
  const [render, setRender] = useState(1);
  useEffect(() => {
    loadData();
  }, [render]);
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
          showAlert(showAlertType.error, "Can't find user information");
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
      showAlert(showAlertType.error, "Can't find user information");
      history.push(url.p2pTrading);
      return;
    }
    const { id: profileId } = profile;
    const apiRes = await fetchApiGetInfoP2p();
    if (!apiRes) {
      history.push(url.p2pTrading);
      return;
    }
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
    backgroundColor: "#1b1b1b",
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
