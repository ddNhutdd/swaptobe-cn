/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Pagination, Spin, Empty, Modal } from "antd";
import {
  addClassToElementById,
  getClassListFromElementById,
  getElementById,
} from "src/util/common";
import socket from "src/util/socket";
import { DOMAIN } from "src/util/service";
function Ads() {
  const [isModalCoinOpen, setIsModalCoinOpen] = useState(false);
  const action = useRef("All");
  const listCoin = useRef([]);
  const selectedCoin = useRef("BTC");
  useEffect(() => {
    document.addEventListener("click", closeDropdownAction);
    //
    disableDropdownCoin();
    //
    socket.once("listCoin", (resp) => {
      listCoin.current = resp;
    });
    return () => {
      document.removeEventListener("click", closeDropdownAction);
    };
  }, []);
  useEffect(() => {
    console.log("kkkk");
  }, [listCoin.current]);
  const toggleDropdownAction = function (e) {
    e.stopPropagation();
    getClassListFromElementById("dropdownActionMenu").toggle("show");
    getClassListFromElementById("dropdownActionSelected").toggle("active");
  };
  const closeDropdownAction = function () {
    getClassListFromElementById("dropdownActionMenu").remove("show");
    getClassListFromElementById("dropdownActionSelected").remove("active");
  };
  const dropdownActionItemClickHandle = function (e) {
    action.current = e.target.innerHTML;
    dropdownActionSelect(action.current);
  };
  const dropdownActionSelect = function (action) {
    const classActive = "active";
    const containerElement = getElementById("dropdownActionMenu");
    for (const item of containerElement.children) {
      if (item.innerHTML !== action) {
        item.classList.remove(classActive);
      } else {
        item.classList.contains(classActive) || item.classList.add(classActive);
      }
    }
    getElementById("dropdownActionSelected").querySelector(
      ".admin__dropdown-text"
    ).innerHTML = action;
    //
    if (action === "All") disableDropdownCoin();
    else enableDropdownCoin();
  };
  const showModalCoin = () => {
    if (
      getClassListFromElementById("dropdownCoinSelected").contains("disabled")
    )
      return;
    setIsModalCoinOpen(true);
    setTimeout(() => {
      renderListCoin(listCoin);
    }, 0);
  };
  const handleCancelModalCoin = () => {
    setIsModalCoinOpen(false);
  };
  const disableDropdownCoin = function () {
    addClassToElementById("dropdownCoinSelected", "disabled");
  };
  const enableDropdownCoin = function () {
    getClassListFromElementById("dropdownCoinSelected").remove("disabled");
  };
  const renderListCoin = function (listCoin) {
    const element = getElementById("modalCoinContent");
    element.innerHTML = "";
    if (!listCoin.current || listCoin.current.length <= 0) {
      console.log("here");
      showModalSpinner();
      return;
    } else {
      closeModalSpinner();
    }
    for (const { name, image } of listCoin.current) {
      element.innerHTML += `<span class="ads-modal-coin-content__item ${
        selectedCoin.current === name ? "active" : ""
      }">
        <span class="ads-modal-coin-content__img">
          <img src="${DOMAIN + image}" alt="${name}" />
        </span>
        <span class="ads-modal-coin-content__text">${name}</span>
      </span>`;
    }
    for (const item of element.children) {
      const name = item.querySelector(
        ".ads-modal-coin-content__text"
      ).innerHTML;
      item.addEventListener("click", coinSelectHandle.bind(null, name));
    }
  };
  const coinSelectHandle = function (coinName) {
    selectedCoin.current = coinName;
    handleCancelModalCoin();
  };
  const showModalSpinner = function () {
    const element = getElementById("modalSpinner");
    if (element) element.classList.remove("--d-none");
  };
  const closeModalSpinner = function () {
    const element = getElementById("modalSpinner");
    if (element) {
      addClassToElementById("modalSpinner", "--d-none");
    }
  };
  return (
    <div className="ads">
      <div className="ads__header">
        <h3 className="ads__title">Ads</h3>
        <div className="ads__filter">
          <div className="ads__dropdown-action">
            <label>Action: </label>
            <div className="ads__dropdown">
              <div
                onClick={toggleDropdownAction}
                className="admin__dropdown-selected"
                id="dropdownActionSelected"
              >
                <span className="admin__dropdown-text">All</span>
                <span>
                  <i className="fa-solid fa-angle-down"></i>
                </span>
              </div>
              <div id="dropdownActionMenu" className="admin__dropdown-menu">
                <div
                  onClick={dropdownActionItemClickHandle}
                  className="admin__dropdown-item"
                >
                  All
                </div>
                <div
                  onClick={dropdownActionItemClickHandle}
                  className="admin__dropdown-item"
                >
                  Buy
                </div>
                <div
                  onClick={dropdownActionItemClickHandle}
                  className="admin__dropdown-item"
                >
                  Sell
                </div>
              </div>
            </div>
          </div>
          <div className="ads__checkbox">
            <input id="pendingCheckbox" type="checkbox" className="--d-none" />
            <label className="ads__checkbox-item" htmlFor="pendingCheckbox">
              <div className="ads__checkbox__label">Pending: </div>
              <div className="ads__checkbox__control"></div>
              <i className="fa-solid fa-check"></i>
            </label>
          </div>
          <div className="ads__dropdown-coin">
            <label>Coin:</label>
            <div onClick={showModalCoin} className="ads__dropdown ">
              <div
                id="dropdownCoinSelected"
                className="admin__dropdown-selected"
              >
                <span className="admin__dropdown-text">All</span>
                <span>
                  <i className="fa-solid fa-angle-down"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="ads__paging">
          <Pagination
            defaultCurrent={1}
            pageSize={10}
            showSizeChanger={false}
          />
        </div>
      </div>
      <div className="ads__content">
        <table className="ads__table">
          <thead>
            <tr>
              <th>Id</th>
              <th>User Name</th>
              <th>Created At</th>
              <th>Amount</th>
              <th>Amount Minimum</th>
              <th>Address Wallet</th>
              <th>Bank Name</th>
              <th>Owner Account</th>
              <th>Number Bank</th>
              <th>Symbol</th>
              <th>Action</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>daingo</td>
              <td>29-4</td>
              <td>1</td>
              <td>0.001</td>
              <td>12345679</td>
              <td>OCB</td>
              <td>ngo dai</td>
              <td>123456</td>
              <td>BTC</td>
              <td>Buy</td>
              <td>pending</td>
            </tr>
          </tbody>
        </table>
        <div className="ads__content-spinner spin-container --d-none">
          <Spin />
        </div>
        <div className="ads__content-empty spin-container --d-none">
          <Empty />
        </div>
      </div>
      <Modal
        title="Select Your Coin"
        open={isModalCoinOpen}
        onCancel={handleCancelModalCoin}
        footer={false}
      >
        <div id="modalCoinContent" className="ads-modal-coin-content">
          <span className="ads-modal-coin-content__item active">
            <span className="ads-modal-coin-content__img">
              <img src="https://remitano.dk-tech.vn/images/BTC.png" alt="..." />
            </span>
            <span className="ads-modal-coin-content__text">BTB</span>
          </span>
        </div>
        <div id="modalSpinner" className="spin-container --d-none">
          <Spin />
        </div>
      </Modal>
    </div>
  );
}
export default Ads;
