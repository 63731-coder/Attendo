import { supabase } from '@/supabase'

export default class UEService {
  static async getSessionCompo(sessionLabel, ueCode) {
    // Récupérer l'ID de session
    const { data: session, error: sessionError } = await supabase
      .from('session')
      .select('id')
      .eq('label', sessionLabel)
      .single()

    if (sessionError) throw new Error('Session non trouvée')

    const { data: compo, error: compoError } = await supabase
      .from('session_compo')
      .select('id')
      .eq('session', session.id)
      .eq('ue', ueCode)
      .single()

    if (compoError) throw new Error('UE non trouvée dans la session')

    return compo.id
  }

  static async getEvents(sessionCompoId) {
    const { data, error } = await supabase
      .from('event')
      .select('label')
      .eq('session_compo', sessionCompoId)

    if (error) throw error
    return data.map(e => e.label)
  }

  static async addEvent(sessionCompoId, label) {
    const { error } = await supabase
      .from('event')
      .insert([{ session_compo: sessionCompoId, label, completed: false }])

    if (error) throw error
  }
}
