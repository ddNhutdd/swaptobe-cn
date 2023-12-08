/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Pagination } from "antd";
import socket from "src/util/socket";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";
function SeresoWalletDeposit() {
  const showDropdownCoinMenu = function (e) {
    e.stopPropagation();
    document.getElementById("coin-dropdown-menu").classList.toggle("show");
  };
  const showDropdownNetworkMenu = function (e) {
    e.stopPropagation();
  };
  const closeAllDropdownMenu = function () {
    document.getElementById("coin-dropdown-menu").classList.remove("show");
  };
  const { t } = useTranslation();
  useEffect(() => {
    // socket.once("listCoin", (resp) => {});
    document.addEventListener("click", closeAllDropdownMenu);
    return () => {
      document.removeEventListener("click", closeAllDropdownMenu);
    };
  }, []);
  // const copyAddressClickHandle = () => {
  //   const addressCode = addressCodeElement.current.innerHTML;
  //   const writeTexttoClipboard = navigator.clipboard.writeText(addressCode);
  //   writeTexttoClipboard.then(() => {
  //     showToast(showAlertType.success, t("copySuccess"));
  //   });
  // };
  const renderHistoryDeposit = function (arrData) {
    return (
      <div className="wallet-deposit__history fadeInBottomToTop">
        {arrData && arrData.length ? (
          arrData.map((item) => (
            <div key={item.coin_key} className="wallet-deposite__history-item">
              <div className="wallet-deposite__history-time">
                <i className="fa-solid fa-calendar"></i> {item.created_at}
              </div>
              <div className="wallet-deposite__history-name">
                {(item.coin_key ?? "").toUpperCase()}
              </div>
              <div className="wallet-deposite__history-amount">
                +{item.amount} coins
              </div>
              <div className="wallet-deposite__history-final">
                <span>Final Amount:</span>
                <span>{item.before_amount} coins</span>
              </div>
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
    );
  };
  //
  return (
    <div className="container">
      <div className="wallet-deposit fadeInBottomToTop">
        <div className="wallet-deposit-left">
          <ul>
            <li>
              <span className="number">1</span>
              <div className="wallet-deposit-input">
                <p>{t("select")} Coin</p>
                <div
                  onClick={showDropdownCoinMenu}
                  className="dropdown-content-selected"
                >
                  <img
                    src="https://remitano.dk-tech.vn/images/BTC.png"
                    alt="name"
                  />
                  <span className="content">
                    <span className="main-content">BTC</span>
                    Bitcoin
                  </span>
                  <i className="fa-solid fa-caret-down"></i>
                </div>
                <div id="coin-dropdown-menu" className="dropdown-menu">
                  <div className={`dropdown-item-coin`}>
                    <img
                      src="https://remitano.dk-tech.vn/images/BTC.png"
                      alt="..."
                    />
                    <span className="dropdown-item-key">BTC</span>
                    <span>bitcoint</span>
                  </div>
                  <div className={`dropdown-item-coin active}`}>
                    <img
                      src="https://remitano.dk-tech.vn/images/BTC.png"
                      alt="..."
                    />
                    <span className="dropdown-item-key">BTC</span>
                    <span>Bitcoin</span>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <span className="number">2</span>
              <div className="wallet-deposit-input">
                <p>{t("select")} Network</p>
                <div
                  onClick={showDropdownNetworkMenu}
                  className="dropdown-content-selected"
                >
                  <span className="content">
                    <span className="main-content">TCB</span>
                    bitcon
                  </span>
                  <i className="fa-solid fa-caret-down"></i>
                </div>
                <div className="dropdown-menu">
                  <div className="dropdown-item-network">
                    <div className="dropdown-item-network-left">
                      <span>key</span>
                      <span>type</span>
                    </div>
                    <div className="dropdown-item-network-right">
                      <span>≈10 mins</span>
                      <span>23 Confirmation/s</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="--d-none">
              <span className="number">3</span>
              <div className="address">
                <p>
                  Desposite Address
                  <span>
                    <i className="fa-solid fa-pen-to-square"></i>
                  </span>
                </p>
                {
                  <>
                    <div className="address-content">
                      <div className={`fadeInBottomToTop`}>
                        <QRCode
                          style={{
                            height: "auto",
                            maxWidth: "100%",
                            width: "100%",
                          }}
                          value={""}
                        />
                      </div>
                      <div className="address-code fadeInBottomToTop">
                        <div className="address-code-title">address</div>
                        <div className="code"></div>
                      </div>
                      <span className="address-copy fadeInBottomToTop">
                        <i className="fa-regular fa-copy"></i>
                      </span>
                    </div>
                  </>
                }
              </div>
            </li>
          </ul>
        </div>
        <div className="wallet-deposit-right">
          <h3>Desposite BTC history</h3>
          renderHistoryDeposit(depositeHistory)
          <div className="wallet-deposite-paging">
            <Pagination defaultCurrent={1} total={10} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default SeresoWalletDeposit;
