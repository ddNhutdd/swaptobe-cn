import { Empty, Spin } from "antd";
import React, { useState } from "react";
import { api_status } from "src/constant";
import { capitalizeFirstLetter } from "src/util/common";
function P2pManagement() {
  const advertisingStatusType = {
    all: "all",
    buy: "buy",
    sell: "sell",
    pending: "pending",
  };
  const radioAcitonType = {
    buy: "buy",
    sell: "sell",
  };
  const [advertisingStatus, setAdvertisingStatus] = useState(
    advertisingStatusType.buy
  );
  const [callApiStatus, setCallApiStatus] = useState(api_status.pending);
  const [dataTable, setDataTable] = useState([]);
  const [radioAction, setRadioAction] = useState(radioAcitonType.buy);
  const renderClassTabActive = function (adsStatus) {
    return advertisingStatus === adsStatus ? "active" : "";
  };
  const tabClickHandle = function (adsStatus) {
    setAdvertisingStatus(adsStatus);
  };
  const renderClassTable = function () {
    if (callApiStatus === api_status.fetching) return "--d-none";
    else if (!dataTable || dataTable.length <= 0) return "--d-none";
    else return "";
  };
  const renderClassSpin = function () {
    if (callApiStatus === api_status.fetching) return "";
    else return "--d-none";
  };
  const renderClassEmpty = function () {
    if (callApiStatus === api_status.fetching) return "--d-none";
    else if (!dataTable || dataTable.length <= 0) return "";
  };
  const radioActionChangeHandle = function (e) {
    const id = e.target.id;
    switch (id) {
      case "buyRadio":
        e.target.checked
          ? setRadioAction(() => radioAcitonType.buy)
          : setRadioAction(() => radioAcitonType.sell);
        break;
      case "sellRadio":
        e.target.checked
          ? setRadioAction(() => radioAcitonType.sell)
          : setRadioAction(() => radioAcitonType.buy);
        break;
      default:
        break;
    }
  };
  return (
    <div className="p2pManagement">
      <div className="container">
        <div className="p2pManagement__header">
          <div className="p2pManagement__header-tab">
            <div
              className={`p2pManagement__header-tab-item ${renderClassTabActive(
                advertisingStatusType.all
              )}`}
              onClick={tabClickHandle.bind(null, advertisingStatusType.all)}
            >
              <i className="fa-solid fa-border-all"></i>
              <span>All</span>
            </div>
            <div
              className={`p2pManagement__header-tab-item ${renderClassTabActive(
                advertisingStatusType.buy
              )}`}
              onClick={tabClickHandle.bind(null, advertisingStatusType.buy)}
            >
              <i className="fa-solid fa-cart-shopping"></i>
              <span>Buy</span>
            </div>
            <div
              className={`p2pManagement__header-tab-item ${renderClassTabActive(
                advertisingStatusType.sell
              )}`}
              onClick={tabClickHandle.bind(null, advertisingStatusType.sell)}
            >
              <i className="fa-brands fa-sellcast"></i>
              <span>Sell</span>
            </div>
            <div
              className={`p2pManagement__header-tab-item ${renderClassTabActive(
                advertisingStatusType.pending
              )}`}
              onClick={tabClickHandle.bind(null, advertisingStatusType.pending)}
            >
              <i className="fa-solid fa-spinner"></i>
              <span>Pending</span>
            </div>
            <div className="p2pManagement__header-tab-item"></div>
          </div>
          <div className="p2pManagement__header-dropdown ">
            <div className="p2pManagement__header-selected">
              <i className="fa-solid fa-border-all"></i>
              <span>All</span>
            </div>
            <div className="p2pManagement__header-menu">
              <div className="p2pManagement__header-menu-item">
                <i className="fa-solid fa-border-all"></i>
                <span>All</span>
              </div>
              <div className="p2pManagement__header-menu-item">
                <i className="fa-solid fa-cart-shopping"></i>
                <span>Buy</span>
              </div>
              <div className="p2pManagement__header-menu-item">
                <i className="fa-brands fa-sellcast"></i>
                <span>Sell</span>
              </div>
              <div className="p2pManagement__header-menu-item">
                <i className="fa-solid fa-spinner"></i>
                <span>Pending</span>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`p2pManagement__filter ${
            advertisingStatus === advertisingStatusType.pending
              ? ""
              : "--d-none"
          }`}
        >
          <span className="p2pManagement__filter-radio">
            <input
              className="--d-none"
              id="buyRadio"
              type="radio"
              name="action"
              defaultChecked
              onChange={radioActionChangeHandle}
            />
            <label htmlFor="buyRadio">
              <div className="p2pManagement__filter-circle">
                <div className="p2pManagement__filter-dot"></div>
              </div>
              <span>Buy</span>
            </label>
          </span>
          <span className="p2pManagement__filter-radio">
            <input
              className="--d-none"
              id="sellRadio"
              type="radio"
              name="action"
              onChange={radioActionChangeHandle}
            />
            <label htmlFor="sellRadio">
              <div className="p2pManagement__filter-circle">
                <div className="p2pManagement__filter-dot"></div>
              </div>
              <span>Sell</span>
            </label>
          </span>
          <div className="p2pManagement__filter-item active">BTC</div>
          <div className="p2pManagement__filter-item">ETH</div>
          <div className="p2pManagement__filter-item">LTC</div>
          <div className="p2pManagement__filter-item">USDT</div>
          <div className="p2pManagement__filter-item">DOT</div>
          <div className="p2pManagement__filter-item">BNB</div>
        </div>
        <div className="p2pManagement__content">
          <div className="p2pManagement__content-title">
            List {capitalizeFirstLetter(advertisingStatus)}
          </div>
          <div className={`p2pManagement__content-data ${renderClassTable()}`}>
            <table>
              <thead>
                <tr>
                  <th>trader</th>
                  <th>Infomation</th>
                  <th>Value</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div>
                      <div>username</div>
                      <div>email</div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div>symbol</div>
                      <div>amount</div>
                      <div>rate</div>
                      <div>side</div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div>pay</div>
                      <div>create</div>
                    </div>
                  </td>
                  <td>
                    <div>action</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div>
                      <div>username</div>
                      <div>email</div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div>symbol</div>
                      <div>amount</div>
                      <div>rate</div>
                      <div>side</div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div>pay</div>
                      <div>create</div>
                    </div>
                  </td>
                  <td>
                    <div>action</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            className={`p2pManagement__content-empty spin-container ${renderClassSpin()}`}
          >
            <Spin />
          </div>
          <div
            className={`p2pManagement__content-spinner spin-container ${renderClassEmpty()}`}
          >
            <Empty />
          </div>
        </div>
      </div>
    </div>
  );
}
export default P2pManagement;
