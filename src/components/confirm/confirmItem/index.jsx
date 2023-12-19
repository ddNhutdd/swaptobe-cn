/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Spin } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { api_status, showAlertType, url } from "src/constant";
import { showToast } from "src/function/showToast";
import {
  formatStringNumberCultureUS,
  getElementById,
  hideElement,
  showElement,
} from "src/util/common";
import {
  companyCancelP2pCommand,
  companyConfirmP2pCommand,
  userCancelP2pCommand,
  userConfirmP2pCommand,
} from "src/util/userCallApi";
function ConfirmItem(props) {
  const { index, content, profileId, render } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const history = useHistory();
  const callApiStatus = useRef(api_status.pending);
  const bankName = useRef();
  const ownerAccount = useRef();
  const numberBank = useRef();
  const idCommand = useRef();
  useEffect(() => {
    loadData();
  }, [content]);
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
  const closeTable = function () {
    hideElement(getElementById("confirm__table"));
  };
  const showTable = function () {
    showElement(getElementById("confirm__table"));
  };
  const closeSpinner = function () {
    hideElement(getElementById("confirm__spinner" + index));
  };
  const showSpinner = function () {
    showElement(getElementById("confirm__spinner" + index));
  };
  const fetchApiUserConfirm = function () {
    return new Promise((resolve) => {
      if (callApiStatus.current === api_status.fetching) {
        return resolve(false);
      }
      callApiStatus.current = api_status.fetching;
      userConfirmP2pCommand({
        idP2p: idCommand.current,
      })
        .then((resp) => {
          callApiStatus.current = api_status.fulfilled;
          showToast(showAlertType.success, "Confirm Success");
          return resolve(true);
        })
        .catch((error) => {
          callApiStatus.current = api_status.rejected;
          console.log(error);
          return resolve(false);
        });
    });
  };
  const userConfirmClickHandle = async function () {
    apiFetchingUI();
    const apiRes = await fetchApiUserConfirm();
    if (apiRes) {
      render((state) => state + 1);
    }
    apiNoFetchingUI();
  };
  const fetchApiUserCancel = function () {
    return new Promise((resolve) => {
      if (callApiStatus.current === api_status.fetching) {
        return resolve(false);
      }
      callApiStatus.current = api_status.fetching;
      userCancelP2pCommand({
        idP2p: idCommand.current,
      })
        .then((resp) => {
          callApiStatus.current = api_status.fulfilled;
          showToast(showAlertType.success, "Cancel Success");
          return resolve(true);
        })
        .catch((error) => {
          console.log(error);
          return resolve(null);
        });
    });
  };
  const userCancelClickHandle = async function () {
    apiFetchingUI();
    const apiRes = await fetchApiUserCancel();
    if (apiRes) {
      history.push(url.p2pTrading);
    }
    apiNoFetchingUI();
  };
  const apiFetchingUI = function () {
    closeTable();
    showSpinner();
  };
  const apiNoFetchingUI = function () {
    closeSpinner();
    showTable();
  };
  const fetchApiCompanyCancel = function () {
    return new Promise((resolve) => {
      if (callApiStatus.current === api_status.fetching) {
        return resolve(false);
      }
      callApiStatus.current = api_status.fetching;
      companyCancelP2pCommand({ idP2p: idCommand.current })
        .then((resp) => {
          callApiStatus.current = api_status.fulfilled;
          console.log(resp);
          showToast(showAlertType.success, "Cancel Success");
          return resolve(true);
        })
        .catch((error) => {
          callApiStatus.current = api_status.rejected;
          console.log(error);
          return resolve(false);
        });
    });
  };
  const fetchApiCompanyConfirm = function () {
    return new Promise((resolve) => {
      if (callApiStatus.current === api_status.fetching) {
        return resolve(false);
      }
      callApiStatus.current = api_status.fetching;
      companyConfirmP2pCommand({
        idP2p: idCommand.current,
      })
        .then((resp) => {
          callApiStatus.current = api_status.fulfilled;
          console.log(resp);
          showToast(showAlertType.success, "Confirm Success");
          return resolve(true);
        })
        .catch((error) => {
          callApiStatus.current = api_status.rejected;
          console.log(error);
          return resolve(false);
        });
    });
  };
  const companyConfirmHandleClick = async function () {
    apiFetchingUI();
    const apiRes = await fetchApiCompanyConfirm();
    if (apiRes) {
      render((state) => state + 1);
    }
    apiNoFetchingUI();
  };
  const companyCancelClickHandle = async function () {
    apiFetchingUI();
    const apiResp = await fetchApiCompanyCancel();
    if (apiResp) {
      render((state) => state + 1);
    }
    apiNoFetchingUI();
  };
  const loadData = function () {
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
      typeUser,
      userid: userId,
      id: idC,
    } = content;
    idCommand.current = idC;
    getElementById("transactionCode" + index).innerHTML = code;
    getElementById("youReceive" + index).innerHTML = `${amount} ${symbol}`;
    getElementById("rate" + index).innerHTML = rate;
    getElementById(
      "pay" + index
    ).innerHTML = `<span class="confirm--red">${formatStringNumberCultureUS(
      pay.toFixed(3)
    )} VND</span>
      <span>
        (Đã bao gồm phí giao dịch: 0 VNĐ và phí chuyển: 48,000 VNĐ)
      </span>`;
    const date = created_at.split("T");
    const time = date.at(-1).split(".");
    getElementById("createdAt" + index).innerHTML =
      date.at(0) + " " + time.at(0);
    bankName.current = bankN;
    ownerAccount.current = account;
    numberBank.current = numAcc;
    //
    const actionContainer = getElementById("actionConfirm" + index);
    actionContainer.innerHTML = "";
    if (typeUser === 2 && userId === profileId) {
      // confirm button
      const confirmButton = document.createElement("button");
      confirmButton.innerHTML = "Xác nhận đã chuyển tiền";
      confirmButton.className = "confirm__action-main";
      confirmButton.addEventListener("click", userConfirmClickHandle);
      actionContainer.appendChild(confirmButton);
      // cancel button
      const cancelButton = document.createElement("button");
      cancelButton.innerHTML = "Nút huỷ lệnh";
      cancelButton.className = "confirm__action-danger";
      cancelButton.addEventListener("click", userCancelClickHandle);
      actionContainer.appendChild(cancelButton);
    } else if (typeUser === 2 && userId !== profileId) {
      actionContainer.innerHTML = `<button class='confirm__action-main disable'>Đang chờ đối phương chuyển tiền</button>`;
    } else if (typeUser === 1 && userId === profileId) {
      actionContainer.innerHTML = `<button class='confirm__action-main disable'>Đang chờ đối phương xác nhận</>`;
    } else if (typeUser === 1 && userId !== profileId) {
      // receivedButton
      const receivedButton = document.createElement("button");
      receivedButton.innerHTML = `Đã nhận được tiền`;
      receivedButton.className = `confirm__action-main`;
      receivedButton.addEventListener("click", companyConfirmHandleClick);
      actionContainer.appendChild(receivedButton);
      //not recieved button
      const notRecievedButton = document.createElement("button");
      notRecievedButton.innerHTML = `Chưa nhận được tiền`;
      notRecievedButton.className = `confirm__action-danger`;
      notRecievedButton.addEventListener("click", companyCancelClickHandle);
      actionContainer.appendChild(notRecievedButton);
    }
  };
  return (
    <>
      <div className="confirm">
        <div className="container">
          <table id="confirm__table">
            <thead>
              <tr className="confirm__header">
                <td colSpan={2}>Giao dịch mua Tether (USDT)</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mã GD</td>
                <td id={`transactionCode` + index} className="confirm--green">
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
                <td id={"youReceive" + index} className="confirm--red">
                  1100 USDT
                </td>
              </tr>
              <tr>
                <td>Tỉ giá</td>
                <td id={"rate" + index} className="confirm--red">
                  24,898.00 VND
                </td>
              </tr>
              <tr>
                <td>Số tiền</td>
                <td>
                  <div id={"pay" + index} className="confirm__money">
                    <span className="confirm--red">27,435,800 VND</span>
                    <span>
                      (Đã bao gồm phí giao dịch: 0 VNĐ và phí chuyển: 48,000
                      VNĐ)
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Thời gian</td>
                <td
                  id={"createdAt" + index}
                  className="confirm--green confirm__time"
                >
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
                    Chúng tôi chỉ mua bán tiền điện tử, không liên quan đến bất
                    kì dự án nào.
                  </li>
                  <li>
                    Khách hàng lưu ý chỉ giao dịch trên web. Các giao dịch bên
                    ngoài website chúng tôi không chịu trách nhiệm.
                  </li>
                  <li>
                    Nếu khách hàng thanh toán bị chậm, lỗi ngân hàng ... vui
                    lòng liên hệ người bán để được hỗ trợ
                  </li>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <div
                    className="confirm__action"
                    id={"actionConfirm" + index}
                  ></div>
                </td>
              </tr>
            </tbody>
          </table>
          <div
            id={"confirm__spinner" + index}
            className="spin-container --d-none"
          >
            <Spin />
          </div>
        </div>
        <Modal
          title="Payment Info"
          open={isModalOpen}
          onOk={handleCancelModalPayment}
          onCancel={handleCancelModalPayment}
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
    </>
  );
}
export default ConfirmItem;
