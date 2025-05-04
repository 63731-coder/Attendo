import { supabase } from '@/supabase'

export default {
  /**
   * Récupère l'identifiant (ID) de la ligne session_compo
   * correspondant à une session (par label) et à une UE.
   */
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

  /**
   * Récupère l'ID d'une épreuve (event) à partir du session_compo ID et du label de l’épreuve.
   */
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

  /**
   * Récupère les infos de la salle (examination_room) utilisée pour une épreuve donnée.
   */
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

  /**
   * Récupère la liste des étudiants présents dans une salle d'examen.
   * Renvoie un tableau contenant les matricules des étudiants.
   */
  async getPresentStudentIds(roomId) {
    const { data, error } = await supabase
      .from('examination')
      .select('student')
      .eq('examination_room', roomId)

    if (error) throw error
    return data.map(p => p.student)
  },

  /**
   * Récupère les étudiants inscrits à une UE, avec leur groupe et leurs infos.
   */
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

    // Formate les infos des étudiants
    return data.map(p => ({
      student_id: p.student_id,
      group: p.group,
      firstname: p.student?.firstname || '',
      lastname: p.student?.lastname || ''
    }))
  },

  /**
   * Récupère tous les étudiants d'une salle + surveillant actuel + surveillants disponibles.
   * Sert pour afficher les données dans RoomView.
   */
  async getRoomStudentsAndSupervisor(sessionLabel, ue, eventLabel, roomLabel) {
    const sessionCompoId = await this.getSessionCompoId(sessionLabel, ue)
    const eventId = await this.getEventId(sessionCompoId, eventLabel)
    const examRoom = await this.getExaminationRoom(eventId, roomLabel)

    const [presentIds, allStudents] = await Promise.all([
      this.getPresentStudentIds(examRoom.id),
      this.getStudentsForUE(ue)
    ])

    // Ajoute un indicateur de présence à chaque étudiant
    const students = allStudents.map(s => ({
      ...s,
      isPresent: presentIds.includes(s.student_id)
    }))

    // Récupère tous les surveillants possibles (trigrammes)
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

  /**
   * Met à jour le surveillant d'une salle pour une épreuve donnée.
   */
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

  /**
   * Bascule la présence d’un étudiant dans une salle :
   * - s'il est présent : on le supprime
   * - s'il est absent : on l’ajoute
   */
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
