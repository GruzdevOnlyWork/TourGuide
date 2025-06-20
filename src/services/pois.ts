// src/services/pois.ts
import {
  collection,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { firestoreDb } from "@/lib/firebase";

export async function addPointOfInterest(poiData: {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  category: string;
  address: string;
  opening_hours: string;
  rating?: number;
  website?: string;
  tags: string[];
  main_photo_url: string;
}) {
  const docRef = await addDoc(collection(firestoreDb, "point_of_interests"), {
    ...poiData,
    rating: poiData.rating || null,
    website: poiData.website || null,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
  return docRef.id;
}


export async function getPoisByCategory(category: string) {
  const poisRef = collection(firestoreDb, "point_of_interests");
  const q = query(poisRef, where("category", "==", category));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addPhotoToPoi(poiId: string, photoData: {
  url: string;
  uploaded_by: string;
  description?: string;
  likes_count?: number;
}) {
  await addDoc(collection(firestoreDb, "point_of_interests", poiId, "photos"), {
    ...photoData,
    description: photoData.description || null,
    likes_count: photoData.likes_count || 0,
    uploaded_at: serverTimestamp(),
  });
}

export async function addLikeToPhoto(poiId: string, photoId: string, userId: string) {
  await setDoc(doc(firestoreDb, "point_of_interests", poiId, "photos", photoId, "likes", userId), {
    created_at: serverTimestamp(),
  });
}
