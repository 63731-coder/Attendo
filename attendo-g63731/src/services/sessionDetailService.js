import { supabase } from '@/supabase'

// Récupérer les UEs liées à une session (via session_compo)
export async function getUEsBySession(sessionId) {
  const { data, error } = await supabase
    .from('session_compo')
    .select('ue (id, label)')
    .eq('session_id', sessionId)

  if (error) throw error

  // extraire proprement les UEs depuis les relations
  return data.map(item => item.ue)
}
