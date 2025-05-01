// services/examinationRoomService.js
import { supabase } from '@/supabase'

// Tous les locaux déjà affectés à une épreuve
export async function getRoomsForEvent(eventId) {
  const { data, error } = await supabase
    .from('examination_room')
    .select('room, supervisor')
    .eq('event', eventId)

  if (error) throw error
  return data
}

// Tous les locaux disponibles (non utilisés pour cette épreuve)
export async function getAvailableRooms(eventId) {
  const { data: used, error: errorUsed } = await supabase
    .from('examination_room')
    .select('room')
    .eq('event', eventId)

  if (errorUsed) throw errorUsed
  const usedLabels = used.map(r => r.room)

  const { data: allRooms, error } = await supabase
    .from('room')
    .select('label')
    .not('label', 'in', `(${usedLabels.map(l => `'${l}'`).join(',') || "''"})`)

  if (error) throw error
  return allRooms.map(r => r.label)
}


// Ajouter un local à une épreuve
export async function addRoomToEvent(eventId, roomLabel) {
  const { error } = await supabase.from('examination_room').insert([
    {
      event: eventId,
      room: roomLabel,
      supervisor: null
    }
  ])
  if (error) throw error
}

