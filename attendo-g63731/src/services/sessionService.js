import { supabase } from '@/supabase'

export default class SessionService {
  /**
   * Récupère l'ID d'une session à partir de son label (ex: "janvier").
   * Utile pour retrouver une session spécifique dans d'autres requêtes.
   */
  static async getSessionByLabel(label) {
    const { data, error } = await supabase
      .from('session')
      .select('id')
      .eq('label', label)
      .single()

    if (error) throw new Error('Session non trouvée')
    return data // { id: ... }
  }

  /**
   * Récupère toutes les UEs associées à une session donnée (par son ID).
   * Renvoie une liste d'objets contenant les codes UE.
   */
  static async getUEsForSession(sessionId) {
    const { data, error } = await supabase
      .from('session_compo')
      .select('ue')
      .eq('session', sessionId)

    if (error) throw error
    return data // ex: [ { ue: "INFO101" }, { ue: "MATH202" } ]
  }

  /**
   * Récupère la liste de toutes les UEs disponibles dans la base.
   * Renvoie un tableau de codes UE.
   */
  static async getAllUEs() {
    const { data, error } = await supabase
      .from('ue')
      .select('ue')

    if (error) throw error
    return data.map(d => d.ue) // ex: [ "INFO101", "MATH202", ... ]
  }

  /**
   * Ajoute une UE à une session (via session_compo).
   * Nécessite l'ID de la session et le code de l'UE.
   */
  static async addUEToSession(sessionId, ueCode) {
    const { error } = await supabase
      .from('session_compo')
      .insert([{ ue: ueCode, session: sessionId }])

    if (error) throw error
  }
}
