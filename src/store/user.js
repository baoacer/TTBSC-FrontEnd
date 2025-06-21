import { defineStore } from 'pinia'

export const useUserStore = defineStore("user", {
    state: () => ({
        user: JSON.parse(localStorage.getItem("user")) || null,
        users: [],
        accessToken: localStorage.getItem("accessToken") || ""
    }),
    getters: {
        isLogin: (state) => !!state.user && !!state.accessToken,
    },
    actions: {
        setUser(user, token) {
            this.user = user;
            this.accessToken = token;
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("accessToken", token);
        },
        logout(){
            this.user = null;
            this.accessToken = "";
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
        }
    }
})