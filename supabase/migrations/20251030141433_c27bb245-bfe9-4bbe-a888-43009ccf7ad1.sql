-- Create tables for multi-device synchronization

-- Table for user tasks (Todo list)
CREATE TABLE public.user_tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id text NOT NULL,
  text text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  archived boolean NOT NULL DEFAULT false,
  category text,
  position integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, task_id)
);

-- Table for user sleep preferences
CREATE TABLE public.user_sleep_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode text NOT NULL DEFAULT 'wake',
  time text NOT NULL DEFAULT '07:00',
  calculated_times jsonb,
  selected_time text,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Table for user caffeine settings
CREATE TABLE public.user_caffeine_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wake_time text NOT NULL,
  schedule jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Table for user preferences (notifications, theme, etc)
CREATE TABLE public.user_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notifications_enabled boolean NOT NULL DEFAULT false,
  theme text,
  preferences jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sleep_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_caffeine_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_tasks
CREATE POLICY "Users can view their own tasks"
  ON public.user_tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
  ON public.user_tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON public.user_tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON public.user_tasks FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for user_sleep_preferences
CREATE POLICY "Users can view their own sleep preferences"
  ON public.user_sleep_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sleep preferences"
  ON public.user_sleep_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sleep preferences"
  ON public.user_sleep_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for user_caffeine_settings
CREATE POLICY "Users can view their own caffeine settings"
  ON public.user_caffeine_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own caffeine settings"
  ON public.user_caffeine_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own caffeine settings"
  ON public.user_caffeine_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for user_preferences
CREATE POLICY "Users can view their own preferences"
  ON public.user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON public.user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON public.user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_user_tasks_user_id ON public.user_tasks(user_id);
CREATE INDEX idx_user_tasks_position ON public.user_tasks(user_id, position);
CREATE INDEX idx_user_sleep_preferences_user_id ON public.user_sleep_preferences(user_id);
CREATE INDEX idx_user_caffeine_settings_user_id ON public.user_caffeine_settings(user_id);
CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);

-- Trigger for updating updated_at on user_tasks
CREATE TRIGGER update_user_tasks_updated_at
  BEFORE UPDATE ON public.user_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updating updated_at on user_sleep_preferences
CREATE TRIGGER update_user_sleep_preferences_updated_at
  BEFORE UPDATE ON public.user_sleep_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updating updated_at on user_caffeine_settings
CREATE TRIGGER update_user_caffeine_settings_updated_at
  BEFORE UPDATE ON public.user_caffeine_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updating updated_at on user_preferences
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();