export default function formatPrice(price) {
  //điều kiện
  if (isNaN(price) || price < 0) {
    return "0₫";
  }

  return price.toLocaleString("vi-VN") + "₫";
}
