-- Create table for fasting data
CREATE TABLE public.user_fasting_data (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  last_meal_time text NOT NULL,
  target_duration integer NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_fasting_data ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own fasting data" 
ON public.user_fasting_data 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own fasting data" 
ON public.user_fasting_data 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fasting data" 
ON public.user_fasting_data 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_fasting_data_updated_at
BEFORE UPDATE ON public.user_fasting_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();