/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Modal } from "antd";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { getCurrent, getExchange } from "src/redux/constant/currency.constant";
import { getListCoinRealTime } from "src/redux/constant/listCoinRealTime.constant";
import { formatStringNumberCultureUS, getElementById } from "src/util/common";
import { DOMAIN } from "src/util/service";
export default function CreateBuy({ history }) {
  const data = useRef([]);
  const [currentCoin, setCurrentCoin] = useState("BTC");
  const [isModalCoinVisible, setIsModalCoinVisible] = useState(false);
  const [isModalPreviewOpen, setIsModalPreviewOpen] = useState(false);
  const listCoinRealTime = useSelector(getListCoinRealTime);
  const showCoinModal = () => setIsModalCoinVisible(true);
  const modalCoinHandleOk = () => setIsModalCoinVisible(false);
  const modalCoinHandleCancel = () => setIsModalCoinVisible(false);
  const showModalPreview = () => {
    setIsModalPreviewOpen(true);
  };
  const modalPreviewHandleOk = () => {
    setIsModalPreviewOpen(false);
  };
  const modalPreviewHandleCancel = () => {
    setIsModalPreviewOpen(false);
  };
  const currentCurrency = useSelector(getCurrent);
  const exchage = useSelector(getExchange);
  useEffect(() => {
    data.current = listCoinRealTime ?? [];
    renderMarketBuyPrice();
  }, [listCoinRealTime]);
  //
  const renderMarketBuyPrice = function () {
    if (data.length <= 0 || exchage.length <= 0) return;
    // find current price
    let ccCoin = data.current.filter((item) => item.name === currentCoin)[0]
      ?.price;
    if (!ccCoin) return;
    // process price
    const rate = exchage.filter((item) => item.title === currentCurrency)[0]
      ?.rate;
    ccCoin *= rate;
    // set html
    getElementById("marketBuyPrice").innerHTML =
      formatStringNumberCultureUS(String(ccCoin)) + " " + currentCurrency;
  };
  //
  return (
    <div className="create-buy-ads">
      <div className="container">
        <div className="box">
          <h2 className="title">Create new buying advertisement</h2>
          <span
            className="switch"
            onClick={() => history.replace("/create-ads/sell")}
          >
            Do you want to sell?
          </span>
          <div className="head-area">
            <h2>Ads to buy {currentCoin}</h2>
            <div>
              Market buy price:{" "}
              <span
                id="marketBuyPrice"
                className="create-buy-ads__head-area-price"
              >
                ---
              </span>
            </div>
            <i
              className="fa-solid fa-pen-to-square"
              onClick={showCoinModal}
            ></i>
          </div>
          <div className="amount-area">
            <h2>Amount</h2>
            <div className="field">
              <label>Amount of {currentCoin}:</label>
              <input key={"a1va"} />
            </div>
            <div className="field">
              <label>Minimum {currentCoin} amount:</label>
              <input key={"a2va"} />
            </div>
          </div>
          <div className="payment-area">
            <h2>Payment details</h2>
            <div className="field">
              <label>Payment method:</label>
            </div>
            <div className="field">
              <label>Bank name:</label>
              <div
                id="dropdownBankSelected"
                className="field__dropdown-selected"
              >
                <span>
                  <img
                    src={process.env.PUBLIC_URL + "/img/iconen.png"}
                    alt={"currentLanguage"}
                  />
                </span>
                <span>thien</span>
                <span>an</span>
                <span>
                  <i className="fa-solid fa-chevron-down"></i>
                </span>
              </div>
            </div>
          </div>
          <div className="review-area">
            <span onClick={showModalPreview}>
              <i className="fa-solid fa-eye"></i>
              <span>Review your ad</span>
            </span>
          </div>
          <div className="button-area">
            <Button>Cancel</Button>
            <button className="button-area-primary">
              Create new advertisement
            </button>
          </div>
        </div>
      </div>
      <Modal
        title="Choose your coin"
        visible={isModalCoinVisible}
        onOk={modalCoinHandleOk}
        onCancel={modalCoinHandleCancel}
        footer={null}
        width={400}
      >
        <div className="create-buy-ads__modal-coin" style={{ padding: 20 }}>
          {data.current.map((item, i) => {
            return (
              <Button
                className="btn-choice-coin"
                type={item.name === currentCoin ? "primary" : "default"}
                key={i}
                onClick={() => {
                  setCurrentCoin(item.name);
                  setIsModalCoinVisible(false);
                }}
              >
                <img
                  className="create-buy-ads__modal-image"
                  src={DOMAIN + item.image}
                  alt={item.image}
                />
                {item.name}
              </Button>
            );
          })}
        </div>
      </Modal>
      <Modal
        // title="Preview"
        open={isModalPreviewOpen}
        onOk={modalPreviewHandleOk}
        onCancel={modalPreviewHandleCancel}
        footer={null}
      >
        <div className="create-buy-ads__modal-preview-content">
          fdafdsafdsafdafdasfdsafd fdsafhdsjlkafhdsjalfd
        </div>
      </Modal>
    </div>
  );
}
