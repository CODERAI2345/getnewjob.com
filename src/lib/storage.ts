import { supabase } from '@/integrations/supabase/client';

export async function uploadImage(file: File, folder: string = 'general'): Promise<string | null> {
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
