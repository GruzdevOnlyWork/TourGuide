// src/services/likes.ts
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { firestoreDb } from "@/lib/firebase";

export async function addLikeToPhoto(
  poiId: string,
  photoId: string,
  userId: string
): Promise<void> {
  await setDoc(doc(firestoreDb, "point_of_interests", poiId, "photos", photoId, "likes", userId), {
    created_at: serverTimestamp(),
  });
}


export async function removeLikeFromPhoto(
  poiId: string,
  photoId: string,
  userId: string
): Promise<void> {
  await deleteDoc(doc(firestoreDb, "point_of_interests", poiId, "photos", photoId, "likes", userId));
}

export async function checkUserLikedPhoto(
  poiId: string,
  photoId: string,
  userId: string
): Promise<boolean> {
  const docRef = doc(firestoreDb, "point_of_interests", poiId, "photos", photoId, "likes", userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
}

export async function getLikesCount(
  poiId: string,
  photoId: string
): Promise<number> {
  const likesRef = collection(firestoreDb, "point_of_interests", poiId, "photos", photoId, "likes");
  const snapshot = await getDocs(likesRef);
  return snapshot.size;
}


export async function getUsersWhoLikedPhoto(
  poiId: string,
  photoId: string
): Promise<string[]> {
  const likesRef = collection(firestoreDb, "point_of_interests", poiId, "photos", photoId, "likes");
  const snapshot = await getDocs(likesRef);
  return snapshot.docs.map(doc => doc.id);
}
