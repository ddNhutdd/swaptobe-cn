import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000,
  iconHtml: '<i class="fa-solid fa-circle-check"></i>',
  iconColor: "#52c41a",
  customClass: {
    icon: "no-border",
  },
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export const showToast = (type, text) => {
  if (type === "success") {
    Toast.fire({
      icon: "success",
      title: text,
    });
  } else if (type === "error") {
    Toast.fire({
      icon: "error",
      title: text,
    });
  }
};
