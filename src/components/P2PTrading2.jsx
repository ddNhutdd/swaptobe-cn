/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Empty, Pagination, Spin } from "antd";
import { t } from "i18next";
import {
  addClassToElementById,
  getClassListFromElementById,
  getElementById,
} from "src/util/common";
import { api_status } from "src/constant";
import { getListAdsBuy } from "src/util/userCallApi";
export default function P2PTrading2({ history }) {
  // The list of users selling coins must be placed in the buy section on the interface.
  // The list of users buying coins must be placed in the sell section on the interface.
  const { coin } = useSelector((root) => root.coinReducer);
  const callApiSellListStatus = useRef(api_status.pending);
  const callApiBuyListStatus = useRef(api_status.pending);
  const [buyListTotalItems, setBuyListTotalItems] = useState(1);
  const buyListCurrentPage = useRef(1);
  //
  const closeBuyContent = function () {
    addClassToElementById("buyContent", "--d-none");
  };
  const showBuyContent = function () {
    getClassListFromElementById("buyContent").remove("--d-none");
  };
  const closeBuyLoader = function () {
    addClassToElementById("buyLoader", "--d-none");
  };
  const showBuyLoader = function () {
    getClassListFromElementById("buyLoader").remove("--d-none");
  };
  const closeBuyEmpty = function () {
    addClassToElementById("buyEmpty", "--d-none");
  };
  const showBuyEmpty = function () {
    getClassListFromElementById("buyEmpty").remove("--d-none");
  };
  const closeSellContent = function () {
    addClassToElementById("sellContent", "--d-none");
  };
  const showSellContent = function () {
    getClassListFromElementById("sellContent").remove("--d-none");
  };
  const closeSellLoader = function () {
    addClassToElementById("sellLoader", "--d-none");
  };
  const showSellLoader = function () {
    getClassListFromElementById("sellLoader").remove("--d-none");
  };
  const closeSellEmpty = function () {
    addClassToElementById("sellEmpty", "--d-none");
  };
  const showSellEmpty = function () {
    getClassListFromElementById("sellEmpty").remove("--d-none");
  };
  const fetchListAdsSell = function () {};
  const fetchListAdsBuy = function (data) {
    return new Promise((resolve, reject) => {
      if (callApiBuyListStatus.current === api_status.fetching) resolve({});
      else callApiBuyListStatus.current = api_status.fetching;
      if (!coin) resolve({});
      getListAdsBuy(data)
        .then((resp) => {
          callApiBuyListStatus.current = api_status.fulfilled;
          resolve(resp.data.data);
        })
        .catch((error) => {
          callApiBuyListStatus.current = api_status.rejected;
          console.log(error);
          resolve({});
        });
    });
  };
  const renderListAdsBuy = async function (data) {
    closeBuyContent();
    closeBuyEmpty();
    showBuyLoader();
    const { array, total } = await fetchListAdsBuy(data);
    closeBuyLoader();
    if (!array || array.length <= 0) {
      showBuyEmpty();
    } else {
      //render html
      const containerElement = getElementById("sellContent");
      containerElement.innerHTML = "";
      for (const item of array) {
        containerElement.innerHTML += `<div class="buy-content box fadeInBottomToTop">
        <div class="item1">
          <span>User Name: ${item.userName}</span>
        </div>
        <div class="item2">
          <table>
          <tbody>
          <tr>
          <td>Amount:</td>
          <td class="item2-amount-number">${item.amount}</td>
        </tr>
        <tr>
          <td>Amount Minimum:</td>
          <td>${item.amountMinimum}</td>
        </tr>
            </tbody>
          </table>
        </div>
        <div class="item3">
          <table>
          <tbody>
          <tr>
          <td>Created At:</td>
          <td>${item.created_at}</td>
        </tr>
        <tr>
          <td>AddressWallet:</td>
          <td>${item.addressWallet}</td>
        </tr>
            </tbody>
          </table>
        </div>
        <div class="item4">
          <button name="${item.id}">${"Buy"}</button>
        </div>
      </div>`;
      }
      // add event
      for (const item of containerElement.children) {
        const button = item.querySelector("button");
        const id = button.name;
        button.addEventListener("click", buyClickHandle.bind(null, id));
      }
      // show
      showBuyContent();
    }
    setBuyListTotalItems(() => total);
  };
  const buyClickHandle = function (id) {
    console.log(id);
  };
  const onChange = function (page) {
    buyListCurrentPage.current = page;
    renderListAdsBuy({
      limit: 5,
      page: buyListCurrentPage.current,
      symbol: coin,
    });
  };
  //
  useEffect(() => {
    //
    const element = document.querySelector(".p2ptrading2");
    element.classList.add("fadeInBottomToTop");
    //
    renderListAdsBuy({
      limit: 5,
      page: buyListCurrentPage.current,
      symbol: coin,
    });
  }, []);
  return (
    <div className="p2ptrading2">
      <div className="container">
        <div className="buy">
          <div className="buy-title">
            <i className="fa-solid fa-flag"></i>
            <span>
              {t("youWantTo")} <span>{t("buy")}</span> {coin}?
            </span>
          </div>
          <div id="buyContent">
            <div className="buy-content box">
              <div className="item1">
                <span>User Name: test5</span>
              </div>
              <div className="item2"></div>
              <div className="item3"></div>
              <div className="item4">
                <Button type="primary">{t("buy")}</Button>
              </div>
            </div>
          </div>
          <div
            id="buyLoader"
            className="spin-container fadeInBottomToTop --d-none"
          >
            <Spin />
          </div>
          <div
            id="buyEmpty"
            className="spin-container fadeInBottomToTop --d-none"
          >
            <Empty />
          </div>
          <div className="p2ptrading2__footer">
            <div className="buy-ad">
              <button
                onClick={() => history.push("/create-ads/buy")}
                type="primary"
                size="large"
                className="buyAdBtn"
              >
                {t("creatingYourBuyingAd")}
              </button>
            </div>
            <Pagination
              defaultCurrent={1}
              pageSize={5}
              onChange={onChange}
              total={buyListTotalItems}
              showSizeChanger={false}
            />
          </div>
        </div>
        <div className="sell">
          <div className="sell-title">
            <i className="fa-solid fa-flag"></i>
            <span>
              {t("youWantTo")} <span>{t("sell")}</span> {coin}?
            </span>
          </div>
          <div id="sellContent">
            <div className="sell-content box">
              <div className="item1">
                <span>
                  <span>1.3119</span> USD/USDT
                </span>
                <span>{t("maximum") + ": " + t("unlimited")}</span>
              </div>
              <div className="item2">Westpac</div>
              <div className="item3">Felix500</div>
              <div className="item4">
                <Button type="primary">{t("sell")}</Button>
              </div>
            </div>
            <div className="sell-content box">
              <div className="item1">
                <span>
                  <span>1.3119</span> USD/USDT
                </span>
                <span>{t("maximum") + ": " + t("unlimited")}</span>
              </div>
              <div className="item2">Westpac</div>
              <div className="item3">Felix500</div>
              <div className="item4">
                <Button type="primary">{t("sell")}</Button>
              </div>
            </div>
          </div>
          <div id="sellLoader" className="spin-container --d-none">
            <Spin />
          </div>
          <div id="sellEmpty" className="spin-container --d-none">
            <Empty />
          </div>
          <div className="p2ptrading2__footer">
            <div className="sell-ad">
              <button
                onClick={() => history.push("/create-ads/sell")}
                type="primary"
                size="large"
                className="sellAdBtn"
              >
                {t("creatingYourSellingAd")}
              </button>
            </div>
            <Pagination
              defaultCurrent={1}
              total={500}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
