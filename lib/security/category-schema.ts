import { z } from "zod";
import { sanitizeString } from "./validation";

export const CustomCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Kategori adı en az 2 karakter olmalıdır.")
    .max(80, "Kategori adı en fazla 80 karakter olabilir.")
    .transform((val) => sanitizeString(val)),
  vatRate: z
    .union([z.literal(1), z.literal(10), z.literal(20)])
    .refine((val) => [1, 10, 20].includes(val), {
      message: "KDV Oranı yalnızca %1, %10 veya %20 olabilir.",
    }),
  description: z
    .string()
    .max(200, "Açıklama en fazla 200 karakter olabilir.")
    .optional()
    .transform((val) => (val ? sanitizeString(val) : "")),
});

export type CustomCategoryFormData = z.infer<typeof CustomCategorySchema>;
