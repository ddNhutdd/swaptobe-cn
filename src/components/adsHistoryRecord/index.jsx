import { Spin } from "antd";
import React, { useEffect } from "react";
import css from "./adsHistoryRecord.module.scss";
import {
  currencyMapper,
  defaultLanguage,
  image_domain,
  localStorageVariable,
} from "src/constant";
import { useTranslation } from "react-i18next";
import i18n from "src/translation/i18n";
import { getLocalStorage, roundIntl, rountRange } from "src/util/common";
import { Button, buttonClassesType } from "../Common/Button";

export const AdsHistoryRecordType = {
  admin: "admin",
  user: "user",
};
function AdsHistoryRecord(props) {
  const {
    item,
    price,
    type = "",
    redirectConfirm = function () {},
    showModal = function () {},
    cancelAdsId = function () {},
  } = props;
  const { t } = useTranslation();

  const renderActionByUser = function () {
    return type === AdsHistoryRecordType.user ? "" : "--d-none";
  };

  const renderActionByAdmin = function () {
    return type === AdsHistoryRecordType.admin ? "" : "--d-none";
  };

  useEffect(() => {
    const language =
      getLocalStorage(localStorageVariable.lng) || defaultLanguage;
    i18n.changeLanguage(language);
  }, []);

  return (
    <div
      key={item.id}
      className={`box fadeInBottomToTop ${css["ads-history__record"]}`}
    >
      <div>
        <table>
          <tbody>
            <tr>
              <td>{t("amount")}:</td>
              <td>{item.amount}</td>
            </tr>
            <tr>
              <td>{t("amountMinimum")}:</td>
              <td>{item.amountMinimum}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <table>
          <tbody>
            <tr>
              <td>Quantity Remaining:</td>
              <td>
                {new Intl.NumberFormat(
                  currencyMapper.USD,
                  roundIntl(rountRange(price))
                ).format(item.amount - item.amountSuccess)}
              </td>
            </tr>
            <tr>
              <td className={css["logo-coin"]}>
                <img
                  src={image_domain.replace("USDT", item.symbol.toUpperCase())}
                  alt={item.symbol}
                />
                :{" "}
              </td>
              <td>
                <span>{item.symbol}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <table>
          <tbody>
            <tr>
              <td>{t("createdAt")}:</td>
              <td>{item.created_at}</td>
            </tr>
            <tr>
              <td
                className={`${
                  css["ads-history-action"]
                } + ${" "} + ${renderActionByUser()}`}
                id={"adsHistoryAction" + item.id}
                colSpan="2"
              >
                <div
                  className="spin-container"
                  id={"adsHistoryActionSpinner" + item.id}
                >
                  <Spin />
                </div>
                <div className={css["ads-history-action-container"]}>
                  <Button
                    type={buttonClassesType.primary}
                    className="--d-none"
                    id={"adsHistoryActionCheckButton" + item.id}
                    onClick={redirectConfirm.bind(null, item.id)}
                  >
                    Check
                  </Button>
                  <Button
                    type={buttonClassesType.outline}
                    className={`${
                      item.type === 1 || item.type === 2 ? "" : "--d-none"
                    }`}
                    onClick={() => {
                      cancelAdsId.current = item.id;
                      showModal();
                    }}
                    id={"adsHistoryActionCancelButton" + item.id}
                  >
                    {t("cancel")}
                  </Button>
                </div>
              </td>
              <td
                className={`${
                  css["ads-history-action"]
                } + ${" "} + ${renderActionByAdmin()}`}
                colSpan="2"
              >
                <Button>Admin</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdsHistoryRecord;
