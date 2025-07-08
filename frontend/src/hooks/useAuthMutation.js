import { login, register } from "@/services/auth.service";
import { useStore } from "@/store/store";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLoginMutation = () => {
  const setAuthData = useStore((state) => state.setAuthData);
  const router = useRouter();
  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      const { user, token } = response.data;
      setAuthData({
        user,
        token,
        isAuthenticated: true,
      });

      router.push("/feed");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message;
      console.log(errorMessage);
      useStore.getState().setError(errorMessage);
    },
    onSettled: () => {
      console.log("Login mutation completed");
    },
  });
};

export const useRegisterMutation = () => {
  const setAuthData = useStore((state) => state.setAuthData);
  const router = useRouter();
  return useMutation({
    mutationFn: register,
    onSuccess: (response) => {
      const { user, token } = response.data;
      setAuthData({
        user,
        token,
        isAuthenticated: true,
      });

      router.push("/feed");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message;
      console.log(errorMessage);
      useStore.getState().setError(errorMessage);
    },
    onSettled: () => {
      console.log("Register mutation completed");
    },
  });
};
