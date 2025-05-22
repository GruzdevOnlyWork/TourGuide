// src/services/photos.ts
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  DocumentData,
} from "firebase/firestore";
import { firestoreDb } from "@/lib/firebase";

export interface PhotoData {
  url: string;
  uploaded_by: string;
  description?: string;
  likes_count?: number;
  uploaded_at?: any;
}

// Добавить фото к достопримечательности (POI)
export async function addPhotoToPoi(
  poiId: string,
  photoData: PhotoData
): Promise<string> {
  const docRef = await addDoc(collection(firestoreDb, "point_of_interests", poiId, "photos"), {
    ...photoData,
    description: photoData.description || null,
    likes_count: photoData.likes_count || 0,
    uploaded_at: serverTimestamp(),
  });
  return docRef.id;
}

// Получить все фото для POI
export async function getPhotosByPoi(poiId: string): Promise<DocumentData[]> {
  const photosRef = collection(firestoreDb, "point_of_interests", poiId, "photos");
  const q = query(photosRef);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Получить фото, загруженные конкретным пользователем (если нужно)
export async function getPhotosByUser(userId: string): Promise<DocumentData[]> {
  const photosRef = collectionGroup(firestoreDb, "photos");
  const q = query(photosRef, where("uploaded_by", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
