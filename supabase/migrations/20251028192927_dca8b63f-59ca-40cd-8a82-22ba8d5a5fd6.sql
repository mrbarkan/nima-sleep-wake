-- Create suggestions table for user feedback
CREATE TABLE public.suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  suggestion TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

-- Allow anyone (authenticated or not) to submit suggestions
CREATE POLICY "Anyone can submit suggestions" 
ON public.suggestions 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view suggestions
CREATE POLICY "Admins can view all suggestions" 
ON public.suggestions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));