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
  });
};

export const showErrorAlert = (title, text) => {
  return Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonColor: "#ef4444",
    confirmButtonText: "OK",
  });
};

export const showWarningAlert = (title, text) => {
  return Swal.fire({
    icon: "warning",
    title,
    text,
    confirmButtonColor: "#f59e0b",
    confirmButtonText: "OK",
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
    buttonsStyling: true,
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
    buttonsStyling: true,
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
