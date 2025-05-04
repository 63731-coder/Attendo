import { supabase } from '@/supabase'

export default class UEService {
  /**
   * Récupère l'identifiant (id) de la ligne session_compo
   * correspondant à une session et une UE donnée.
   */
  static async getSessionCompo(sessionLabel, ueCode) {
    // Cherche l'ID de la session à partir de son label
    const { data: session, error: sessionError } = await supabase
      .from('session')
      .select('id')
      .eq('label', sessionLabel)
      .single()

    if (sessionError) throw new Error('Session non trouvée')

    // Cherche la ligne dans session_compo correspondant à cette session et cette UE
    const { data: compo, error: compoError } = await supabase
      .from('session_compo')
      .select('id')
      .eq('session', session.id)
      .eq('ue', ueCode)
      .single()

    if (compoError) throw new Error('UE non trouvée dans la session')

    // Retourne l'ID de session_compo
    return compo.id
  }

  /**
   * Récupère les labels (noms) de toutes les épreuves
   * associées à une session_compo donnée (écrit, oral, etc.).
   */
  static async getEvents(sessionCompoId) {
    const { data, error } = await supabase
      .from('event')
      .select('label')
      .eq('session_compo', sessionCompoId)

    if (error) throw error

    // Retourne seulement les labels des épreuves
    return data.map(e => e.label)
  }

  /**
   * Ajoute une nouvelle épreuve (event) à une session_compo.
   * L’épreuve n’est pas encore marquée comme terminée (completed: false).
   */
  static async addEvent(sessionCompoId, label) {
    const { error } = await supabase
      .from('event')
      .insert([{ session_compo: sessionCompoId, label, completed: false }])

    if (error) throw error
  }
}
