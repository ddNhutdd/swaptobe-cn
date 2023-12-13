/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { url } from "src/constant";
import { addClassToElementById, getElementById } from "src/util/common";
function Sidebar() {
  const rightIconFunding = useRef();
  const submenuFunding = useRef();
  const rightIconHistory = useRef();
  const submenuHistory = useRef();
  const history = useHistory();
  const location = useLocation();
  useEffect(() => {
    const urlList = location.pathname.split("/");
    const page = urlList[urlList.length - 1];
    selectItem(page);
  }, []);

  const fundingItemClickHandle = function () {
    rightIconFunding.current.classList.toggle("up");
    submenuFunding.current.classList.toggle("show");
    rightIconHistory.current.classList.remove("up");
    submenuHistory.current.classList.remove("show");
  };
  const historyItemClickHandle = function () {
    rightIconHistory.current.classList.toggle("up");
    submenuHistory.current.classList.toggle("show");
    rightIconFunding.current.classList.remove("up");
    submenuFunding.current.classList.remove("show");
  };
  const redirectkyc = function (e) {
    clearSelectedItem();
    const element = e.target.closest("#kyc");
    element.classList.add("active");
    history.push(url.admin_kyc);
  };
  const clearSelectedItem = function () {
    const element = getElementById("listItem");
    for (const item of element.children) {
      item.classList.remove("active");
    }
  };
  const selectItem = function (page) {
    clearSelectedItem();
    switch (page) {
      case "kyc":
        addClassToElementById("kyc", "active");
        break;
      case "exchange-rate-disparity":
        addClassToElementById("exchangeRateDisparity", "active");
        break;
      case "ads":
        addClassToElementById("ads", "active");
        break;

      default:
        break;
    }
  };
  const redirectExchangeRateDisparity = function (e) {
    clearSelectedItem();
    const element = e.target.closest("#exchangeRateDisparity");
    element.classList.add("active");
    history.push(url.admin_exchangeRateDisparity);
  };
  const redirectAds = function (e) {
    clearSelectedItem();
    const element = e.target.closest("#ads");
    element.classList.add("active");
    history.push(url.admin_ads);
  };
  //
  return (
    <div className="admin-sidebar">
      <ul id="listItem">
        <li className="active">
          <span className="admin-sidebar__icon">
            <i className="fa-solid fa-house"></i>
          </span>
          <span className="admin-sidebar__item">Dashboard</span>
        </li>
        <li onClick={redirectkyc} id="kyc">
          <span className="admin-sidebar__icon">
            <i className="fa-solid fa-user-shield"></i>
          </span>
          <span className="admin-sidebar__item">KYC users</span>
        </li>
        <li onClick={redirectExchangeRateDisparity} id="exchangeRateDisparity">
          <span className="admin-sidebar__icon">
            <i className="fa-solid fa-percent"></i>
          </span>
          <span className="admin-sidebar__item">Exchange Rate Disparity</span>
        </li>

        <li onClick={redirectAds} id="ads">
          <span className="admin-sidebar__icon">
            <i className="fa-solid fa-rectangle-ad"></i>
          </span>
          <span className="admin-sidebar__item">Advertise</span>
        </li>

        <li id="funding-item" onClick={fundingItemClickHandle}>
          <span className="admin-sidebar__icon">
            <i className="fa-solid fa-coins"></i>
          </span>
          <span className="admin-sidebar__item">Funding</span>
          <span
            ref={rightIconFunding}
            className="admin-sidebar__right-icon-down"
          >
            <i className="fa-solid fa-caret-down"></i>
          </span>
        </li>
        <ul ref={submenuFunding} className="admin-sidebar__sub-menu">
          <li>Deposit</li>
          <li>Deposit USD</li>
          <li>Withdraw</li>
          <li>Transfer</li>
        </ul>
        <li>
          <span className="admin-sidebar__icon">
            <i className="fa-solid fa-money-bill-transfer"></i>
          </span>
          <span className="admin-sidebar__item">Trade</span>
        </li>

        <li id="history-item" onClick={historyItemClickHandle}>
          <span className="admin-sidebar__icon">
            <i className="fa-solid fa-clock-rotate-left"></i>
          </span>
          <span className="admin-sidebar__item">History</span>
          <span
            ref={rightIconHistory}
            className="admin-sidebar__right-icon-down"
          >
            <i className="fa-solid fa-caret-down"></i>
          </span>
        </li>
        <ul ref={submenuHistory} className="admin-sidebar__sub-menu">
          <li>History Order</li>
          <li>History Profit</li>
          <li>History Set Result</li>
        </ul>
        <li>
          <span className="admin-sidebar__icon">
            <i className="fa-solid fa-money-bill-wave"></i>
          </span>
          <span className="admin-sidebar__item">commission</span>
        </li>
        <li>
          <span className="admin-sidebar__icon">
            <i className="fa-solid fa-paper-plane"></i>
          </span>
          <span className="admin-sidebar__item">Send mail / otifications</span>
        </li>
        <li>
          <span className="admin-sidebar__icon">
            <i className="fa-solid fa-circle-notch"></i>
          </span>
          <span className="admin-sidebar__item">Lucky Spin</span>
        </li>
        <li>
          <span className="admin-sidebar__icon">
            <i className="fa-solid fa-newspaper"></i>
          </span>
          <span className="admin-sidebar__item">Update homepage</span>
        </li>
        <li>
          <span className="admin-sidebar__icon">
            <i className="fa-solid fa-right-from-bracket"></i>
          </span>
          <span className="admin-sidebar__item">Log out</span>
        </li>
      </ul>
    </div>
  );
}
export default Sidebar;
