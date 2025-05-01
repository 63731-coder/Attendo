import { supabase } from '@/supabase'

export async function getSessionCompoId(sessionId, ueId) {
  const { data, error } = await supabase
    .from('session_compo')
    .select('id')
    .eq('session', sessionId)
    .eq('ue', ueId)
    .maybeSingle()

  if (error || !data) {
    console.error('Erreur récupération session_compo:', error?.message || 'Pas de résultat')
    return null
  }

  return data.id
}

export async function getEventsBySessionCompo(compoId) {
  const { data, error } = await supabase
    .from('event')
    .select('*')
    .eq('session_compo', compoId)

  if (error) {
    console.error('Erreur chargement events:', error.message)
    return []
  }

  return data
}

export async function addEventToCompo(label, compoId) {
  const { error } = await supabase.from('event').insert([
    {
      label,
      session_compo: compoId,
      completed: false
    }
  ])

  if (error) {
    console.error('Erreur ajout event:', error.message)
    throw error
  }
}
