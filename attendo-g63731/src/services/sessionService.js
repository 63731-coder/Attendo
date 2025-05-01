import { supabase } from '@/supabase'

// Récupération du label d'une session par son ID
export async function getSessionById(sessionId) {
  const { data, error } = await supabase
    .from('session')
    .select('label')
    .eq('id', sessionId)
    .single()

  if (error) throw error
  return data
}

// Récupération de toutes les UEs disponibles
export async function getAllUEs() {
  const { data, error } = await supabase
    .from('ue')
    .select('ue')
    .order('ue')

  if (error) throw error
  return data.map(item => item.ue)
}

// UEs associées à une session spécifique
export async function getSessionUEs(sessionId) {
  const { data, error } = await supabase
    .from('session_compo')
    .select('ue')
    .eq('session', sessionId)

  if (error) throw error
  return data.map(item => ({
    id: item.ue,
    label: item.ue
  }))
}

// Ajouter une UE à une session
export async function addUEToSession(sessionId, ueLabel) {
  const { error } = await supabase
    .from('session_compo')
    .insert([{ session: sessionId, ue: ueLabel }])

  if (error) throw error
}
