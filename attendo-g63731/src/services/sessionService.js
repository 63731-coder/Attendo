import { supabase } from '@/supabase'

// Récupération d'une session par id
//export async function getSessionById(sessionId) {
//  const { data, error } = await supabase
//    .from('session')
//    .select('label')
//    .eq('id', sessionId)
//    .single()
//
//  if (error) throw error
//  return data
//}

// Toutes les UEs disponibles (depuis la table `ue`)
export async function getAllUEs() {
  const { data, error } = await supabase
    .from('ue')
    .select('ue')
    .order('ue')

  if (error) throw error
  return data.map(item => item.ue)
}

// Ajouter une UE à une session
export async function addUEToSession(sessionId, ueLabel) {
  const { data, error } = await supabase
    .from('session_compo')
    .insert([{ session: sessionId, ue: ueLabel }])

  if (error) throw error
  return data
}

// Récupérer les UEs déjà associées à une session
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

// Récupérer le label de la session
export async function getSessionById(sessionId) {
  const { data, error } = await supabase
    .from('session')
    .select('label')
    .eq('id', sessionId)
    .single()

  if (error) throw error
  return data
}
