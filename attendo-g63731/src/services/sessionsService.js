import { supabase } from '@/supabase'

// Récupérer toutes les sessions triées par ID
export async function getSessions() {
  const { data, error } = await supabase
    .from('session')
    .select('*')
    .order('id', { ascending: true })

  if (error) throw error
  return data
}

// Ajouter une session
export async function addSession(label) {
  const { data, error } = await supabase
    .from('session')
    .insert({ label })
    .select()

  if (error) throw error
  return data
}
