// src/services/users.ts
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { firestoreDb } from "@/lib/firebase";

export async function createUser(uid: string, username: string, email?: string, profilePictureUrl?: string) {
  await setDoc(doc(firestoreDb, "users", uid), {
    username,
    email: email || null,
    profile_picture_url: profilePictureUrl || null,
    created_at: serverTimestamp(),
  });
}
