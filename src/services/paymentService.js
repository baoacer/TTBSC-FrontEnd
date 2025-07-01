export async function createOrder(cartID, userID, paymentMethod) {
  const response = await fetch("http://nguyenlequocbao.id.vn/v1/api/checkout/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      cartID,
      userID,
      payment: paymentMethod,
      returnUrl: "http://localhost:5173/payment/result" 
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Không thể tạo đơn hàng");
  }

  return response.json();
}
export async function getOrderStatus(orderID) {
  const response = await fetch(`http://nguyenlequocbao.id.vn/v1/api/checkout/order/${orderID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Không thể lấy trạng thái đơn hàng");
  }

  return response.json();
}
export async function confirmPayment(orderID, paymentMethod) {
  const response = await fetch(`http://nguyenlequocbao.id.vn/v1/api/checkout/order/${orderID}/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      paymentMethod
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Không thể xác nhận thanh toán");
  }

  return response.json();
}
export async function getPaymentMethods() {
  const response = await fetch("http://nguyenlequocbao.id.vn/v1/api/checkout/payment-methods", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Không thể lấy phương thức thanh toán");
  }

  return response.json();
}
export async function getPaymentResult(orderID) {
  const response = await fetch(`http://nguyenlequocbao.id.vn/v1/api/checkout/order/${orderID}/result`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Không thể lấy kết quả thanh toán");
  }

  return response.json();
}