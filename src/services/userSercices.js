import { ref } from "vue";
import { EventEmitter } from "events";

const eventEmitter = new EventEmitter();
const isLoggedIn = ref(false);

const userService = {
  eventEmitter,

  // Lấy danh sách users đã đăng ký (nếu có)
  getUsers() {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
  },

  // Lưu lại danh sách users
  saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  },

  // Đăng nhập
  login(user) {
    this.setLoggedInUser(user);
    isLoggedIn.value = true;
    eventEmitter.emit("userLoggedIn", user);
    return user;
  },

  // ✅ Trả về true nếu đang đăng nhập
  isLoggedIn() {
    return !!localStorage.getItem("currentUser");
  },

  // ✅ Trả về object user nếu có
  getUser() {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  },

  // Đặt user đang đăng nhập
  setLoggedInUser(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  },

  // Đăng xuất
  logout() {
    localStorage.removeItem("currentUser");
    isLoggedIn.value = false;
    eventEmitter.emit("userLoggedOut");
  },
};

export default userService;
