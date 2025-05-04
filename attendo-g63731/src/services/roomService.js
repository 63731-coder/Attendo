import { supabase } from '@/supabase'

export default {
  // Récupérer la session_compo ID
  async getSessionCompoId(sessionLabel, ue) {
    const sessionRes = await supabase
      .from('session')
      .select('id')
      .eq('label', sessionLabel)
      .maybeSingle()

    if (!sessionRes.data) throw new Error('Session non trouvée')
    const sessionId = sessionRes.data.id

    const compoRes = await supabase
      .from('session_compo')
      .select('id')
      .eq('session', sessionId)
      .eq('ue', ue)
      .maybeSingle()

    if (!compoRes.data) throw new Error('Compo non trouvée')

    return compoRes.data.id
  },

  // Récupérer l'ID de l'épreuve
  async getEventId(compoId, eventLabel) {
    const { data, error } = await supabase
      .from('event')
      .select('id')
      .eq('session_compo', compoId)
      .eq('label', eventLabel)
      .maybeSingle()

    if (error || !data) throw error || new Error("Épreuve introuvable")
    return data.id
  },

  // Récupérer la salle d'examen pour une épreuve
  async getExaminationRoom(eventId, roomLabel) {
    const { data, error } = await supabase
      .from('examination_room')
      .select('id, supervisor')
      .eq('event', eventId)
      .eq('room', roomLabel)
      .maybeSingle()

    if (error || !data) throw error || new Error('Salle introuvable')
    return data
  },

  // Étudiants présents dans une salle
  async getPresentStudentIds(roomId) {
    const { data, error } = await supabase
      .from('examination')
      .select('student')
      .eq('examination_room', roomId)

    if (error) throw error
    return data.map(p => p.student)
  },

  // Étudiants inscrits à l’UE via pae + données student
  async getStudentsForUE(ue) {
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
      .eq('ue', ue)

    if (error) throw error

    return data.map(p => ({
      student_id: p.student_id,
      group: p.group,
      firstname: p.student?.firstname || '',
      lastname: p.student?.lastname || ''
    }))
  },

  // Récupérer tous les étudiants pour l'écran RoomView
  async getRoomStudentsAndSupervisor(sessionLabel, ue, eventLabel, roomLabel) {
    const sessionCompoId = await this.getSessionCompoId(sessionLabel, ue)
    const eventId = await this.getEventId(sessionCompoId, eventLabel)
    const examRoom = await this.getExaminationRoom(eventId, roomLabel)

    const [presentIds, allStudents] = await Promise.all([
      this.getPresentStudentIds(examRoom.id),
      this.getStudentsForUE(ue)
    ])

    // Marquer les présents
    const students = allStudents.map(s => ({
      ...s,
      isPresent: presentIds.includes(s.student_id)
    }))

    // Récupérer surveillants disponibles
    const { data: supervisors, error } = await supabase
      .from('teacher')
      .select('acro')

    if (error) throw error

    return {
      students,
      supervisor: examRoom.supervisor,
      availableSupervisors: supervisors.map(s => s.acro)
    }
  },

  // Mettre à jour le surveillant
  async setSupervisor(sessionLabel, ue, eventLabel, roomLabel, newSupervisor) {
    const sessionCompoId = await this.getSessionCompoId(sessionLabel, ue)
    const eventId = await this.getEventId(sessionCompoId, eventLabel)
    const room = await this.getExaminationRoom(eventId, roomLabel)

    const { error } = await supabase
      .from('examination_room')
      .update({ supervisor: newSupervisor })
      .eq('id', room.id)

    if (error) throw error
  },

  // Activer ou désactiver la présence
  async toggleStudentPresence(roomId, studentId, isPresent) {
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
}
