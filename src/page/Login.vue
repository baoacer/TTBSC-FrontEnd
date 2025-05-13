<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Left side with an image or illustration -->
    <div class="hidden lg:flex lg:w-1/2 items-center justify-center">
      <img
        src="https://brand.assets.adidas.com/image/upload/f_auto,q_auto,fl_lossy/if_w_gt_400,w_400/sportswear_fw24_zne_launch_mglp_carousel_mini_lookbook_1_d_762141e477.jpg"
        alt="Login Illustration"
        class="object-cover h-full w-full"
      />
    </div>

    <!-- Right side with the login form -->
    <div class="flex flex-col justify-center w-full lg:w-1/2 p-12 bg-white">
      <div class="max-w-md mx-auto">
        <h2 class="text-3xl font-semibold text-gray-800 text-center mb-6">
          Welcome Back
        </h2>
        <p class="text-center text-gray-500 mb-8">
          Please enter your details to log in.
        </p>
        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <label for="email" class="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              v-model="email"
              class="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Email Address"
              required 
            />
          </div>

          <div class="mb-6">
            <label for="password" class="block text-gray-700 mb-2"
              >Password</label
            >
            <input
              type="password"
              id="password"
              v-model="password"
              class="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Password"
              required
            />
          </div>

          <p v-if="errorMessage" class="text-red-500 text-center mb-4">
            {{ errorMessage }}
          </p>
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none transition duration-200"
          >
            Log In
          </button>

          <div class="text-center mt-6">
            <router-link
              to="/forgot-password"
              class="text-sm text-blue-600 hover:text-blue-700"
            >
              Forgot Password?
            </router-link>
          </div>

          <div class="text-center mt-4">
            <p class="text-gray-600">Don't have an account?</p>
            <router-link
              to="/register"
              class="text-blue-600 hover:text-blue-700"
            >
              Register Here
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import userService from "../services/userSercices";

export default {
  
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
  
    async handleLogin() {
      try {
        
        const response = await axios.get(
          `http://localhost:3000/user?email=${this.email}&password=${this.password}`
        );

        // Check if the response contains matching users
        if (response.data.length === 0) {
          return (this.errorMessage = "Invalid email or password.");
        }
        const user = response.data[0];
        userService.login(user);

        this.$router.push("/");
      } catch (error) {
        // Handle errors
        this.errorMessage = error.response
          ? error.response.data.message
          : error.message;
      }
    },
  },
};
</script>

<style scoped>
/* Optional custom styles */
</style>
