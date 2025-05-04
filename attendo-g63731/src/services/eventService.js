import { supabase } from '@/supabase'

export default class EventService {
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

  static async getRooms(eventId) {
    const { data, error } = await supabase
      .from('examination_room')
      .select('room, supervisor, id')
      .eq('event', eventId)

    if (error) throw error
    return data
  }

  static async getNbStudentsByRoom() {
    const { data, error } = await supabase
      .from('examination')
      .select('examination_room')

    if (error) throw error

    // compter le nombre d'occurrences par examination_room
    const countMap = {}
    data.forEach(({ examination_room }) => {
      if (examination_room) {
        countMap[examination_room] = (countMap[examination_room] || 0) + 1
      }
    })

    return countMap
  }

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

  static async getAllRoomLabels() {
    const { data, error } = await supabase
      .from('room')
      .select('label')

    if (error) throw error
    return data.map(r => r.label)
  }

  static async addRoomToEvent(eventId, roomLabel) {
    const { error } = await supabase
      .from('examination_room')
      .insert([{ event: eventId, room: roomLabel }])

    if (error) throw error
  }
}
