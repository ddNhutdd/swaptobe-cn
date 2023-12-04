import React, { useEffect, useRef, useState } from "react";
import socket from "src/util/socket";
import { useTranslation } from "react-i18next";
import { Empty } from "antd";
import QRCode from "react-qr-code";
import { useDispatch } from "react-redux";
import { createWalletApi, getDepositHistoryApi } from "src/util/userCallApi";
import { showToast } from "src/function/showToast";
import { Pagination } from "antd";
import { api_status, showAlertType } from "src/constant";
import { Spin } from "antd";
import { userWalletFetchCount } from "src/redux/actions/coin.action";
import { DOMAIN } from "src/util/service";
function SeresoWalletDeposit() {
  //
  const [networkDropdownData] = useState([
    {
      key: "BTC",
      type: "Bitcoin",
      time: "41",
      confirm: "2",
      decription: "thong tin",
    },
    {
      key: "BTC 2",
      type: "Bitcoin 2",
      time: "42",
      confirm: "3",
      decription: "thong tin",
    },
  ]);
  const [coinDropdownData, setCoinDropdownData] = useState([]);
  const dispatch = useDispatch();
  const [callApiStatusAddress, setCallApiStatusAddress] = useState(
    api_status.pending
  );
  const [callApiStatusHistory, setCallApiStatusHistory] = useState(
    api_status.pending
  );
  const [, setDepositeHistoryTotalPage] = useState(1);
  const [depositeHistoryCurrentPage] = useState(1);
  const [depositeHistory, setDepositeHistory] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState({
    blockchain: "TRX",
    image: "images/ETH.png",
    name: "ETH",
    symbolWallet: "ETH",
    token_key: "Ethereum",
  });

  const [selectedNetwork] = useState(networkDropdownData[0]);
  const loadListOnce = useRef(false);
  const [addressCode, setAddressCode] = useState("");

  const coin = "HHH";
  const addressCodeElement = useRef(null);
  const dropdownCoin = useRef(null);
  const dropdownCoinMenu = useRef(null);
  const dropdownNetwork = useRef(null);
  const dropdownNetworkMenu = useRef(null);
  //
  const showDropdownCoinMenu = function (e) {
    e.stopPropagation();
    dropdownCoin.current.classList.toggle("active");
    dropdownCoinMenu.current.classList.toggle("show");
    dropdownNetwork.current.classList.remove("active");
    dropdownNetworkMenu.current.classList.remove("show");
  };
  const showDropdownNetworkMenu = function (e) {
    e.stopPropagation();
    dropdownNetwork.current.classList.toggle("active");
    dropdownNetworkMenu.current.classList.toggle("show");
    dropdownCoin.current.classList.remove("active");
    dropdownCoinMenu.current.classList.remove("show");
  };
  const closeAllDropdownMenu = function () {
    dropdownCoin.current.classList.remove("active");
    dropdownCoinMenu.current.classList.remove("show");
    dropdownNetwork.current.classList.remove("active");
    dropdownNetworkMenu.current.classList.remove("show");
  };
  useEffect(() => {
    document.addEventListener("click", closeAllDropdownMenu);
    //
    if (loadListOnce && coinDropdownData.length <= 0) {
      socket.on("listCoin", (res) => {
        setCoinDropdownData(res);
        socket.off("listCoin");
      });
    } else if (coinDropdownData.length > 0) {
      loadListOnce.current = true;
      socket.off("listCoin");
    }
    //
    if (coin) {
      // call api lay address
      setCallApiStatusAddress(api_status.fetching);
      createWalletApi(coin)
        .then((dataResponse) => {
          setAddressCode(dataResponse.data.data.address);
          coin === "BTC" && dispatch(userWalletFetchCount());
          setCallApiStatusAddress(api_status.fulfilled);
        })
        .catch((error) => {
          setCallApiStatusAddress(api_status.rejected);
          console.log(error);
        });
      //call api lay history deposite
      setCallApiStatusHistory(api_status.fetching);
      getDepositHistoryApi({
        limit: 10,
        page: depositeHistoryCurrentPage,
        symbol: coin,
      })
        .then((resp) => {
          setDepositeHistoryTotalPage(resp.data.data.total);
          setDepositeHistory(resp.data.data.array);
          setCallApiStatusHistory(api_status.fulfilled);
        })
        .catch((error) => {
          setCallApiStatusHistory(api_status.rejected);
          console.log(error);
        });
    }
    //
    return () => {
      document.removeEventListener("click", closeAllDropdownMenu);
      socket.off("listCoin");
    };
  }, []);
  const { t } = useTranslation();
  //
  const renderDropdownCoinMenu = (coinDropdownData) =>
    coinDropdownData.map((dropdownItem) => (
      <div
        key={dropdownItem.name}
        onClick={() => {
          setSelectedCoin(dropdownItem);
        }}
        className={`dropdown-item-coin ${
          dropdownItem.name === selectedCoin.name ? "active" : ""
        }`}
      >
        <img src={DOMAIN + dropdownItem.image} alt={dropdownItem.name} />
        <span className="dropdown-item-key">{dropdownItem.name}</span>
        <span>{dropdownItem.token_key}</span>
      </div>
    ));
  const renderDropdownNetworkMenu = (networkDropdownData) =>
    networkDropdownData.map((dropdownItem) => (
      <div
        key={dropdownItem.key}
        onClick={() => {
          console.log("click");
        }}
        className="dropdown-item-network"
      >
        <div className="dropdown-item-network-left">
          <span>{dropdownItem.key}</span>
          <span>{dropdownItem.type}</span>
        </div>
        <div className="dropdown-item-network-right">
          <span>≈{dropdownItem.time} mins</span>
          <span>{dropdownItem.confirm} Confirmation/s</span>
        </div>
      </div>
    ));
  const copyAddressClickHandle = () => {
    const addressCode = addressCodeElement.current.innerHTML;
    const writeTexttoClipboard = navigator.clipboard.writeText(addressCode);
    writeTexttoClipboard.then(() => {
      showToast(showAlertType.success, t("copySuccess"));
    });
  };
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
                  ref={dropdownCoin}
                  className="dropdown-content-selected"
                >
                  <img
                    src={DOMAIN + selectedCoin.image}
                    alt={selectedCoin.name}
                  />
                  <span className="content">
                    <span className="main-content">{selectedCoin.name}</span>
                    {selectedCoin.token_key}
                  </span>
                  <i className="fa-solid fa-caret-down"></i>
                </div>
                <div ref={dropdownCoinMenu} className="dropdown-menu">
                  {renderDropdownCoinMenu(coinDropdownData)}
                </div>
              </div>
            </li>
            <li>
              <span className="number">2</span>
              <div className="wallet-deposit-input">
                <p>{t("select")} Network</p>
                <div
                  onClick={showDropdownNetworkMenu}
                  ref={dropdownNetwork}
                  className="dropdown-content-selected"
                >
                  <span className="content">
                    <span className="main-content">{selectedNetwork.key}</span>
                    {selectedNetwork.decription}
                  </span>
                  <i className="fa-solid fa-caret-down"></i>
                </div>
                <div ref={dropdownNetworkMenu} className="dropdown-menu">
                  {renderDropdownNetworkMenu(networkDropdownData)}
                </div>
              </div>
            </li>
            <li>
              <span className="number">3</span>
              <div className="address">
                <p>
                  Desposite Address
                  <span>
                    <i className="fa-solid fa-pen-to-square"></i>
                  </span>
                </p>
                {callApiStatusAddress === api_status.fetching && (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Spin />
                  </div>
                )}
                {callApiStatusAddress !== api_status.fetching &&
                  addressCode && (
                    <>
                      <div className="address-content">
                        <div className={`fadeInBottomToTop`}>
                          <QRCode
                            style={{
                              height: "auto",
                              maxWidth: "100%",
                              width: "100%",
                            }}
                            value={addressCode}
                          />
                        </div>
                        <div className="address-code fadeInBottomToTop">
                          <div className="address-code-title">address</div>
                          <div ref={addressCodeElement} className="code">
                            {addressCode}
                          </div>
                        </div>
                        <span
                          onClick={copyAddressClickHandle}
                          className="address-copy fadeInBottomToTop"
                        >
                          <i className="fa-regular fa-copy"></i>
                        </span>
                      </div>
                    </>
                  )}
              </div>
            </li>
          </ul>
        </div>
        <div className="wallet-deposit-right">
          <h3>Desposite BTC history</h3>
          {callApiStatusHistory === api_status.fetching && (
            <div
              className="fadeInBottomToTop"
              style={{
                width: "100%",
                height: "100px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spin />
            </div>
          )}
          {callApiStatusHistory !== api_status.fetching &&
            !depositeHistory.length && <Empty />}
          {callApiStatusHistory !== api_status.fetching &&
            depositeHistory.length > 0 &&
            renderHistoryDeposit(depositeHistory)}
          <div className="wallet-deposite-paging">
            <Pagination defaultCurrent={1} total={10} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default SeresoWalletDeposit;
