import z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email invalido"),
  password: z.string().min(6, "Senha deve ter no minimo 6 carateres"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, "Nome deve ter no minimo 3 caracteres")
      .max(100, "Nome deve ter no maximo 100 carateres"),
    email: z.string().email("Email invalido"),
    password: z
      .string()
      .min(6, "Senha deve ter no mínimo 6 caracteres")
      .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
      .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
