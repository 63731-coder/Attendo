import { supabase } from '@/supabase'

// Récupérer l'id de session_compo
export async function getSessionCompoId(sessionId, ueId) {
  const { data, error } = await supabase
    .from('session_compo')
    .select('id')
    .eq('session', sessionId)
    .eq('ue', ueId)
    .maybeSingle()

  if (error || !data) throw error || new Error('Pas de session_compo')
  return data.id
}

// Récupérer la liste des étudiants via pae
export async function getStudentsForUE(ueCode) {
  const { data, error } = await supabase
    .from('pae')
    .select(`
      student_id,
      group,
      student:student_id (
        firstname,
        lastname
      )
    `)
    .eq('ue', ueCode)

  if (error) throw error

  return data.map(p => ({
    id: p.student_id,
    group: p.group,
    first_name: p.student?.firstname || '',
    last_name: p.student?.lastname || ''
  }))
}



// Récupérer une salle d’examen pour un event + room
export async function getExaminationRoom(eventId, roomLabel) {
  const { data, error } = await supabase
    .from('examination_room')
    .select('id, supervisor')
    .eq('event', eventId)
    .eq('room', roomLabel)
    .maybeSingle()

  if (error || !data) throw error || new Error('Salle introuvable')
  return data
}

// Récupérer les étudiants présents dans une salle
export async function getPresentStudentIds(roomId) {
  const { data, error } = await supabase
    .from('examination')
    .select('student')
    .eq('examination_room', roomId)

  if (error) throw error
  return data.map(p => p.student)
}

// Ajouter ou retirer la présence d’un étudiant
export async function toggleStudentPresence(roomId, studentId, isPresent) {
  if (isPresent) {
    const { error } = await supabase
      .from('examination')
      .delete()
      .eq('student', studentId)
      .eq('examination_room', roomId)

    if (error) throw error
  } else {
    const { error } = await supabase
      .from('examination')
      .insert([{ student: studentId, examination_room: roomId }])

    if (error) throw error
  }
}

// Liste des surveillants (profs)
export async function getAllSupervisors() {
  const { data, error } = await supabase
    .from('teacher')
    .select('acro')

    console.log(data)

  if (error) throw error
  return data // [{ acro: 'ABS' }, ...]
}



// Mise à jour du surveillant dans une salle
export async function updateRoomSupervisor(roomId, supervisor) {
  const { error } = await supabase
    .from('examination_room')
    .update({ supervisor })
    .eq('id', roomId)

  if (error) throw error
}
