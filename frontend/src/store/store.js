import { create } from "zustand";

const initialState = {
  token: null,
  isAuthenticated: false,
  user: null,
  error: null,
  successPopOpen: false,
  successMessage: "",
};

const useStore = create((set) => ({
  ...initialState,

  setAuthData: ({ token, user }) => {
    set({ token, isAuthenticated: true, user });
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },

  logout: () => {
    set({
      token: null,
      isAuthenticated: false,
      user: null,
    });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  checkAuthentication: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      try {
        if (user && user !== "undefined" && user !== "null") {
          const parsedUser = JSON.parse(user);
          set({
            token,
            isAuthenticated: true,
            user: parsedUser,
          });
        } else {
          set({
            token: null,
            isAuthenticated: false,
            user: null,
          });
        }
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        set({
          token: null,
          isAuthenticated: false,
          user: null,
        });
      }
    } else {
      set({
        token: null,
        isAuthenticated: false,
        user: null,
      });
    }
  },

  setError: (error) => set({ error }),

  resetError: () => set({ error: null }),
}));

const useAuth = () => {
  const {
    token,
    isAuthenticated,
    user,
    setAuthData,
    logout,
    setError,
    error,
    resetError,
    checkAuthentication,
  } = useStore();

  return {
    token,
    isAuthenticated,
    user,
    setAuthData,
    logout,
    setError,
    error,
    resetError,
    checkAuthentication,
  };
};

export { useStore, useAuth };
