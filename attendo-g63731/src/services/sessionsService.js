import { supabase } from "@/supabase";

/**
 * Récupère la liste de toutes les sessions depuis la base de données.
 * Chaque session contient un label (ex : janvier, juin...).
 */
export async function getSessions() {
  const { data, error } = await supabase
    .from("session")
    .select("*") // Récupère toutes les colonnes de la table session

  if (error) {
    console.error("Erreur lors du chargement des sessions :", error)
    throw error
  }

  return data // Retourne la liste des sessions
}

/**
 * Ajoute une nouvelle session à la base de données, avec le label fourni.
 * Exemple : addSession("janvier")
 */
export async function addSession(label) {
  const { data, error } = await supabase
    .from("session")
    .insert([{ label }]) // Insère une nouvelle ligne avec le label donné

  if (error) {
    console.error("Erreur lors de l'ajout de la session :", error)
    throw error
  }

  return data // Retourne la session ajoutée
}
