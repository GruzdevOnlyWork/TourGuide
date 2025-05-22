// src/services/routes.ts
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firestoreDb } from "@/lib/firebase";

export async function addRoute(routeData: {
  name: string;
  user_id: string;
  description: string;
  poi_ids: string[];
  total_distance?: number;
  estimated_time?: number;
}) {
  await addDoc(collection(firestoreDb, "routes"), {
    name: routeData.name,
    user_id: routeData.user_id,
    description: routeData.description,
    poi_ids: routeData.poi_ids,
    total_distance: routeData.total_distance || null,
    estimated_time: routeData.estimated_time || null,
    created_at: serverTimestamp(),
  });
}
