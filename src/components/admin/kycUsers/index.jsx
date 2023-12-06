/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Pagination, Modal, Image } from "antd";
import { getKycUserPendding } from "src/util/adminCallApi";
import { api_status } from "src/constant";
import { DOMAIN } from "src/util/service";
import { zoomImage } from "src/util/common";
function KYC() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listKycUserData, setListKycUserData] = useState();
  const [listKycUserDataCurrentPage, setListKycUserDataCurrentPage] =
    useState(1);
  const [listKycUserDataTotalPage, setListKycUserDataTotalPage] = useState(1);
  const [callApiStatus, setCallApiStatus] = useState(api_status.pending);
  //
  useEffect(() => {
    // neus user chua dang nhap thi chuyen vef trang home
    //fetch kyc table
    fetchKYCTable();
    // render kyc table
    renderKYCTable();
  }, []);
  //
  const fetchKYCTable = function () {
    if (callApiStatus === api_status.fetching) return;
    else if (callApiStatus !== api_status.fetching)
      setCallApiStatus(api_status.fetching);
    getKycUserPendding({ limit: "10", page: listKycUserDataCurrentPage })
      .then((resp) => {
        setListKycUserData(resp.data.data.array);
        setListKycUserDataTotalPage(resp.data.data.total);
        setCallApiStatus(api_status.fulfilled);
      })
      .catch((error) => {
        setCallApiStatus(api_status.rejected);
        console.log(error);
      });
  };
  const renderKYCTable = function () {
    if (!listKycUserData || listKycUserData.length <= 0) return;
    return listKycUserData.map((item) => (
      <tr key={item.id}>
        <td>{item.id}</td>
        <td>{item.username}</td>
        <td>{item.email}</td>
        <td>{item.fullname}</td>
        <td>{item.phone}</td>
        <td>{item.passport}</td>
        <td>
          <div className="admin-kyc-users__status">Pending</div>
        </td>
        <td>
          <button
            onClick={() => {
              showModal(item);
            }}
            className="admin-kyc-users__check"
          >
            Check
          </button>
        </td>
      </tr>
    ));
  };
  const showModal = (data) => {
    setIsModalOpen(true);
    setTimeout(() => {
      setDataModal(data);
    }, 0);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const setDataModal = function (data) {
    if (!data) return;
    const userIDElement = document.getElementById("model_userID");
    const userNameElement = document.getElementById("modal_username");
    const emailElement = document.getElementById("modal_email");
    const fullnameElement = document.getElementById("modal_fullname");
    const phoneElement = document.getElementById("modal_phone");
    const passportElement = document.getElementById("modal_passport");
    const imageContainer = document.querySelector(
      ".admin-kyc-user__modal-image-container"
    );
    if (
      !userIDElement ||
      !userNameElement ||
      !emailElement ||
      !fullnameElement ||
      !phoneElement ||
      !passportElement ||
      !imageContainer
    )
      return;
    const { id, username, email, fullname, phone, passport } = data;
    userIDElement.innerHTML = id;
    userNameElement.innerHTML = username;
    emailElement.innerHTML = email;
    fullnameElement.innerHTML = fullname;
    phoneElement.innerHTML = phone;
    passportElement.innerHTML = passport;
    const listImage = JSON.parse(data.verified_images);
    imageContainer.innerHTML = "";
    for (let i = 0; i <= 2; i++) {
      var imgElement = document.createElement("img");
      imgElement.src = DOMAIN + listImage[i];
      imgElement.alt = listImage[i];
      imgElement.addEventListener("click", (e) => {
        zoomImage(e);
      });
      imageContainer.appendChild(imgElement);
    }
  };

  return (
    <div className="admin-kyc-users">
      <div className="admin-kyc-users__header">
        <h3 className="admin-kyc-users__title">All users</h3>
        <form className="admin-kyc-users__search-form">
          <input
            placeholder="Search"
            className="admin-kyc-users__search-input"
            type="text"
          />
          <button type="submit" className="admin-kyc-users__search-button">
            search
          </button>
        </form>
        <div className="admin-kyc-users__paging">
          <Pagination
            defaultCurrent={1}
            pageSize={10}
            total={listKycUserDataTotalPage}
            showSizeChanger={false}
          />
        </div>
      </div>
      <div className="admin-kyc-users__content">
        <table>
          <thead>
            <tr>
              <th>UserID</th>
              <th>UserName</th>
              <th>Email</th>
              <th>Fullname</th>
              <th>Phone</th>
              <th>Passport</th>
              <th>status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{renderKYCTable()}</tbody>
        </table>
      </div>
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        title={false}
        footer={false}
        className="admin-kyc-users__modal"
        style={{ background: "transparent" }}
      >
        <div className="admin-kyc-users__modal-container">
          <div className="admin-kyc-users__modal-left">
            <div className="admin-kyc-users__modal-item">
              <div className="admin-kyc-users__modal-item-header">UserID</div>
              <div
                id="model_userID"
                className="admin-kyc-users__modal-item-content"
              >
                12
              </div>
            </div>
            <div className="admin-kyc-users__modal-item">
              <div className="admin-kyc-users__modal-item-header">UserName</div>
              <div
                id="modal_username"
                className="admin-kyc-users__modal-item-content"
              >
                John Doe
              </div>
            </div>
            <div className="admin-kyc-users__modal-item">
              <div className="admin-kyc-users__modal-item-header">Email</div>
              <div
                id="modal_email"
                className="admin-kyc-users__modal-item-content"
              >
                Developer@eva.cc
              </div>
            </div>
            <div className="admin-kyc-users__modal-item">
              <div className="admin-kyc-users__modal-item-header">Fullname</div>
              <div
                id="modal_fullname"
                className="admin-kyc-users__modal-item-content"
              >
                hcmewk
              </div>
            </div>
          </div>
          <div className="admin-kyc-user__modal-right">
            <div className="admin-kyc-users__modal-item">
              <div className="admin-kyc-users__modal-item-header">Phone</div>
              <div
                id="modal_phone"
                className="admin-kyc-users__modal-item-content"
              >
                12
              </div>
            </div>
            <div className="admin-kyc-users__modal-item">
              <div className="admin-kyc-users__modal-item-header">Passport</div>
              <div
                id="modal_passport"
                className="admin-kyc-users__modal-item-content"
              >
                12
              </div>
            </div>
            <div className="admin-kyc-users__modal-item">
              <div className="admin-kyc-users__modal-item-header">Status</div>
              <div className="admin-kyc-users__modal-item-content">12</div>
            </div>
            <div className="admin-kyc-users__modal-left-item"></div>
          </div>
          <div className="admin-kyc-user__modal-image-container"></div>
          <div className="admin-kyc-users__modal-control">
            <button className="admin-kyc-users__modal-confirm confirm">
              confirm
            </button>
            <button className="admin-kyc-users__modal-reject">reject</button>
            <button
              onClick={handleCancel}
              className="admin-kyc-users__modal-close"
            >
              close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
export default KYC;
