import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export const signUpSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z
    .string()
    .email("Invalid email address")
    .min(1, { message: "Email is required" }),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
