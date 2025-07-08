import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string().required("Email is required"),
  password: Yup.string()
    .min(8, "Password should be at least 8 characters long")
    .required("Password is required"),
});

export const registerSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password should be at least 8 characters long")
    .required("Password is required"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});
