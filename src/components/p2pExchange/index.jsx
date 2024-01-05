/* eslint-disable react-hooks/exhaustive-deps */
// If the ad is for sale, display the buy button; if the ad is for buy, display the sell button
import React, { memo, useEffect, useState } from "react";
import { Spin, Modal } from "antd";
import { api_status, image_domain } from "src/constant";
import { Input } from "../Common/Input";
import socket from "src/util/socket";
import { DOMAIN } from "src/util/service";
import { useSelector } from "react-redux";
import { getCoin } from "src/redux/constant/coin.constant";
const P2pExchange = memo(function () {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const [selectedCoin, setSelectedCoin] = useState(useSelector(getCoin));
  const handleCancelModal = () => {
    setIsModalOpen(false);
  };
  const [callListCoinStatus, setCallListCoinStatus] = useState(
    api_status.pending
  );
  const [listCoin, setListCoin] = useState();
  const fetchListCoin = function () {
    setCallListCoinStatus(() => api_status.fetching);
    socket.once("listCoin", (resp) => {
      setListCoin(resp);
      setCallListCoinStatus(() => api_status.fulfilled);
    });
  };
  const renderClassListCoinSpin = function () {
    if (
      listCoin &&
      listCoin.length > 0 &&
      callListCoinStatus !== api_status.fetching
    )
      return "--d-none";
    else return "";
  };
  const renderListCoin = function () {
    if (!listCoin || listCoin.length <= 0) return;
    const renderActive = function (coinName) {
      return coinName === selectedCoin ? "active" : "";
    };
    return listCoin.map((item) => (
      <span
        key={item.id}
        onClick={coinItemClickHandle.bind(null, item.name)}
        className={`p2pExchange__coin-item ${renderActive(item.name)}`}
      >
        <img src={DOMAIN + item.image} alt={item.name} />
        <span>{item.name}</span>
      </span>
    ));
  };
  const coinItemClickHandle = function (coinName) {
    setSelectedCoin(() => coinName);
    handleCancelModal();
  };
  useEffect(() => {
    fetchListCoin();
  }, []);
  return (
    <div className="p2pExchange fadeInBottomToTop">
      <div className="container">
        <div className="p2pExchange__title">p2pExchange</div>
        <div className="p2pExchange__selected">
          <span className="p2pExchange__coin">
            <img
              src={image_domain.replace("USDT", selectedCoin.toUpperCase())}
              alt={selectedCoin}
            />
            {selectedCoin}
          </span>
          <button onClick={showModal} className="p2pExchange__button-select">
            <span>chooseAnotherCoin</span>
            <i className="fa-solid fa-caret-down"></i>
          </button>
        </div>
        <div className="p2pExchange__search-container">
          <div className="p2pExchange__search-title">quantity:</div>
          <div className="p2pExchange__input-container">
            <Input
              placeholder={"oooo"}
              type="text"
              style={{
                height: "45px",
                fontSize: "14px",
                border: 0,
                letterSpacing: "0.5px",
              }}
            />
            <span>typeInputShow</span>
          </div>
          <div className="p2pExchange__type">
            <div className="p2pExchange__type-title">enterWith:</div>
            <div className="p2pExchange__type-list">
              <div className="p2pExchange__type-item">currency</div>
              <div className="p2pExchange__type-item active">coin</div>
              <div className="p2pExchange__type-item">
                <div>Không có</div>
                <div>
                  <Spin />
                </div>
                <div className={`p2pExchange__type-button`}>{}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="p2pExchange__footer">
          <span className="p2pExchange__footer-item"></span>
          <span className="p2pExchange__footer-item">goBack</span>
        </div>
      </div>
      <Modal
        title={"chooseTheCoinYouWant"}
        open={isModalOpen}
        onCancel={handleCancelModal}
        width={600}
        footer={null}
      >
        <div className="p2pExchange__list-coin">{renderListCoin()}</div>
        <div className={`spin-container ${renderClassListCoinSpin()}`}>
          <Spin />
        </div>
      </Modal>
    </div>
  );
});
export default P2pExchange;
