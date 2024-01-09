/* eslint-disable react-hooks/exhaustive-deps */
import { Spin } from "antd";
import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { EmptyCustom } from "src/components/Common/Empty";
import { api_status } from "src/constant";
import { callToastError, callToastSuccess } from "src/function/toast/callToast";
import { currencySetFetchExchangeCount } from "src/redux/actions/currency.action";
import {
  getExchange,
  getExchangeFetchStatus,
} from "src/redux/constant/currency.constant";
import { addExchange, editExchange } from "src/util/adminCallApi";
import {
  addClassToElementById,
  getClassListFromElementById,
  getElementById,
  hideElement,
  showElement,
} from "src/util/common";
function Exchange() {
  const dispatch = useDispatch();
  const exchanges = useSelector(getExchange);
  const exchangesFetchStatus = useSelector(getExchangeFetchStatus);
  const callApiStatus = useRef(api_status.pending);
  useEffect(() => {
    return () => {
      dispatch(currencySetFetchExchangeCount());
    };
  }, []);
  useEffect(() => {
    renderTable();
  }, [exchangesFetchStatus]);
  const renderTable = function () {
    closeExchangeContent();
    closeExchangeEmpty();
    closeExchangeSpinner();
    const container = getElementById("adminExchangeContent");
    container.innerHTML = "";
    if (exchangesFetchStatus === api_status.fetching) {
      showExchangeSpinner();
    } else if (!exchanges || exchanges.length <= 0) {
      showExchangeEmpty();
    } else {
      showExchangeContent();
      for (const item of exchanges) {
        container.insertAdjacentHTML(
          "afterbegin",
          `<tr><td class='--d-none'><span>${item.id}</span></td>
        <td><span>${item.title}</span><input class='--d-none' id='title-${
            item.id
          }' type='text' /></td>
        <td><span>${item.rate}</span><input class='--d-none' id='rate-${
            item.id
          }' type='text' /></td>
        <td> <div class='exchange__action'> <button id='saveRecord-${
          item.id
        }' class='--d-none'><div class="loader --d-none"></div>Save</button>${" "}<button id='cancelRecord-${
            item.id
          }' class='--d-none'>Cancel</button></div></td>
      </tr>`
        );
      }
      // add event
      for (const item of container.children) {
        // click tr
        item.addEventListener("click", tableRecordClickHandle.bind(null, item));
        // button
        const buttons = item.querySelectorAll("button");
        for (const button of buttons) {
          const id = button.id.split("-").at(-1);
          const type = button.id.split("-").at(0);
          if (type === "saveRecord") {
            button.addEventListener(
              "click",
              saveRecordClickHandle.bind(null, id)
            );
          } else if (type === "cancelRecord") {
            button.addEventListener("click", cancelRecordClickHandle);
          }
        }
      }
    }
  };
  const cancelRecordClickHandle = function (e) {
    e.stopPropagation();
    const id = e.target.id.split("-").at(-1);
    const idButtonCancel = "cancelRecord-" + id;
    if (getElementById(idButtonCancel).classList.contains("disabled")) {
      return;
    }
    cancelEdit(id);
  };
  const cancelEdit = function (id) {
    const inputRate = getElementById("rate-" + id);
    const inputTitle = getElementById("title-" + id);
    inputRate.value = "";
    inputTitle.value = "";
    hideElement(inputRate);
    hideElement(inputTitle);
    hideElement(getElementById("cancelRecord-" + id));
    hideElement(getElementById("saveRecord-" + id));
    const spans = inputRate.closest("tr").querySelectorAll("span");
    for (const item of spans) {
      showElement(item);
    }
  };
  const saveRecordClickHandle = async function (id) {
    const idButtonSave = "saveRecord-" + id;
    if (getElementById(idButtonSave).classList.contains("disabled")) {
      return;
    }
    const title = getElementById("title-" + id).value;
    const rate = getElementById("rate-" + id).value;
    disableAllButtonTable();
    showLoaderForButtonTable(idButtonSave);
    const resp = await fetchEditExchange({
      title,
      rate,
      id,
    });
    enableAllButtonTable();
    hideLoaderForButtonTable(idButtonSave);
    //update table
    if (resp) {
      const trEle = getElementById(idButtonSave).closest("tr");
      const spansEle = Array.from(trEle.querySelectorAll("span"));
      spansEle.at(1).innerHTML = title;
      spansEle.at(2).innerHTML = rate;
    }
    //
    cancelEdit(id);
  };
  const showLoaderForButtonTable = function (id) {
    const claList = getElementById(id).querySelector(".loader").classList;
    if (claList.contains("--d-none")) claList.remove("--d-none");
  };
  const hideLoaderForButtonTable = function (id) {
    const claList = getElementById(id).querySelector(".loader").classList;
    if (!claList.contains("--d-none")) claList.add("--d-none");
  };
  const disableAllButtonTable = function () {
    const container = getElementById("adminExchangeContent");
    const buttons = container.querySelectorAll("button");
    for (const button of buttons) {
      const claList = button.classList;
      if (!claList.contains("disable")) claList.add("disabled");
    }
  };
  const enableAllButtonTable = function () {
    const container = getElementById("adminExchangeContent");
    const buttons = container.querySelectorAll("button");
    for (const button of buttons) {
      const claList = button.classList;
      if (claList.contains("disabled")) claList.remove("disabled");
    }
  };
  const tableRecordClickHandle = function (record) {
    const showInput = function (input, value) {
      input.value = value;
      input.classList.remove("--d-none");
    };
    const elementClick = record.closest("tr");
    const tds = Array.from(elementClick.querySelectorAll("span"));
    hideElement(tds.at(1));
    hideElement(tds.at(2));
    const [id, title, rate] = tds.map((item) => item.innerHTML);
    showInput(getElementById("title-" + id), title);
    showInput(getElementById("rate-" + id), rate);
    showElement(getElementById("saveRecord-" + id));
    showElement(getElementById("cancelRecord-" + id));
  };
  const showExchangeContent = function () {
    getClassListFromElementById("adminExchangeContent").remove("--d-none");
  };
  const closeExchangeContent = function () {
    addClassToElementById("adminExchangeContent", "--d-none");
  };
  const showExchangeSpinner = function () {
    getClassListFromElementById("adminExchangeSpinner").remove("--d-none");
  };
  const closeExchangeSpinner = function () {
    addClassToElementById("adminExchangeSpinner", "--d-none");
  };
  const showExchangeEmpty = function () {
    getClassListFromElementById("adminExchangeEmpty").remove("--d-none");
  };
  const closeExchangeEmpty = function () {
    addClassToElementById("adminExchangeEmpty", "--d-none");
  };
  const fetchEditExchange = function (data) {
    return new Promise((resolve) => {
      if (callApiStatus.current === api_status.fetching) {
        return resolve(false);
      }
      callApiStatus.current = api_status.fetching;
      editExchange(data)
        .then(() => {
          callApiStatus.current = api_status.fulfilled;
          callToastSuccess("Success");
          return resolve(true);
        })
        .catch((error) => {
          const mes = error;
          switch (mes) {
            case "value":
              break;
            default:
              callToastError("Fail");
              break;
          }
          callApiStatus.current = api_status.rejected;
          return resolve(false);
        });
    });
  };
  const fetchAddExchange = function (data) {
    return new Promise((resolve) => {
      if (callApiStatus.current === api_status.fetching) {
        return resolve(false);
      }
      callApiStatus.current = api_status.fetching;
      addExchange(data)
        .then((resp) => {
          callApiStatus.current = api_status.fulfilled;
          callToastSuccess("Success");
          dispatch(currencySetFetchExchangeCount());
          return resolve(true);
        })
        .catch((error) => {
          const mes = error;
          switch (mes) {
            case "value":
              break;
            default:
              callToastError("Fail");
              break;
          }
          callApiStatus.current = api_status.rejected;
          return resolve(false);
        });
    });
  };
  const addExchangeButtonClickHandle = async function (e) {
    if (e.target.classList.contains("disabled")) return;
    disableButtonAddExchange();
    disableAllButtonTable();
    await fetchAddExchange({ title: "Null", rate: "0" });
    enableButtonAddExchange();
    enableAllButtonTable();
  };
  /**
   * disable and show loader
   */
  const disableButtonAddExchange = function () {
    const btn = getElementById("addExchangeButton");
    const clsList = btn.classList;
    !clsList.contains("disabled") && clsList.add("disabled");
    const loader = btn.querySelector(".loader");
    showElement(loader);
  };
  const enableButtonAddExchange = function () {
    const btn = getElementById("addExchangeButton");
    const clsList = btn.classList;
    clsList.contains("disabled") && clsList.remove("disabled");
    const loader = btn.querySelector(".loader");
    hideElement(loader);
  };
  return (
    <div className="admin-exchange">
      <div className="admin-exchange__header">
        <div className="admin-exchange__title">Exchange</div>
        <div>
          <button
            onClick={addExchangeButtonClickHandle}
            id="addExchangeButton"
            className="admin-exchange__create-button"
          >
            <div className="loader --d-none"></div>Create
          </button>
        </div>
      </div>
      <div className="admin-exchange__content">
        <table>
          <thead>
            <tr>
              <th className="--d-none">Id</th>
              <th>Title</th>
              <th>Rate</th>
              <th>
                <i className="fa-solid fa-gears"></i>
              </th>
            </tr>
          </thead>
          <tbody id="adminExchangeContent">
            <tr>
              <td>1</td>
              <td>VND</td>
              <td>24576</td>
            </tr>
          </tbody>
          <tbody id="adminExchangeSpinner" className="--d-none">
            <tr>
              <td colSpan="8">
                <div className="spin-container">
                  <Spin />
                </div>
              </td>
            </tr>
          </tbody>
          <tbody id="adminExchangeEmpty" className="--d-none">
            <tr>
              <td colSpan="8">
                <div className="spin-container">
                  <EmptyCustom />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Exchange;
