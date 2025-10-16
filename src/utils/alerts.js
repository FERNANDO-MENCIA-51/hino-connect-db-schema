import Swal from "sweetalert2";

export const showSuccessAlert = (title, text) => {
  return Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonColor: "#10b981",
    confirmButtonText: "OK",
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      confirmButton: "swal-button-custom",
    },
  });
};

export const showErrorAlert = (title, text) => {
  return Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonColor: "#ef4444",
    confirmButtonText: "OK",
    customClass: {
      confirmButton: "swal-button-custom",
    },
  });
};

export const showWarningAlert = (title, text) => {
  return Swal.fire({
    icon: "warning",
    title,
    text,
    confirmButtonColor: "#f59e0b",
    confirmButtonText: "OK",
    customClass: {
      confirmButton: "swal-button-custom",
    },
  });
};

export const showConfirmAlert = (
  title,
  text,
  confirmText = "Sí, eliminar",
  cancelText = "Cancelar"
) => {
  return Swal.fire({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
    customClass: {
      confirmButton: "swal-button-custom",
      cancelButton: "swal-button-custom",
    },
  });
};

export const showRestoreConfirm = (title, text) => {
  return Swal.fire({
    icon: "question",
    title,
    text,
    showCancelButton: true,
    confirmButtonColor: "#10b981",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Sí, restaurar",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
    customClass: {
      confirmButton: "swal-button-custom",
      cancelButton: "swal-button-custom",
    },
  });
};

export const showLoadingAlert = (title = "Cargando...") => {
  return Swal.fire({
    title,
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};
