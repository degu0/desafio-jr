import { z } from "zod";

export const petSchema = z.object({
  petName: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(50, "Nome deve ter no máximo 50 caracteres"),

  ownerName: z
    .string()
    .min(3, "Nome do dono deve ter no mínimo 3 caracteres")
    .max(100, "Nome do dono deve ter no máximo 100 caracteres"),

  race: z
    .string()
    .min(2, "Raça deve ter no mínimo 2 caracteres")
    .max(50, "Raça deve ter no máximo 50 caracteres"),

  phone: z
    .string()
    .regex(/^\d{10,11}$/, "Telefone deve ter 10 ou 11 dígitos")
    .or(
      z
        .string()
        .regex(
          /^\(\d{2}\)\s?\d{4,5}-?\d{4}$/,
          "Formato inválido: (00) 00000-0000",
        ),
    ),

  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),

  animal: z.enum(["dog", "cat"] as const, {
    message: "Animal inválido",
  }),

  ownerId: z.string(),
});

export type PetFormData = z.infer<typeof petSchema>;
