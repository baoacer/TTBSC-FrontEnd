<template>
  <div class="flex min-h-screen bg-gray-100">
    <div class="hidden lg:flex lg:w-1/2 items-center justify-center">
      <img
        src="https://brand.assets.adidas.com/image/upload/f_auto,q_auto,fl_lossy/if_w_gt_400,w_400/sportswear_fw24_zne_launch_mglp_carousel_mini_lookbook_4_d_b322bb6282.jpg"
        alt="Register Illustration"
        class="object-cover h-full w-full"
      />
    </div>

    <div class="flex flex-col justify-center w-full lg:w-1/2 p-12 bg-white">
      <div class="max-w-lg mx-auto">
        <h2 class="text-3xl font-semibold text-gray-800 text-center mb-6">
          Create an Account
        </h2>
        <p class="text-center text-gray-500 mb-8">
          Fill in the details below to register a new account.
        </p>
        <form @submit.prevent="handleRegister">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label for="name" class="block text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                id="name"
                v-model="name"
                class="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label for="email" class="block text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                v-model="email"
                class="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label for="phone" class="block text-gray-700 mb-2">Phone Number</label>
              <input
                type="text"
                id="phone"
                v-model="phone"
                class="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div>
              <label for="address" class="block text-gray-700 mb-2">Address</label>
              <input
                type="text"
                id="address"
                v-model="address"
                class="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Enter your address"
                required
              />
            </div>

            <div>
              <label for="password" class="block text-gray-700 mb-2">Password</label>
              <div class="relative">
                <input
                  :type="passwordVisible ? 'text' : 'password'"
                  id="password"
                  v-model="password"
                  class="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Enter your password"
                  required
                />
                <font-awesome-icon
                  @click="togglePasswordVisibility"
                  :icon="passwordVisible ? ['fas', 'eye'] : ['fas', 'eye-slash']"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label for="confirmPassword" class="block text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                v-model="confirmPassword"
                class="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Confirm your password"
                required
              />
            </div>
          </div>

          <p v-if="errorMessage" class="text-red-500 text-center mt-3">
            {{ errorMessage }}
          </p>
          <button
            type="submit"
            class="w-full py-3 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none transition duration-200"
          >
            Register
          </button>

          <p class="mt-4 text-center">
            Already have an account?
            <router-link to="/login" class="text-blue-500 hover:text-blue-700">
              Login here
            </router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      confirmPassword: "",
      errorMessage: "",
      passwordVisible: false,
    };
  },
  methods: {
    async handleRegister() {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Mật khẩu không chính xác.";
        return;
      }

      const newUser = {
        name: this.name,
        email: this.email,
        phone: this.phone,
        address: this.address,
        password: this.password,
      };

      try {
        const response = await fetch('http://nguyenlequocbao.id.vn/v1/api/user/signUp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newUser)
        });

        const data = await response.json();
        if (response.ok) {
          this.$router.push("/login");
        } else {
          this.errorMessage = data.message || "Đăng ký thất bại.";
        }
      } catch (error) {
        console.error("Lỗi đăng ký:", error);
        this.errorMessage = "Đăng ký thất bại. Vui lòng thử lại.";
      }
    },
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
      const passwordField = document.getElementById("password");
      passwordField.type = this.passwordVisible ? "text" : "password";
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
