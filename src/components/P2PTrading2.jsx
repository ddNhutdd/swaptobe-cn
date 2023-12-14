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
import { api_status, url } from "src/constant";
import { getListAdsBuy, getListAdsSell } from "src/util/userCallApi";
export default function P2PTrading2({ history }) {
  // The list of users selling coins must be placed in the buy section on the interface.
  // The list of users buying coins must be placed in the sell section on the interface.
  const { coin } = useSelector((root) => root.coinReducer);
  const callApiSellListStatus = useRef(api_status.pending);
  const callApiBuyListStatus = useRef(api_status.pending);
  const [buyListSectionTotalItems, setBuyListSectionTotalItems] = useState(1);
  const [sellListSectionTotalItems, setSellListSectionTotalItems] = useState(1);
  const buySectionPage = useRef(1);
  const sellSectionPage = useRef(1);
  //
  const closeBuySectionContent = function () {
    addClassToElementById("buyContent", "--d-none");
  };
  const showBuySectionContent = function () {
    getClassListFromElementById("buyContent").remove("--d-none");
  };
  const closeBuySectionLoader = function () {
    addClassToElementById("buyLoader", "--d-none");
  };
  const showBuySectionLoader = function () {
    getClassListFromElementById("buyLoader").remove("--d-none");
  };
  const closeBuySectionEmpty = function () {
    addClassToElementById("buyEmpty", "--d-none");
  };
  const showBuySectionEmpty = function () {
    getClassListFromElementById("buyEmpty").remove("--d-none");
  };
  const closeSellSectionContent = function () {
    addClassToElementById("sellContent", "--d-none");
  };
  const showSellSectionContent = function () {
    getClassListFromElementById("sellContent").remove("--d-none");
  };
  const closeSellSectionLoader = function () {
    addClassToElementById("sellLoader", "--d-none");
  };
  const showSellSectionLoader = function () {
    getClassListFromElementById("sellLoader").remove("--d-none");
  };
  const closeSellSectionEmpty = function () {
    addClassToElementById("sellEmpty", "--d-none");
  };
  const showSellSectionEmpty = function () {
    getClassListFromElementById("sellEmpty").remove("--d-none");
  };
  const fetchListAdsSell = function (data) {
    return new Promise((resolve) => {
      if (callApiSellListStatus.current === api_status.fetching) resolve(null);
      else callApiSellListStatus.current = api_status.fetching;
      getListAdsSell(data)
        .then((resp) => {
          callApiSellListStatus.current = api_status.fulfilled;
          resolve(resp.data.data);
        })
        .catch((error) => {
          callApiSellListStatus.current = api_status.rejected;
          console.log(error);
          resolve(null);
        });
    });
  };
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
  const renderSectionBuy = async function (data) {
    closeBuySectionContent();
    closeBuySectionEmpty();
    showBuySectionLoader();
    const { array, total } = await fetchListAdsSell(data);
    closeBuySectionLoader();
    const containerElement = getElementById("buyContent");
    containerElement.innerHTML = "";
    if (!array || array.length <= 0) {
      showBuySectionEmpty();
    } else {
      //render html
      for (const item of array) {
        containerElement.innerHTML += `<div class="record-content box fadeInBottomToTop">
        <div>
          <table>
          <tbody>
          <tr>
            <td>User Name:</td>
            <td>${item.userName}</td>
          </tr>
          <tr>
          <td>Bank Name:</td>
          <td>${item.bankName}</td>
         </tr>
         <tr>
          <td>Name:</td>
          <td>${item.ownerAccount}</td>
         </tr>
         <tr>
          <td>Account Number:</td>
          <td>${item.numberBank}</td>
         </tr>
          </tbody>
        </table>
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
      showBuySectionContent();
    }
    setBuyListSectionTotalItems(() => total);
  };
  const renderSectionSell = async function (data) {
    closeSellSectionContent();
    closeSellSectionEmpty();
    showSellSectionLoader();
    const { array, total } = await fetchListAdsBuy(data);
    closeSellSectionLoader();
    const containerElement = getElementById("sellContent");
    containerElement.innerHTML = "";
    if (!array || array.length <= 0) {
      showSellSectionEmpty();
    } else {
      for (const item of array) {
        containerElement.innerHTML += `<div class="record-content box fadeInBottomToTop">
          <div>
            <table>
              <tbody>
                <tr>
                  <td>User Name:</td>
                  <td>${item.userName}</td>
                </tr>
                <tr class="item2">
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
          <div>
            <table>
              <tbody>
                <tr>
                  <td>Created At:</td>
                  <td>${item.created_at}</td>
                </tr>
                <tr>
                  <td>Address Wallet:</td>
                  <td>${item.addressWallet}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="item4">
            <button name="${item.id}">${"Sell"}</button>
          </div>
        </div>`;
      }
      // add
    }
    // show
    showSellSectionContent();
    setSellListSectionTotalItems(() => total);
  };
  const buyClickHandle = function (id) {
    console.log(id);
  };
  const onChangeSectionBuyPaging = function (page) {
    buySectionPage.current = page;
    renderSectionBuy({
      limit: 5,
      page: buySectionPage.current,
      symbol: coin,
    });
  };
  const onChangeSectionSellPaging = function (page) {
    sellSectionPage.current = page;
    renderSectionSell({
      limit: 5,
      page: sellSectionPage.current,
      symbol: coin,
    });
  };
  //
  useEffect(() => {
    //
    const element = document.querySelector(".p2ptrading2");
    element.classList.add("fadeInBottomToTop");
  }, []);
  useEffect(() => {
    renderSectionBuy({
      limit: 5,
      page: buySectionPage.current,
      symbol: coin,
    });
    renderSectionSell({
      limit: 5,
      page: sellSectionPage.current,
      symbol: coin,
    });
  }, [coin]);
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
                onClick={() => history.push(url.create_ads_sell)}
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
              onChange={onChangeSectionBuyPaging}
              total={buyListSectionTotalItems}
              showSizeChanger={false}
            />
          </div>
        </div>
        <div className="sell">
          <div className="sell-title">
            <i className="fa-solid fa-flag"></i>
            <span>
              {t("youWantTo")}{" "}
              <span>
                {t("sell").at(0).toLocaleUpperCase() + t("sell").slice(1)}
              </span>{" "}
              {coin}?
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
                onClick={() => history.push(url.create_ads_buy)}
                type="primary"
                size="large"
                className="sellAdBtn"
              >
                {t("creatingYourSellingAd")}
              </button>
            </div>
            <Pagination
              defaultCurrent={1}
              pageSize={5}
              total={sellListSectionTotalItems}
              showSizeChanger={false}
              onChange={onChangeSectionSellPaging}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
