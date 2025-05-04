import { supabase } from '@/supabase'

export default class EventService {
  /**
   * Récupère l'ID de session_compo à partir d'un label de session et d'un code UE.
   * Sert à localiser une UE précise dans une session donnée.
   */
  static async getSessionCompoId(sessionLabel, ue) {
    const { data: session, error: err1 } = await supabase
      .from('session')
      .select('id')
      .eq('label', sessionLabel)
      .single()
    if (err1 || !session) throw new Error('Session introuvable')

    const { data: compo, error: err2 } = await supabase
      .from('session_compo')
      .select('id')
      .eq('session', session.id)
      .eq('ue', ue)
      .single()
    if (err2 || !compo) throw new Error('UE introuvable pour cette session')

    return compo.id
  }

  /**
   * Récupère l'ID d'une épreuve (event) à partir du session_compo ID et du label de l’épreuve.
   */
  static async getEventId(sessionCompoId, label) {
    const { data, error } = await supabase
      .from('event')
      .select('id')
      .eq('session_compo', sessionCompoId)
      .eq('label', label)
      .single()

    if (error || !data) throw new Error('Épreuve introuvable')
    return data.id
  }

  /**
   * Récupère la liste des salles allouées à une épreuve.
   * Pour chaque salle, on récupère son label, le surveillant et l'ID.
   */
  static async getRooms(eventId) {
    const { data, error } = await supabase
      .from('examination_room')
      .select('room, supervisor, id')
      .eq('event', eventId)

    if (error) throw error
    return data
  }

  /**
   * Compte le nombre d’étudiants présents dans chaque salle d’examen.
   * Retourne un objet du type : { roomId1: 10, roomId2: 8, ... }
   */
  static async getNbStudentsByRoom() {
    const { data, error } = await supabase
      .from('examination')
      .select('examination_room')

    if (error) throw error

    const countMap = {}
    data.forEach(({ examination_room }) => {
      if (examination_room) {
        countMap[examination_room] = (countMap[examination_room] || 0) + 1
      }
    })

    return countMap
  }

  /**
   * Récupère la capacité maximale de chaque salle.
   * Retourne un objet : { "101": 30, "A12": 25, ... }
   */
  static async getRoomCapacities() {
    const { data, error } = await supabase
      .from('room')
      .select('label, capacity')

    if (error) throw error

    return data.reduce((acc, { label, capacity }) => {
      acc[label] = capacity
      return acc
    }, {})
  }

  /**
   * Récupère la liste de tous les labels de salles disponibles.
   * Utile pour les listes déroulantes ou suggestions.
   */
  static async getAllRoomLabels() {
    const { data, error } = await supabase
      .from('room')
      .select('label')

    if (error) throw error
    return data.map(r => r.label)
  }

  /**
   * Ajoute une salle (room) à une épreuve (event).
   * Cela crée une entrée dans examination_room.
   */
  static async addRoomToEvent(eventId, roomLabel) {
    const { error } = await supabase
      .from('examination_room')
      .insert([{ event: eventId, room: roomLabel }])

    if (error) throw error
  }
}
