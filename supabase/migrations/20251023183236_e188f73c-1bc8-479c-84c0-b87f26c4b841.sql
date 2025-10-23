-- Create blog articles table
CREATE TABLE public.blog_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  external_url TEXT,
  image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;

-- Everyone can read articles
CREATE POLICY "Articles are viewable by everyone" 
ON public.blog_articles 
FOR SELECT 
USING (true);

-- Create likes table
CREATE TABLE public.article_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.blog_articles(id) ON DELETE CASCADE,
  user_identifier TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(article_id, user_identifier)
);

-- Enable Row Level Security
ALTER TABLE public.article_likes ENABLE ROW LEVEL SECURITY;

-- Everyone can read likes
CREATE POLICY "Likes are viewable by everyone" 
ON public.article_likes 
FOR SELECT 
USING (true);

-- Anyone can insert likes
CREATE POLICY "Anyone can like articles" 
ON public.article_likes 
FOR INSERT 
WITH CHECK (true);

-- Users can delete their own likes
CREATE POLICY "Users can unlike articles" 
ON public.article_likes 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_blog_articles_updated_at
BEFORE UPDATE ON public.blog_articles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some initial blog articles
INSERT INTO public.blog_articles (title, excerpt, content, external_url, image_url) VALUES
(
  'Por que dormimos em ciclos de 90 minutos?',
  'Entenda a ciência por trás dos ciclos do sono e como eles afetam sua qualidade de descanso.',
  'O sono é organizado em ciclos de aproximadamente 90 minutos, cada um passando por diferentes estágios: sono leve, sono profundo e REM (Rapid Eye Movement). Durante o sono REM, ocorre a consolidação de memórias e o processamento emocional. Acordar no meio de um ciclo pode causar aquela sensação de "ressaca do sono", enquanto acordar ao final de um ciclo nos faz sentir mais descansados e alertas.',
  'https://www.sleepfoundation.org/stages-of-sleep',
  null
),
(
  'Cafeína: Timing é tudo',
  'Descubra o momento ideal para consumir cafeína e maximizar seus benefícios sem prejudicar o sono.',
  'A cafeína tem meia-vida de 5-6 horas no organismo, o que significa que metade da dose ainda está ativa após esse período. Por isso, consumir café após as 15h pode interferir significativamente na qualidade do sono noturno. O momento ideal para a primeira dose é entre 90-120 minutos após acordar, quando o cortisol natural começa a declinar.',
  'https://www.sleepfoundation.org/nutrition/caffeine-and-sleep',
  null
),
(
  'A importância do ritmo circadiano',
  'Como nosso relógio biológico regula sono, energia e saúde.',
  'O ritmo circadiano é nosso relógio biológico interno de aproximadamente 24 horas que regula ciclos de sono-vigília, temperatura corporal, liberação de hormônios e outras funções vitais. A exposição à luz natural pela manhã e evitar luz azul à noite ajuda a manter esse ritmo saudável, resultando em melhor qualidade de sono e mais energia durante o dia.',
  'https://www.nigms.nih.gov/education/fact-sheets/Pages/circadian-rhythms.aspx',
  null
);