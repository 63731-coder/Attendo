import { supabase } from '@/supabase'

// Récupérer les épreuves à partir de l'id de session_compo
export async function getEventsBySessionCompoId(sessionCompoId) {
  const { data, error } = await supabase
    .from('event')
    .select('*')
    .eq('session_compo', sessionCompoId)

  if (error) throw error
  return data
}
