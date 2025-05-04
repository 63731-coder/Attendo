// src/services/sessionsService.js

import { supabase } from "@/supabase"; // Assure-toi que ce fichier existe et est bien configuré

// Fonction pour récupérer toutes les sessions
export async function getSessions() {
  const { data, error } = await supabase
    .from("session")
    .select("*")

  if (error) {
    console.error("Erreur lors du chargement des sessions :", error)
    throw error
  }

  return data
}

// Fonction pour ajouter une nouvelle session
export async function addSession(label) {
  const { data, error } = await supabase
    .from("session")
    .insert([{ label }])

  if (error) {
    console.error("Erreur lors de l'ajout de la session :", error)
    throw error
  }

  return data
}
