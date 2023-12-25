/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useState, useRef, useEffect } from "react";
import { Empty, Spin, Modal } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  getType,
  p2pExchangeType,
  setShow,
  showP2pType,
} from "src/redux/reducers/p2pTradingShow";
import { getCoin } from "src/redux/constant/coin.constant";
import { formatStringNumberCultureUS } from "src/util/common";
import { api_status } from "src/constant";
import socket from "src/util/socket";
const P2pExchange = memo(function () {
  let [type, setType] = useState(useSelector(getType));
  const coin = useSelector(getCoin);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const [listCoin, setListCoin] = useState();
  const showModalChooseCoin = () => {
    setIsModalOpen(true);
  };
  const amountInputElement = useRef();
  useEffect(() => {
    fetchListCoin();
  }, []);
  const handleCancelModalChooseCoin = () => {
    setIsModalOpen(false);
  };
  const backClickHandle = function () {
    dispatch(setShow([showP2pType.p2pTrading, p2pExchangeType.buy]));
    return;
  };
  const changeTypeClickHandle = function () {
    switch (type) {
      case p2pExchangeType.buy:
        setType(() => p2pExchangeType.sell);
        break;
      case p2pExchangeType.sell:
        setType(() => p2pExchangeType.buy);
        break;
      default:
        break;
    }
  };
  const renderFooterQuestion = function () {
    switch (type) {
      case p2pExchangeType.buy:
        return `Tìm bán BTC?`;
      case p2pExchangeType.sell:
        return `Tìm mua BTC?`;
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
  };
  const [callApiGetListCoinStatus, setCallApiGetListCoinStatus] = useState(
    api_status.pending
  );
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
      <span key={item.name} className="p2pExchange__coin-item">
        {item.name}
      </span>
    ));
  };
  return (
    <div className="p2pExchange">
      <div className="container">
        <div className="p2pExchange__title">P2P EXCHANGE</div>
        <div className="p2pExchange__selected">
          <span className="p2pExchange__coin">{coin}</span>
          <button
            onClick={showModalChooseCoin}
            className="p2pExchange__button-select"
          >
            <span>chon mot coi khac</span>
            <i className="fa-solid fa-caret-down"></i>
          </button>
        </div>
        <div className="p2pExchange__search-container">
          <div className="p2pExchange__search-title">Amount:</div>
          <div className="p2pExchange__input-container">
            <input
              placeholder={`enter ${coin} amount to ${type}`}
              type="text"
              ref={amountInputElement}
              onChange={amountInputChangeHandle}
            />
            <span>{coin}</span>
          </div>
          <div className="p2pExchange__type">
            <div className="p2pExchange__type-title">Nhập bằng:</div>
            <div className="p2pExchange__type-list">
              <div className="p2pExchange__type-item">VND</div>
              <div className="p2pExchange__type-item">BTC</div>
            </div>
          </div>
        </div>
        <div className="p2pExchange__data fadeInBottomToTop">
          <div className="p2pExchange__data-content">
            <div className="p2pExchange__data-content-item">
              <div className="p2pExchange__data-cell">User: Văn Nam Phúc</div>
              <div className="p2pExchange__data-cell amount">Amount: 5</div>
              <div className="p2pExchange__data-cell minimum">
                Minimum: 0.00001
              </div>
            </div>
          </div>
          <div className="p2pExchange__data-spin spin-container --d-none">
            <Spin />
          </div>
          <div className="p2pExchange__data-empty  --d-none">
            <Empty />
          </div>
        </div>
        <div className="p2pExchange__footer">
          <span
            onClick={changeTypeClickHandle}
            className="p2pExchange__footer-item"
          >
            {renderFooterQuestion().replace("BTC", coin)}
          </span>
          <span onClick={backClickHandle} className="p2pExchange__footer-item">
            Quay lại
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
