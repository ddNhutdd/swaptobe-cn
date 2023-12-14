import React from "react";
function Confirm() {
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
              <td className="confirm--green">JXEX1702459766</td>
            </tr>
            <tr>
              <td>Thương Nhân</td>
              <td>
                <div className="confirm__trander-container">
                  <div className="confirm__trader">
                    <span className="confirm--green">Hoang Long</span>
                    <div className="confirm__list-socials">
                      <i className="fa-brands fa-telegram"></i>
                      <i className="fa-solid fa-phone"></i>
                      <i>
                        <img
                          src={process.env.PUBLIC_URL + "/img/zalo.webp"}
                          alt="zalo"
                        />
                      </i>
                    </div>
                  </div>
                  <div className="confirm--red">
                    Vui lòng liên hệ ngay zalo, phone thương nhân hoặc chat
                    Messenger support ở góc phải nếu cần hỗ trợ
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>Địa chỉ ví</td>
              <td>
                <div className="confirm__address">
                  <span className="confirm--break confirm--red">
                    0xecBE1ef64D79EA93d22E4cd3DDe6d8ef2Dcf975D
                  </span>
                  <span className="confirm--blue">(Giao Thức: BEP20)</span>
                </div>
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
                  <button>
                    <div className="loader "></div>Mở màn hình thanh toán
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
              <td className="confirm--red">1100 USDT</td>
            </tr>
            <tr>
              <td>Tỉ giá</td>
              <td className="confirm--red">24,898.00 VND</td>
            </tr>
            <tr>
              <td>Số tiền</td>
              <td>
                <div className="confirm__money">
                  <span className="confirm--red">27,435,800 VND</span>
                  <span>
                    (Đã bao gồm phí giao dịch: 0 VNĐ và phí chuyển: 48,000 VNĐ)
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td>Đánh giá</td>
              <td>
                <div className="confirm__rating">
                  <input type="text" placeholder="Đánh giá" />
                  <button>
                    <div className="loader"></div>Gửi
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td>Thời gian</td>
              <td className="confirm--green confirm__time">
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
    </div>
  );
}
export default Confirm;
