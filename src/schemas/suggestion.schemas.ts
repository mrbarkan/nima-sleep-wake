import { z } from "zod";

/**
 * Schema de validação para sugestões de usuários
 */
export const suggestionSchema = z.object({
  suggestion: z.string()
    .trim()
    .min(10, "A sugestão deve ter pelo menos 10 caracteres")
    .max(2000, "A sugestão deve ter no máximo 2000 caracteres"),
});

export type SuggestionInput = z.infer<typeof suggestionSchema>;
