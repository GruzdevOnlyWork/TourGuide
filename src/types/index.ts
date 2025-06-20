
import type { Timestamp } from 'firebase/firestore'; // Import if using Firestore Timestamps directly
import { ReactNode } from 'react';

export interface PointOfInterest {
  title: ReactNode;
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  main_photo_base64?: string; 
  photos?: Photo[]; 
}

export interface Photo {
  id: string;
  poiId: string;
  url: string;
  uploadedBy: string; 
  uploadedAt: string | Date | Timestamp;
  likes: number;
}

export interface User {
  id: string;
  username: string;
}


export interface Route {
  id: string;
  name: string;
  poiIds: string[]; 
}


export interface FirestoreRoute {
  id?: string; 
  name?: string;
  user_id: string;
  created_at: Timestamp;
  poi_ids: string[]; 
}
