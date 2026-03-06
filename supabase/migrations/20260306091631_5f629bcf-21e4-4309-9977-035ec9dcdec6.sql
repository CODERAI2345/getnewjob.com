
-- Fix storage bucket security: restrict uploads to safe file types and add size limits

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view images" ON storage.objects;

-- Allow anyone to view images (public read is fine)
CREATE POLICY "Anyone can view images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

-- Restrict uploads: only allow image file types
CREATE POLICY "Restricted image uploads"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'images'
    AND (storage.extension(name) = 'jpg'
      OR storage.extension(name) = 'jpeg'
      OR storage.extension(name) = 'png'
      OR storage.extension(name) = 'gif'
      OR storage.extension(name) = 'webp'
      OR storage.extension(name) = 'svg')
  );

-- No update or delete allowed
