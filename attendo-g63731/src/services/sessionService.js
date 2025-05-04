import { supabase } from '@/supabase'

export default class SessionService {
  static async getSessionByLabel(label) {
    const { data, error } = await supabase
      .from('session')
      .select('id')
      .eq('label', label)
      .single()

    if (error) throw new Error('Session non trouvée')
    return data
  }

  static async getUEsForSession(sessionId) {
    const { data, error } = await supabase
      .from('session_compo')
      .select('ue')
      .eq('session', sessionId)

    if (error) throw error
    return data
  }

  static async getAllUEs() {
    const { data, error } = await supabase
      .from('ue')
      .select('ue')

    if (error) throw error
    return data.map(d => d.ue)
  }

  static async addUEToSession(sessionId, ueCode) {
    const { error } = await supabase
      .from('session_compo')
      .insert([{ ue: ueCode, session: sessionId }])

    if (error) throw error
  }
}
