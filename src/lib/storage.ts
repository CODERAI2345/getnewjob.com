import { supabase } from '@/integrations/supabase/client';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadImage(file: File, folder: string = 'general'): Promise<string | null> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    console.error('Invalid file type:', file.type);
    return null;
  }
  if (file.size > MAX_FILE_SIZE) {
    console.error('File too large:', file.size);
    return null;
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${crypto.randomUUID()}.${fileExt}`;

  const { error } = await supabase.storage
    .from('images')
    .upload(fileName, file);

  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }

  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(fileName);

  return data.publicUrl;
}
