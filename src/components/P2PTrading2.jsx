import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "antd";
import { t } from "i18next";
export default function P2PTrading2({ history }) {
  const { coin } = useSelector((root) => root.coinReducer);
  useEffect(() => {
    const element = document.querySelector(".p2ptrading2");
    element.classList.add("fadeInBottomToTop");
  }, []);
  return (
    <div className="p2ptrading2">
      <div className="container">
        <div className="buy">
          <div className="buy-title">
            <i className="fa-solid fa-flag"></i>
            <span>
              {t("youWantTo")} <span>{t("buy")}</span> {coin}?
            </span>
          </div>
          <div className="buy-content box">
            <div className="item1">
              <span>
                <span>1.3119</span> USD/USDT
              </span>
              <span>
                {t("maximum")}: {t("unlimited")}
              </span>
            </div>
            <div className="item2">Visa, Mastercard</div>
            <div className="item3">Simplex</div>
            <div className="item4">
              <Button type="primary">{t("buy")}</Button>
            </div>
          </div>
          <div className="buy-ad">
            <button
              onClick={() => history.push("/create-ads/buy")}
              type="primary"
              size="large"
              className="buyAdBtn"
            >
              {t("creatingYourBuyingAd")}
            </button>
          </div>
        </div>
        <div className="sell">
          <div className="sell-title">
            <i className="fa-solid fa-flag"></i>
            <span>
              {t("youWantTo")} <span>{t("sell")}</span> {coin}?
            </span>
          </div>
          <div className="sell-content box">
            <div className="item1">
              <span>
                <span>1.3119</span> USD/USDT
              </span>
              <span>{t("maximum") + ": " + t("unlimited")}</span>
            </div>
            <div className="item2">Westpac</div>
            <div className="item3">Felix500</div>
            <div className="item4">
              <Button type="primary">{t("sell")}</Button>
            </div>
          </div>
          <div className="sell-ad">
            <button
              onClick={() => history.push("/create-ads/sell")}
              type="primary"
              size="large"
              className="sellAdBtn"
            >
              {t("creatingYourSellingAd")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
