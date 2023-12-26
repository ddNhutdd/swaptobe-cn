/* eslint-disable react-hooks/exhaustive-deps */
// If the ad is for sale, display the buy button; if the ad is for buy, display the sell button
import React, { memo, useState, useRef, useEffect } from "react";
import { Empty, Spin, Modal, Pagination } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import i18n from "src/translation/i18n";
import {
  getType,
  p2pExchangeType,
  setShow,
  showP2pType,
} from "src/redux/reducers/p2pTradingShow";
import { getCoin } from "src/redux/constant/coin.constant";
import {
  debounce,
  formatStringNumberCultureUS,
  getLocalStorage,
  setLocalStorage,
} from "src/util/common";
import {
  api_status,
  defaultLanguage,
  localStorageVariable,
  url,
} from "src/constant";
import socket from "src/util/socket";
import { searchBuyQuick, searchSellQuick } from "src/util/userCallApi";
import { DOMAIN } from "src/util/service";
const P2pExchange = memo(function () {
  const history = useHistory();
  const [type, setType] = useState(useSelector(getType));
  const [coin, setCoin] = useState(useSelector(getCoin));
  const isUserLogin = useSelector((state) => state.loginReducer.isLogin);
  const limit = useRef(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const [listCoin, setListCoin] = useState();
  const showModalChooseCoin = () => {
    setIsModalOpen(true);
  };
  const { t } = useTranslation();
  const [mainData, setMainData] = useState();
  const [callApiFetchMainDataStatus, setCallApiFetchMainDataStatus] = useState(
    api_status.pending
  );
  const [totalItems, setTotalItems] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const amountInputElement = useRef();
  const [callApiGetListCoinStatus, setCallApiGetListCoinStatus] = useState(
    api_status.pending
  );
  useEffect(() => {
    const language =
      getLocalStorage(localStorageVariable.lng) || defaultLanguage;
    i18n.changeLanguage(language);
    //
    fetchListCoin();
  }, []);
  const fetchMainData = function (limit, page, symbol, amount, type) {
    return new Promise((resolve, reject) => {
      if (callApiFetchMainDataStatus === api_status.fetching) resolve(false);
      else setCallApiFetchMainDataStatus(api_status.fetching);
      switch (type) {
        case p2pExchangeType.buy:
          searchBuyQuick({
            limit,
            page,
            symbol,
            amount,
          })
            .then((resp) => {
              const data = resp.data.data;
              console.log(data);
              setMainData(() => data.array);
              setTotalItems(() => data.total);
              setCurrentPage(() => page);
              setCallApiFetchMainDataStatus(api_status.fulfilled);
              resolve(data);
            })
            .catch((error) => {
              console.log(error);
              resolve(false);
              setCallApiFetchMainDataStatus(api_status.rejected);
            });
          break;
        case p2pExchangeType.sell:
          searchSellQuick({
            limit,
            page,
            symbol,
            amount,
          })
            .then((resp) => {
              const data = resp.data.data;
              setMainData(() => data.array);
              setTotalItems(() => data.total);
              setCurrentPage(() => page);
              setCallApiFetchMainDataStatus(api_status.fulfilled);
              resolve(data);
            })
            .catch((error) => {
              console.log(error);
              resolve(false);
              setCallApiFetchMainDataStatus(api_status.rejected);
            });
          break;
        default:
          resolve(false);
          break;
      }
    });
  };
  const renderMainData = function () {
    if (!mainData || mainData.length <= 0) return;
    return mainData.map((item) => (
      <div key={item.id} className="p2pExchange__data-content-item">
        <div className="p2pExchange__data-cell">User: {item.userName}</div>
        <div className="p2pExchange__data-cell amount">
          Amount Available: {item.amount - item.amountSuccess}
        </div>
        <div className="p2pExchange__data-cell minimum">
          Minimum: {item.amountMinimum}
        </div>
        <div className="p2pExchange__data-cell action">
          {item.side === p2pExchangeType.buy ? (
            <button
              className="p2pExchange__button-sell"
              onClick={buySellClickHandle.bind(null, item)}
            >
              Sell
            </button>
          ) : (
            <button
              className="p2pExchange__button-buy"
              onClick={buySellClickHandle.bind(null, item)}
            >
              Buy
            </button>
          )}
        </div>
      </div>
    ));
  };
  const fetchMainDataDebounced = debounce(fetchMainData, 1000);
  const handleCancelModalChooseCoin = () => {
    setIsModalOpen(false);
  };
  const backClickHandle = function () {
    if (callApiFetchMainDataStatus === api_status.fetching) return;
    dispatch(setShow([showP2pType.p2pTrading, p2pExchangeType.buy]));
    return;
  };
  const changeTypeClickHandle = function () {
    if (callApiFetchMainDataStatus === api_status.fetching) return;
    clearMainData();
    const amount =
      amountInputElement.current.value &&
      amountInputElement.current.value.replace(",", "");
    switch (type) {
      case p2pExchangeType.buy:
        setType(() => p2pExchangeType.sell);
        if (amount)
          fetchMainData(limit.current, 1, coin, amount, p2pExchangeType.sell);
        break;
      case p2pExchangeType.sell:
        setType(() => p2pExchangeType.buy);
        if (amount)
          fetchMainData(limit.current, 1, coin, amount, p2pExchangeType.buy);
        break;
      default:
        break;
    }
  };
  const renderFooterQuestion = function () {
    switch (type) {
      case p2pExchangeType.buy:
        return t("searchForBTCToSell");
      case p2pExchangeType.sell:
        return t("searchToBuyBTC");
      default:
        break;
    }
  };
  const amountInputChangeHandle = function (e) {
    const inputValue = e.target.value;
    const inputValueWithoutComma = inputValue.replace(/,/g, "");
    const regex = /^$|^[0-9]+(\.[0-9]*)?$/;
    if (!regex.test(inputValueWithoutComma)) {
      amountInputElement.current.value = inputValue.slice(0, -1);
      return;
    }
    const inputValueFormated = formatStringNumberCultureUS(
      inputValueWithoutComma
    );
    amountInputElement.current.value = inputValueFormated;
    //
    fetchMainDataDebounced(
      limit.current,
      1,
      coin,
      amountInputElement.current.value.replace(",", ""),
      type
    );
  };
  const fetchListCoin = function () {
    if (callApiGetListCoinStatus === api_status.fetching) return;
    setCallApiGetListCoinStatus(api_status.fetching);
    socket.once("listCoin", (resp) => {
      setCallApiGetListCoinStatus(api_status.fulfilled);
      setListCoin(resp);
    });
  };
  const renderModalChooseCoin = function () {
    if (!listCoin) return;
    return listCoin.map((item) => (
      <span
        onClick={coinSelectHandle}
        key={item.name}
        className={`p2pExchange__coin-item ${
          item.name === coin ? "active" : ""
        }`}
      >
        <img src={DOMAIN + item.image} alt={item.name} />
        <span>{item.name}</span>
      </span>
    ));
  };
  const coinSelectHandle = function (e) {
    if (callApiFetchMainDataStatus === api_status.fetching) return;
    clearMainData();
    const element = e.target.closest(".p2pExchange__coin-item");
    const coinSelected = element.querySelector("span").textContent;
    setCoin(() => coinSelected);
    handleCancelModalChooseCoin();
    //
    const amount =
      amountInputElement.current?.value &&
      amountInputElement.current?.value.replace(",", "");
    if (amount) fetchMainData(limit.current, 1, coinSelected, amount, type);
  };
  const pageChangeHandle = function (page) {
    if (callApiFetchMainDataStatus === api_status.fetching) return;
    const amount =
      amountInputElement.current.value &&
      amountInputElement.current.value.replace(",", "");
    fetchMainData(limit.current, page, coin, amount, type);
  };
  const renderClassContent = function () {
    if (
      callApiGetListCoinStatus !== api_status.fetching &&
      mainData &&
      mainData.length > 0
    )
      return "";
    else return "--d-none";
  };
  const renderClassEmpty = function () {
    if (
      callApiFetchMainDataStatus !== api_status.fetching &&
      (!mainData || mainData.length <= 0)
    )
      return "";
    else return "--d-none";
  };
  const renderClassSpin = function () {
    if (callApiFetchMainDataStatus === api_status.fetching) return "";
    else return "--d-none";
  };
  const clearMainData = function () {
    setMainData(() => null);
  };
  const buySellClickHandle = function (item) {
    if (!isUserLogin) {
      history.push(url.login);
      return;
    } else {
      setLocalStorage(localStorageVariable.adsItem, item);
      history.push(url.transaction);
      return;
    }
  };
  const renderPlaceholder = function () {
    switch (type) {
      case p2pExchangeType.buy:
        return t("enterBTCAmountToBuy").replace("BTC", coin);
      case p2pExchangeType.sell:
        return t("enterBTCAmountToSell").replace("BTC", coin);
      default:
        break;
    }
  };
  return (
    <div className="p2pExchange">
      <div className="container">
        <div className="p2pExchange__title">{t("p2pExchange")}</div>
        <div className="p2pExchange__selected">
          <span className="p2pExchange__coin">{coin}</span>
          <button
            onClick={showModalChooseCoin}
            className="p2pExchange__button-select"
          >
            <span>{t("chooseAnotherCoin")}</span>
            <i className="fa-solid fa-caret-down"></i>
          </button>
        </div>
        <div className="p2pExchange__search-container">
          <div className="p2pExchange__search-title">{t("quantity")}:</div>
          <div className="p2pExchange__input-container">
            <input
              placeholder={renderPlaceholder()}
              type="text"
              ref={amountInputElement}
              onChange={amountInputChangeHandle}
            />
            <span>{coin}</span>
          </div>
          <div className="p2pExchange__type">
            <div className="p2pExchange__type-title">{t("enterWith")}:</div>
            <div className="p2pExchange__type-list">
              <div className="p2pExchange__type-item">VND</div>
              <div className="p2pExchange__type-item">{coin}</div>
            </div>
          </div>
        </div>
        <div className="p2pExchange__data fadeInBottomToTop">
          <div className={`p2pExchange__data-content ${renderClassContent()}`}>
            {renderMainData()}
          </div>
          <div
            className={`p2pExchange__data-spin spin-container ${renderClassSpin()}`}
          >
            <Spin />
          </div>
          <div className={`p2pExchange__data-empty ${renderClassEmpty()}`}>
            <Empty />
          </div>
        </div>
        <div className="p2pExchange__paging">
          <Pagination
            defaultCurrent={1}
            pageSize={limit.current}
            current={currentPage}
            total={totalItems}
            showSizeChanger={false}
            onChange={pageChangeHandle}
          />
        </div>
        <div className="p2pExchange__footer">
          <span
            onClick={changeTypeClickHandle}
            className="p2pExchange__footer-item"
          >
            {renderFooterQuestion().replace("BTC", coin)}
          </span>
          <span onClick={backClickHandle} className="p2pExchange__footer-item">
            {t("goBack")}
          </span>
        </div>
        <Modal
          title="Choose the coin you want"
          open={isModalOpen}
          onCancel={handleCancelModalChooseCoin}
          width={600}
          footer={null}
        >
          <div className="p2pExchange__list-coin">
            {renderModalChooseCoin()}
            <div
              className={`spin-container ${
                callApiGetListCoinStatus === api_status.pending
                  ? ""
                  : "--d-none"
              }`}
            >
              <Spin />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
});
export default P2pExchange;
