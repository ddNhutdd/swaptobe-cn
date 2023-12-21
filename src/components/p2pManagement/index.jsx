import { Empty, Spin } from "antd";
import React from "react";
function P2pManagement() {
  return (
    <div className="p2pManagement">
      <div className="container">
        <div className="p2pManagement__header">
          <div className="p2pManagement__header-item ">
            <i className="fa-solid fa-border-all"></i>
            <span>All</span>
          </div>
          <div className="p2pManagement__header-item active">
            <i className="fa-solid fa-cart-shopping"></i>
            <span>Buy</span>
          </div>
          <div className="p2pManagement__header-item">
            <i className="fa-brands fa-sellcast"></i>
            <span>Sell</span>
          </div>
          <div className="p2pManagement__header-item">
            <i className="fa-solid fa-spinner"></i>
            <span>Pending</span>
          </div>
          <div className="p2pManagement__header-item"></div>
        </div>
        <div className="p2pManagement__filter">
          <span className="p2pManagement__filter-radio">
            <input
              className="--d-none"
              id="buyRadio"
              type="radio"
              name="action"
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
          <div className="p2pManagement__content-data">
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
          <div className="p2pManagement__content-empty spin-container">
            <Spin />
          </div>
          <div className="p2pManagement__content-spinner spin-container">
            <Empty />
          </div>
        </div>
      </div>
    </div>
  );
}
export default P2pManagement;
