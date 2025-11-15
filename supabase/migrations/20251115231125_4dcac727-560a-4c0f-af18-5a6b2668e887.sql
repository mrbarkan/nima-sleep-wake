-- Add UNIQUE constraint to prevent duplicate likes
ALTER TABLE article_likes 
ADD CONSTRAINT unique_user_article_like 
UNIQUE (article_id, user_identifier);

-- Add length validation to suggestions
ALTER TABLE suggestions 
ADD CONSTRAINT suggestion_length_check 
CHECK (char_length(suggestion) >= 10 AND char_length(suggestion) <= 2000);