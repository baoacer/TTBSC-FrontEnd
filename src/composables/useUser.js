import { ref } from "vue";
import { login as loginApi } from "../api/user";

const user = ref(JSON.parse(localStorage.getItem("user")) || null);
const accessToken = ref(localStorage.getItem("accessToken") || "");
const isLoggedIn = ref(!!user.value && !!accessToken.value);

export function useUser() {
  /**
   * Login  
   */
  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    const metadata = res.data?.metadata;
    if (metadata?.user && metadata?.accessToken) {
      user.value = metadata.user;
      accessToken.value = metadata.accessToken;
      localStorage.setItem("user", JSON.stringify(metadata.user));
      localStorage.setItem("accessToken", metadata.accessToken);
      isLoggedIn.value = true;
    }
    return metadata;
  };

  /**
   * Logout
   */
  const logout = () => {
    user.value = null;
    accessToken.value = "";
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    isLoggedIn.value = false;
  };

  return {
    user,
    accessToken,
    isLoggedIn,
    login,
    logout,
  };
}
