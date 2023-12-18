/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { api_status, showAlertType } from "src/constant";
import { useParams } from "react-router-dom";
import { getInfoP2p } from "src/util/userCallApi";
import { showAlert } from "src/function/showAlert";
import { Modal } from "antd";
import { formatStringNumberCultureUS, getElementById } from "src/util/common";
function Confirm() {
  useEffect(() => {
    loadDataFirstLoading();
  }, []);
  const idAds = useParams().id;
  const callApiStatus = useRef(api_status.pending);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const bankName = useRef();
  const ownerAccount = useRef();
  const numberBank = useRef();
  const showModalPayment = () => {
    setIsModalOpen(true);
    setTimeout(() => {
      renderModalPayment();
    }, 0);
  };
  const renderModalPayment = function () {
    getElementById("bankNamePaymentModal").innerHTML = bankName.current;
    getElementById("accountPaymentModal").innerHTML = ownerAccount.current;
    getElementById("accountNumberPaymentModal").innerHTML = numberBank.current;
  };
  const handleCancelModalPayment = () => {
    setIsModalOpen(false);
  };
  const fetchApiGetInfoP2p = function () {
    return new Promise((resolve) => {
      if (callApiStatus.current === api_status.fetching) {
        return resolve(false);
      }
      getInfoP2p({
        idP2p: idAds,
      })
        .then((resp) => {
          callApiStatus.current = api_status.fulfilled;
          return resolve(resp.data.data);
        })
        .catch((error) => {
          callApiStatus.current = api_status.rejected;
          return resolve(false);
        });
    });
  };
  /**
   * fetch data and render html
   */
  const loadDataFirstLoading = async function () {
    const apiRes = await fetchApiGetInfoP2p();
    if (!apiRes) {
      showAlert(showAlertType.error, "Load data fail");
      return;
    }
    const {
      code,
      amount,
      symbol,
      rate,
      pay,
      created_at,
      bankName: bankN,
      ownerAccount: account,
      numberBank: numAcc,
    } = apiRes.at(0);
    console.log(typeof pay);
    getElementById("transactionCode").innerHTML = code;
    getElementById("youReceive").innerHTML = `${amount} ${symbol}`;
    getElementById("rate").innerHTML = rate;
    getElementById(
      "pay"
    ).innerHTML = `<span class="confirm--red">${formatStringNumberCultureUS(
      pay.toFixed(3)
    )} VND</span>
    <span>
      (Đã bao gồm phí giao dịch: 0 VNĐ và phí chuyển: 48,000 VNĐ)
    </span>`;
    const date = created_at.split("T");
    const time = date.at(-1).split(".");
    getElementById("createdAt").innerHTML = date.at(0) + " " + time.at(0);
    bankName.current = bankN;
    ownerAccount.current = account;
    numberBank.current = numAcc;
  };
  return (
    <div className="confirm">
      <div className="container">
        <table>
          <thead>
            <tr className="confirm__header">
              <td colSpan={2}>Giao dịch mua Tether (USDT)</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Mã GD</td>
              <td id="transactionCode" className="confirm--green">
                JXEX1702459766
              </td>
            </tr>
            <tr>
              <td>Trạng thái</td>
              <td>
                <div className="confirm__status">
                  <span>
                    <div className="confirm__status-text confirm--blue">
                      <div className="loader"></div>
                      Đang chờ thanh toán từ Ngân Hàng
                    </div>
                  </span>
                  <span className="confirm--red confirm__status-time">
                    00 : 04: 59{" "}
                    <span className="confirm__status-small">60</span>
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td>Thanh Toán</td>
              <td>
                <div className="confirm__payment">
                  <button onClick={showModalPayment}>
                    Mở màn hình thanh toán
                  </button>
                  <span className="confirm--green">
                    Bạn xác nhận đã chuyển khoản, vui lòng đợi chúng tôi kiểm
                    tra
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td>Bạn nhận</td>
              <td id="youReceive" className="confirm--red">
                1100 USDT
              </td>
            </tr>
            <tr>
              <td>Tỉ giá</td>
              <td id="rate" className="confirm--red">
                24,898.00 VND
              </td>
            </tr>
            <tr>
              <td>Số tiền</td>
              <td>
                <div id="pay" className="confirm__money">
                  <span className="confirm--red">27,435,800 VND</span>
                  <span>
                    (Đã bao gồm phí giao dịch: 0 VNĐ và phí chuyển: 48,000 VNĐ)
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td>Thời gian</td>
              <td id="createdAt" className="confirm--green confirm__time">
                13-12-2023 | 04:29
              </td>
            </tr>
            <tr>
              <td>Ghi chú</td>
              <td>
                <li>
                  Vui lòng thanh toán đúng thông tin tại màn hình thanh toán
                  trong thời gian quy định. Nếu bạn đã thanh toán có thể nhắn
                  tin cho người bán ngay để họ kiểm tra.
                </li>
                <li>
                  Chúng tôi chỉ mua bán tiền điện tử, không liên quan đến bất kì
                  dự án nào.
                </li>
                <li>
                  Khách hàng lưu ý chỉ giao dịch trên web. Các giao dịch bên
                  ngoài website chúng tôi không chịu trách nhiệm.
                </li>
                <li>
                  Nếu khách hàng thanh toán bị chậm, lỗi ngân hàng ... vui lòng
                  liên hệ người bán để được hỗ trợ
                </li>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Modal
        title="Payment Info"
        open={isModalOpen}
        onOk={handleCancelModalPayment}
        onCancel={handleCancelModalPayment}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <div className="paymentModalContent">
          <table className="paymentModalContent">
            <tbody>
              <tr>
                <td>Bank name: </td>
                <td id="bankNamePaymentModal">OCB</td>
              </tr>
              <tr>
                <td>Account: </td>
                <td id="accountPaymentModal">Van Den</td>
              </tr>
              <tr>
                <td>Accout Number: </td>
                <td id="accountNumberPaymentModal">789567456354</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
}
export default Confirm;
