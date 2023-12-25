import React from "react";
import { Empty, Spin } from "antd";
export default function P2pExchange() {
  return (
    <div className="p2pExchange">
      <div className="container"></div>
      <div className="p2pExchange__title">P2P EXCHANGE</div>
      <div className="p2pExchange__selected">
        <span className="p2pExchange__coin">BTC</span>
        <button className="p2pExchange__button-select"></button>
      </div>
      <div className="p2pExchange__search-container">
        <div className="p2pExchange__search-title">Amount:</div>
        <div className="p2pExchange__input-container">
          <input placeholder="enter BTC amount to Buy" type="text" />
          <span>BTC</span>
        </div>
        <div className="p2pExchange__type">
          <div className="p2pExchange__type-title">Nhập bằng:</div>
          <div className="p2pExchange__type-list">
            <div className="p2pExchange__type-item">VND</div>
            <div className="p2pExchange__type-item">BTC</div>
          </div>
        </div>
      </div>
      <div className="p2pExchange__data">
        <div className="p2pExchange__data-content"></div>
        <div className="p2pExchange__data-spin">
          <Spin />
        </div>
        <div className="p2pExchange__data-empty">
          <Empty />
        </div>
      </div>
      <div className="p2pExchange__footer">
        <span className="p2pExchange__footer-item">Tìm bán BTC?</span>
        <span className="p2pExchange__footer-item">Quay lại</span>
      </div>
    </div>
  );
}
