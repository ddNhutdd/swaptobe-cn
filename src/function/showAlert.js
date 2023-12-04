/* eslint-disable no-lone-blocks */
import Swal from "sweetalert2";
const swalCustomSuccess = Swal.mixin({
  customClass: {
    confirmButton: "btn-swal-antd",
    htmlContainer: "content-swal-antd",
    title: "title-swal-antd",
    icon: "no-border",
  },
  buttonsStyling: false,
  iconHtml: '<i class="fa-solid fa-circle-check"></i>',
  iconColor: "#52c41a",
});
const swalCustomError = Swal.mixin({
  customClass: {
    confirmButton: "btn-swal-antd",
    htmlContainer: "content-swal-antd",
    title: "title-swal-antd",
    icon: "no-border",
  },
  buttonsStyling: false,
  iconHtml: '<i class="fa-solid fa-circle-xmark"></i>',
  iconColor: "#ff4d4f",
});

export const showAlert = (type, text) => {
  let title;
  let icon;
  switch (type) {
    case "success":
      {
        title = "Success";
        icon = "success";
        swalCustomSuccess.fire({ title, text, icon });
      }
      break;
    case "error":
      {
        title = "Error";
        icon = "error";
        swalCustomError.fire({ title, text, icon });
      }
      break;
    default:
      break;
  }
};
