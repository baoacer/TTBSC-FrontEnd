import { ORDER_STATUS, PAYMENT_STATUS } from "./constant";


export const formatPrice = (value) => {
  const num = Number(value || 0);
  return num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN");
};

export const paymentStatusText = (status) => {
  switch (status) {
    case PAYMENT_STATUS.PENDING:
      return "Chờ thanh toán";
    case PAYMENT_STATUS.PAID:
      return "Đã thanh toán";
    case PAYMENT_STATUS.COMPLETED:
      return "Hoàn tất";
    case PAYMENT_STATUS.FAILDED:
      return "Thanh toán thất bại";
    default:
      return status || "Không xác định";
  }
}
export const paymentStatusColor = (status) => {
  switch (status) {
    case PAYMENT_STATUS.PENDING:
      return "bg-yellow-100 text-yellow-700";
    case PAYMENT_STATUS.PAID:
    case PAYMENT_STATUS.COMPLETED:
      return "bg-green-100 text-green-700";
    case PAYMENT_STATUS.FAILDED:
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}
export const orderStatusText = (status) => {
  switch (status) {
    case ORDER_STATUS.PENDING:
      return "Chờ xác nhận";
    case ORDER_STATUS.CONFIRMED:
      return "Xác nhận";
    case ORDER_STATUS.SHIPPING:
      return "Đang giao";
    case ORDER_STATUS.COMPLETED:
      return "Hoàn thành";
    case ORDER_STATUS.CANCELLED:
      return "Đã hủy";
    default:
      return status;
  }
}
export const orderStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "confirmed":
      return "bg-blue-100 text-blue-700";
    case "shipping":
      return "bg-blue-200 text-blue-800";
    case "completed":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}