import React from "react";
function Transaction() {
  return (
    <div className="transaction">
      <div className="container">
        <div className="box transaction__box transaction__header">
          <div>
            <span className="transaction--green">Buy</span> Tether USDT via Bank
            transfer (VND)
          </div>
        </div>
        <div className="box transaction__box">
          <form>
            <div className="transaction__input-container">
              <div className="transaction__input">
                <label htmlFor="amountInput">I will pay:</label>
                <input id="amountInputTransaction" type="text" />
                <span className="transaction__unit">VND</span>
                <span id="amountInputError" className="input__error"></span>
              </div>
              <div className="transaction__input">
                <label htmlFor="receiveInput">I will pay:</label>
                <input id="receiveInputTransaction" type="text" />
                <span className="transaction__unit">VND</span>
              </div>
            </div>
            <input id="agreeCheckBox" type="checkbox" className="--d-none" />
            <label className="transaction__checkbox" htmlFor="agreeCheckBox">
              <div className="transaction__checkbox-square">
                <i className="fa-solid fa-check"></i>
              </div>
              <div className="transaction__checkbox-text">
                By clicking Continue, you agree to Sereso's{" "}
                <sapn className="transaction--green-header">
                  P2P Terms of Service
                </sapn>
              </div>
            </label>
            <button>
              <div className="loader --d-none"></div>Buy now
            </button>
          </form>
        </div>
        <h3 className="transaction--bold">Advertisement informations</h3>
        <div className="box transaction__box">
          <div className="transaction__box-item">
            <span>Price:</span>
            <span>
              <span className="transaction__box-price">25,515.63</span> VND/USDT
            </span>
          </div>
          <div className="transaction__box-item amount">
            <span>Amount limits:</span>
            <span className="transaction__box-amount-container">
              <span className="transaction__box-amount">
                <span className="transaction--bold">4.95</span>USDT
              </span>{" "}
              <span className="transaction__box-amount-dash">-</span>{" "}
              <span className="transaction__box-amount">
                <span className="transaction--bold">439.08</span>USDT
              </span>
            </span>
          </div>
          <div className="transaction__box-item">
            <span>Method:</span>
            <span className="transaction--bold">Vietcombank</span>
          </div>
          <div className="transaction__box-item">
            <span>Payment window:</span>
            <span>15 minutes</span>
          </div>
        </div>
        <h3 className="transaction--bold">infomation about partners</h3>
        <div className="box transaction__box">
          <div className="transaction__box-item">
            <span>Username:</span>
            <span className="transaction--green">queencoin9999</span>
          </div>
          <div className="transaction__box-item">
            <span>Status:</span>
            <span>Online</span>
          </div>
          <div className="transaction__box-item">
            <span>Country:</span>
            <span>Việt Nam</span>
          </div>
          <div className="transaction__box-item">
            <span>Feedback score:</span>
            <span>😃 X978</span>
          </div>
          <div className="transaction__box-item">
            <span>KYC:</span>
            <span className="transaction__kyc">
              <span>
                <span>
                  <i className="fa-solid fa-check"></i>
                </span>{" "}
                Phone number verified
              </span>
              <span>
                <span>
                  <i className="fa-solid fa-check"></i>
                </span>{" "}
                Identity and Residence Proof verified
              </span>
              <span>
                <span>
                  <i className="fa-solid fa-check"></i>
                </span>{" "}
                Bank verified
              </span>
            </span>
          </div>
        </div>
        <div className="box transaction__box">
          <div className="transaction__chat-container">
            <div className="transaction__chat-icon">
              <i className="fa-solid fa-comments"></i>
            </div>
            <div className="transaction__chat">
              <div className="transaction__chat-header">Need more help?</div>
              <div className="transaction__chat-text">
                Contact Customer support via{" "}
                <span className="transaction--green">Online support.</span> We
                are always ready to help
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Transaction;
