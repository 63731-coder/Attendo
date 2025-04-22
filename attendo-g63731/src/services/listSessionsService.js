import { supabase } from '@/supabase'

export async function getSessions() { //récupérer toutes les sessions
  const { data, error } = await supabase.from('session').select('*').order('id', { ascending: true })
  if (error) throw error
  return data
}

export async function addSession(name) { //ajouter une nouvelle session
  const { data, error } = await supabase.from('session').insert({ label: name }).select()
  if (error) throw error
  return data
}
