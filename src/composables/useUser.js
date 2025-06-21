import { computed } from "vue";
import {
  login as loginApi,
  updateUserInfo,
  getUsers,
  active,
  resetPassword,
  changePassword
} from "../api/user";
import { useUserStore } from "../store/user";

export function useUser() {
  const useStore = useUserStore();

  /**
   * Login
   */
  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    const metadata = res.data?.metadata;
    if (metadata?.user && metadata?.accessToken) {
      useStore.setUser(metadata.user, metadata.accessToken);
    }
    return metadata;
  };

  /**
   * Logout
   */
  const logout = () => {
    useStore.logout();
  };

  const update = async (data) => {
    await updateUserInfo({
      userID: useStore.user._id,
      data,
    });
    const updateInfo = { ...useStore.user, ...data };
    useStore.setUser(updateInfo, useStore.accessToken);
  };

  const fetchUsers = async (params) => {
    try {
      const { data } = await getUsers(params);
      return data?.metadata;
    } catch (e) {
      console.error("Fetch Users Error:", e);
      return { users: [], pagination: { total: 0, totalPage: 1, page: 1, limit: 10 } };
    }
  };

  const activeUser = async ({ email }) => {
    try {
      await active({ email });
    } catch (e) {
      throw new Error("Activce User Error::", e.message);
    }
  };

  const reset = async ({ email }) => {
    try {
      await resetPassword({ email });
    } catch (e) {
      const errMsg = e.response?.data?.message || "Đã có lỗi xảy ra";
      throw new Error(errMsg);
    }
  };

  const change = async (data) => {
    try {
      await changePassword(data);
    } catch (e) {
      throw new Error("Change Password Error::", e.message);
    }
  };

  return {
    login,
    logout,
    update,
    fetchUsers,
    activeUser,
    reset,
    change,
    users: computed(() => useStore.users),
    isLogin: computed(() => useStore.isLogin),
    user: computed(() => useStore.user),
    accessToken: computed(() => useStore.accessToken),
  };
}
