import { ref } from "vue";
import { EventEmitter } from "events";
const eventEmitter = new EventEmitter();
const isLoggedIn = ref(false);
const userService = {
  eventEmitter,
  getUsers() {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
  },

  // Save users to localStorage
  saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  },

  // Login user
  login(user) {
    // User found and logged in successfully
    this.setLoggedInUser(user);
    eventEmitter.emit("userLoggedIn", user);
    isLoggedIn.value = true;
    return user;
  },

  // Check if a user is logged in (this could be expanded to include a session token, etc.)
  isLoggedIn() {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  },

  // Set the current logged-in user in localStorage
  setLoggedInUser(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  },

  // Log out the current user
  logout() {
    localStorage.removeItem("currentUser");
    eventEmitter.emit("userLoggedOut");
    isLoggedIn.value = false;
  },
};

export default userService;
