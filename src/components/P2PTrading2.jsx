/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Button, Empty, Pagination, Spin, Modal } from "antd";
import { t } from "i18next";
import {
  addClassToElementById,
  convertStringToNumber,
  debounce,
  getClassListFromElementById,
  getElementById,
  getLocalStorage,
} from "src/util/common";
import { api_status, localStorageVariable, url } from "src/constant";
import {
  getListAdsBuy,
  getListAdsSell,
  searchSellQuick,
} from "src/util/userCallApi";
import socket from "src/util/socket";
import { DOMAIN } from "src/util/service";
export default function P2PTrading2({ history }) {
  // The list of users selling coins must be placed in the buy section on the interface.
  // The list of users buying coins must be placed in the sell section on the interface.
  const coin = getLocalStorage(localStorageVariable.coin);
  const callApiSellListStatus = useRef(api_status.pending);
  const callApiBuyListStatus = useRef(api_status.pending);
  const [buyListSectionTotalItems, setBuyListSectionTotalItems] = useState(1);
  const [sellListSectionTotalItems, setSellListSectionTotalItems] = useState(1);
  const buyCoin = useRef("BTC");
  const [buySectionPage, setBuySectionPage] = useState(1);
  const sellSectionPage = useRef(1);
  const listCoin = useRef();
  const amountSectionBuyFilter = useRef("");
  const [isBuyChooseCoinModalOpen, setIsBuyChooseCoinModalOpen] =
    useState(false);
  //
  const showBuyChooseCoinBuyModal = () => {
    setIsBuyChooseCoinModalOpen(true);
    setTimeout(() => {
      renderChooseCoinBuyModal(buyChooseCoinModalBuyItemCLick);
    }, 0);
  };
  const chooseCoinBuyCancelHandle = () => {
    setIsBuyChooseCoinModalOpen(false);
  };
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
  const fetchListAdsSell = function (page) {
    return new Promise((resolve) => {
      if (callApiSellListStatus.current === api_status.fetching) resolve({});
      else callApiSellListStatus.current = api_status.fetching;
      getListAdsSell({
        limit: 5,
        page: page,
        symbol: buyCoin.current,
      })
        .then((resp) => {
          callApiSellListStatus.current = api_status.fulfilled;
          resolve(resp.data.data);
        })
        .catch((error) => {
          callApiSellListStatus.current = api_status.rejected;
          console.log(error);
          resolve({});
        });
    });
  };
  const fetchListAdsBuy = function () {
    return new Promise((resolve) => {
      if (callApiBuyListStatus.current === api_status.fetching) resolve({});
      else callApiBuyListStatus.current = api_status.fetching;
      if (!coin) resolve({});
      getListAdsBuy({})
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
  const fetchListAdsSellFilter = function (page) {
    return new Promise((resolve) => {
      if (callApiSellListStatus.current === api_status.fetching) {
        return resolve({});
      }
      callApiSellListStatus.current = api_status.fetching;
      searchSellQuick({
        limit: 10,
        page: page,
        symbol: buyCoin.current,
        amount: Number(amountSectionBuyFilter.current),
      })
        .then((resp) => {
          callApiSellListStatus.current = api_status.fulfilled;
          return resolve(resp.data.data);
        })
        .catch((error) => {
          callApiSellListStatus.current = api_status.rejected;
          return resolve({});
        });
    });
  };
  const renderSectionBuy = async function (fnFetch, page) {
    closeBuySectionContent();
    closeBuySectionEmpty();
    showBuySectionLoader();
    const { array, total } = await fnFetch(page);
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
            <td>${t("userName")}:</td>
            <td>${item.userName}</td>
          </tr>
          <tr>
          <td>${t("bankName")}:</td>
          <td>${item.bankName}</td>
         </tr>
         <tr>
          <td>${t("fullName")}:</td>
          <td>${item.ownerAccount}</td>
         </tr>
         <tr>
          <td>${t("accountNumber")}:</td>
          <td>${item.numberBank}</td>
         </tr>
          </tbody>
        </table>
        </div>
        <div class="item2">
          <table>
          <tbody>
          <tr>
          <td>${t("amount")}:</td>
          <td class="item2-amount-number">${item.amount}</td>
        </tr>
        <tr>
          <td>${t("amountMinimum")}:</td>
          <td>${item.amountMinimum}</td>
        </tr>
        <tr>
          <td>${t("createdAt")}:</td>
          <td>${item.created_at}</td>
        </tr>
        <tr>
          <td>${t("addressWallet")}:</td>
          <td>${item.addressWallet}</td>
        </tr>
            </tbody>
          </table>
        </div>
        <div class="item4">
          <button name="${item.id}">${t("buy")}</button>
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
                  <td>${t("userName")}:</td>
                  <td>${item.userName}</td>
                </tr>
                <tr class="item2">
                  <td>${t("amount")}:</td>
                  <td class="item2-amount-number">${item.amount}</td>
                </tr>
                <tr>
                  <td>${t("amountMinimum")}:</td>
                  <td>${item.amountMinimum}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <table>
              <tbody>
                <tr>
                  <td>${t("createdAt")}:</td>
                  <td>${item.created_at}</td>
                </tr>
                <tr>
                  <td>${t("addressWallet")}:</td>
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
  const loadSectionBuy = function (page) {
    if (amountSectionBuyFilter.current) {
      renderSectionBuy(fetchListAdsSellFilter, page);
    } else {
      renderSectionBuy(fetchListAdsSell, page);
    }
  };
  const loadSectionBuyDebounce = debounce(loadSectionBuy, 1000);
  const buyClickHandle = function (id) {
    console.log(id);
  };
  const onChangeSectionBuyPaging = function (page) {
    setBuySectionPage(page);
    loadSectionBuy(page);
  };
  const onChangeSectionSellPaging = function (page) {
    sellSectionPage.current = page;
    renderSectionSell({
      limit: 5,
      page: sellSectionPage.current,
      symbol: coin,
    });
  };
  /**
   * render modal
   * @param {function} fu function for click item
   */
  const renderChooseCoinBuyModal = function (fu) {
    showModalBuySpin();
    const element = getElementById("p2ptrading2CoinBuyModal");
    element.innerHTML = "";
    if (!listCoin.current || listCoin.current.length <= 0) {
      return;
    }
    for (const item of listCoin.current) {
      element.innerHTML += `<span class="p2ptrading2-coin-to-select-modal__item ${
        item.name === buyCoin.current ? "active" : ""
      }">
      <img src="${DOMAIN + item.image}" />
        <span class='p2ptrading2-coin-to-select-modal__item-text'>${
          item.name
        }</span>
      </span>`;
    }
    // add event
    for (const item of element.children) {
      item.addEventListener(
        "click",
        fu.bind(
          null,
          item.querySelector(".p2ptrading2-coin-to-select-modal__item-text")
            .innerHTML
        )
      );
    }
    console.log("llllll");
    closeModalBuySpin();
  };
  const buyChooseCoinModalBuyItemCLick = function (coin) {
    buyCoin.current = coin;
    const constainer = getElementById("p2ptrading2CoinBuyModal");
    for (const item of constainer.children) {
      const coin = item.querySelector(
        ".p2ptrading2-coin-to-select-modal__item-text"
      ).innerHTML;
      if (coin === buyCoin.current) {
        if (!item.classList.contains("active")) item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    }
    amountSectionBuyFilterClear();
    setBuySectionPage(() => 1);
    loadSectionBuy(1);
    chooseCoinBuyCancelHandle();
  };
  const amountSectionBuyFilterChangeHandle = function (e) {
    amountSectionBuyFilter.current = e.target.value;
    loadSectionBuyDebounce();
    setBuySectionPage(() => 1);
    loadSectionBuyDebounce(1);
  };
  const amountSectionBuyFilterClear = function () {
    amountSectionBuyFilter.current = "";
    getElementById("amountSectionBuyFilterInput").innerHTML = "";
  };
  const closeModalBuySpin = function () {
    addClassToElementById("p2ptrading2CoinBuyModalSpin", "--d-none");
  };
  const showModalBuySpin = function () {
    getClassListFromElementById("p2ptrading2CoinBuyModalSpin").remove(
      "--d-none"
    );
  };

  //
  useEffect(() => {
    buyCoin.current = coin;
    renderSectionBuy(fetchListAdsSell, 1);
    //
    socket.once("listCoin", (resp) => {
      listCoin.current = resp;
      const ele = getElementById("p2ptrading2CoinBuyModal");
      if (ele) {
        renderChooseCoinBuyModal(buyChooseCoinModalBuyItemCLick);
      }
    });
    //
    const element = document.querySelector(".p2ptrading2");
    element.classList.add("fadeInBottomToTop");
  }, []);
  return (
    <div className="p2ptrading2">
      <div className="container">
        <div className="buy">
          <div className="buy-title">
            <i className="fa-solid fa-flag"></i>
            <span>
              {t("youWantTo")} <span>{t("buy")}</span>{" "}
              <button
                onClick={showBuyChooseCoinBuyModal}
                className="buyChoiceCoin"
              >
                {buyCoin.current}
              </button>
              ?
            </span>
          </div>
          <div className="buy__filter">
            <input
              id="amountSectionBuyFilterInput"
              onChange={amountSectionBuyFilterChangeHandle}
              type="text"
              placeholder="Amount"
            />
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
              current={buySectionPage}
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
      <Modal
        title="Coin to Buy"
        open={isBuyChooseCoinModalOpen}
        onCancel={chooseCoinBuyCancelHandle}
        footer={null}
      >
        <div>
          <div
            id="p2ptrading2CoinBuyModal"
            className="p2ptrading2-coin-to-select-modal"
          ></div>
          <div id="p2ptrading2CoinBuyModalSpin" className="spin-container">
            <Spin />
          </div>
        </div>
      </Modal>
    </div>
  );
}
