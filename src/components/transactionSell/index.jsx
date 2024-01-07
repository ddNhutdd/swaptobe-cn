/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Spin } from "antd";
import { Input } from "../Common/Input";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { url } from "src/constant";
function TransactionSell() {
  const isLogin = useSelector((state) => state.loginReducer.isLogin);
  const history = useHistory();

  useEffect(() => {}, []);
  return (
    <div className={`transaction`}>
      <div className="container">
        <div className="box transaction__box transaction__header">
          <div></div>
        </div>
        <div className="box transaction__box ">
          <div className="transaction__user-dropdown">
            <label>Trader:</label>
            <div className="transaction__user-selected">
              <span>fdsafdsafdsa</span>
              <span>
                <i className="fa-solid fa-caret-down"></i>
              </span>
            </div>
            <div className={`transaction__user-menu`}>
              <div className="dropdown-menu ">
                <div className={`spin-container`}>
                  <Spin />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="box transaction__box">
          <form>
            <div className={`transaction__input-container`}>
              <div className="transaction__input">
                <label htmlFor="amountInput">I will pay:</label>
                <Input type="text" />
                <span className="transaction__unit">VND</span>
              </div>
              <div className="transaction__input">
                <label htmlFor="receiveInput">to receive:</label>
                <Input
                  disabled
                  type="text"
                  className="transaction__input-result"
                />
                <span
                  id="receiveUnitTransaction"
                  className="transaction__unit result"
                >
                  USDT
                </span>
              </div>
            </div>
            <div className={`transaction__input-container`}>
              <div className="transaction__input">
                <label>I pay:</label>
                <Input type="text" />
                <span className="transaction__unit">symbol</span>
              </div>
              <div className="transaction__input">
                <label>toReceive:</label>
                <Input disabled type="text" />
                <span className="transaction__unit">VND</span>
              </div>
            </div>
            <div className="transaction__dropdown">
              <label htmlFor="amountInput">chooseYourPayment:</label>
              <div className="transaction__payment-dropdown">
                <div className="transaction__payment-dropdown-text">
                  Vietcombank (Nguyen Trung Hieu: 08370383231)
                </div>
                <span>
                  <i className="fa-solid fa-caret-down"></i>
                </span>
              </div>
              <div
                id="paymentDropdownMenu"
                className="transaction__payment-dropdown-menu-container"
              >
                <div id="paymentDropdownMenuContent" className="dropdown-menu">
                  <div className="dropdown-item">name</div>
                </div>
              </div>
            </div>
            <input id="agreeCheckBox" type="checkbox" className="--d-none" />
            <label className="transaction__checkbox" htmlFor="agreeCheckBox">
              <div className="transaction__checkbox-square">
                <i className="fa-solid fa-check"></i>
              </div>
              <div className="transaction__checkbox-text">
                byClickingContinueYouAgreeToSerepays
                <span className="transaction--green-header">
                  p2PTermsOfService
                </span>
              </div>
            </label>
            <button type="submit">
              <div className="loader --d-none"></div>
            </button>
          </form>
        </div>
        <h3 className="transaction__title transaction--bold">fdsafdsfd</h3>
        <div className="box transaction__box">
          <div className="transaction__box-item">
            <span>Price:</span>
            <span></span>
          </div>
          <div className="transaction__box-item amount">
            <span>amountLimits:</span>
            <span className="transaction__box-amount-container">
              <span
                id="transactionAmountMini"
                className="transaction__box-amount"
              ></span>{" "}
              <span className="transaction__box-amount-dash">-</span>{" "}
              <span
                id="transactionAmount"
                className="transaction__box-amount"
              ></span>
            </span>
          </div>
          <div className="transaction__box-item">
            <span>available:</span>
            <span className="transaction--bold">Vietcombank</span>
          </div>
          <div className="transaction__box-item">
            <span>method:</span>
            <span className="transaction--bold">Vietcombank</span>
          </div>
          <div className="transaction__box-item">
            <span>paymentWindow:</span>
            <span>15 minutes</span>
          </div>
        </div>
        <div className="box transaction__box">
          <div className="transaction__chat-container">
            <div className="transaction__chat-icon">
              <i className="fa-solid fa-comments"></i>
            </div>
            <div className="transaction__chat">
              <div className="transaction__chat-header">needMoreHelp?</div>
              <div className="transaction__chat-text">
                contactCustomerSupportVia
                <span className="transaction__chat-support">
                  onlineSupport.
                </span>{" "}
                weAreAlwaysReadyToHelp
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="spin-container">
        <Spin />
      </div>
    </div>
  );
}
export default TransactionSell;
