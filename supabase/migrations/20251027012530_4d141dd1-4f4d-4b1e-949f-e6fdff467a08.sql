-- Add admin-only policies for blog articles content management

-- Allow admins to insert articles
CREATE POLICY "Admins can insert articles"
ON public.blog_articles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to update articles
CREATE POLICY "Admins can update articles"
ON public.blog_articles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete articles
CREATE POLICY "Admins can delete articles"
ON public.blog_articles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));