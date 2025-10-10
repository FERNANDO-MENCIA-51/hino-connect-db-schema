import Swal from "sweetalert2";

// Configuración de alertas de éxito
export const showSuccessAlert = (title, text) => {
  return Swal.fire({
    icon: "success",
    title: title,
    text: text,
    confirmButtonText: "OK",
    confirmButtonColor: "#000000",
    customClass: {
      popup: "rounded-lg",
      confirmButton: "px-8 py-2 rounded",
    },
  });
};

// Configuración de alertas de error
export const showErrorAlert = (title, text) => {
  return Swal.fire({
    icon: "error",
    title: title,
    text: text,
    confirmButtonText: "OK",
    confirmButtonColor: "#991b1b",
    customClass: {
      popup: "rounded-lg",
      confirmButton: "px-8 py-2 rounded",
    },
  });
};

// Configuración de alertas de confirmación
export const showConfirmAlert = (title, text, confirmText = "Sí, eliminar", cancelText = "Cancelar") => {
  return Swal.fire({
    icon: "warning",
    title: title,
    text: text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: "#991b1b",
    cancelButtonColor: "#6b7280",
    customClass: {
      popup: "rounded-lg",
      confirmButton: "px-8 py-2 rounded",
      cancelButton: "px-8 py-2 rounded",
    },
  });
};

// Alerta de información
export const showInfoAlert = (title, text) => {
  return Swal.fire({
    icon: "info",
    title: title,
    text: text,
    confirmButtonText: "Entendido",
    confirmButtonColor: "#2563eb",
    customClass: {
      popup: "rounded-lg",
      confirmButton: "px-8 py-2 rounded",
    },
  });
};
