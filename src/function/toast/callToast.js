import { toast } from "react-toastify";
import css from "./callToast.module.scss";
const toastOption = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  progress: undefined,
  theme: "dark",
};
//
export const callToastSuccess = (content) =>
  toast(<ToastSuccess content={content} />, toastOption);
export const callToastError = (content) =>
  toast(<ToastError content={content} />, toastOption);

//
const ToastSuccess = function ({ content }) {
  return (
    <>
      <div className={css["toast-header"]}>
        <div className={css["toast-header-success-icon"]}>
          <i className="fa-solid fa-circle-check"></i>
        </div>

        <span>Success</span>
      </div>
      <div>{content}</div>
    </>
  );
};
const ToastError = function ({ content }) {
  return (
    <>
      <div className={css["toast-header"]}>
        <div className={css["toast-header-error-icon"]}>
          <i className="fa-solid fa-circle-xmark red"></i>
        </div>
        <span>Error</span>
      </div>
      <div>{content}</div>
    </>
  );
};
