/**
 * Suggestions service - handles user feedback and suggestions
 */

import { supabase } from "@/integrations/supabase/client";
import { suggestionSchema } from "@/schemas/suggestion.schemas";

export interface SuggestionData {
  suggestion: string;
  user_id?: string | null;
}

class SuggestionsService {
  /**
   * Submit a new suggestion with validation
   */
  async submitSuggestion(suggestion: string): Promise<void> {
    // Validate input
    const validatedData = suggestionSchema.parse({ suggestion });
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from("suggestions")
      .insert({
        suggestion: validatedData.suggestion,
        user_id: user?.id || null,
      });

    if (error) throw error;
  }

  /**
   * Get all suggestions (admin only)
   */
  async fetchSuggestions() {
    const { data, error } = await supabase
      .from("suggestions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }
}

export const suggestionsService = new SuggestionsService();
