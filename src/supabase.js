import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Copy .env.example to .env and fill in values.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// ── Auth (Phone OTP) ──

export async function sendOtp(phone) {
  const { error } = await supabase.auth.signInWithOtp({ phone });
  if (error) throw error;
}

export async function verifyOtp(phone, token) {
  const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
  if (error) throw error;
  return data;
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function signOut() {
  await supabase.auth.signOut();
}

// ── Photo helpers ──

export async function uploadBase64Photo(base64, petId, index) {
  const res = await fetch(base64);
  const blob = await res.blob();
  const ext = blob.type.split('/')[1] || 'jpeg';
  const path = `${petId}/${index}.${ext}`;
  const { error } = await supabase.storage
    .from('pet-photos')
    .upload(path, blob, { upsert: true, contentType: blob.type });
  if (error) throw error;
  const { data } = supabase.storage.from('pet-photos').getPublicUrl(path);
  return data.publicUrl;
}

// ── Pet CRUD ──

export async function fetchPets() {
  const { data, error } = await supabase
    .from('pets_public')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createPet(pet) {
  const { data, error } = await supabase
    .from('pets')
    .insert({
      type: pet.type,
      name: pet.name,
      breed: pet.breed,
      description: pet.description || null,
      owner_id: pet.ownerId,
      whatsapp: pet.whatsapp,
      photo_urls: pet.photoUrls || [],
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updatePet(id, updates) {
  const { data, error } = await supabase
    .from('pets')
    .update({
      name: updates.name,
      type: updates.type,
      breed: updates.breed,
      description: updates.description || null,
      photo_urls: updates.photoUrls || undefined,
    })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePet(id) {
  // Delete photos from storage
  const { data: files } = await supabase.storage.from('pet-photos').list(id);
  if (files?.length) {
    await supabase.storage.from('pet-photos').remove(files.map(f => `${id}/${f.name}`));
  }
  const { error } = await supabase.from('pets').delete().eq('id', id);
  if (error) throw error;
}
