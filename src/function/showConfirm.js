import Swal from "sweetalert2";
const swalCustomConfirm = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success",
    cancelButton: "btn btn-danger",
  },
  buttonsStyling: false,
});
export const showConfirm = (text, onConfirm, onCancel) => {
  const title = "Confirm";
  let icon = "warning";
  swalCustomConfirm
    .fire({
      title,
      html: text,
      icon,
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      reverseButtons: false,
    })
    .then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        onCancel();
      }
    });
};
