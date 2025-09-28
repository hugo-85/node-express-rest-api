import z from "zod";

export const AuthSchema = z.object({
  email: z.email("Must be a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password cannot be more than 20 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/,
      "Password must contain at least one symbol"
    ),
});

export function validateAuth(data: any) {
  return AuthSchema.safeParse(data);
}

export type TAuthSchema = z.infer<typeof AuthSchema>;
