
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
  photos?: Photo[]; // Photos might not be present initially or if none exist
}

export interface Photo {
  id: string;
  poiId: string; // Should match Firestore field: poi_id
  url: string;
  uploadedBy: string; // Should match Firestore field: uploaded_by
  uploadedAt: string | Date | Timestamp; // Can be Firestore Timestamp, Date object, or ISO string after conversion
  likes: number;
}

export interface User {
  id: string;
  username: string;
  // email?: string; // Add if needed for more complex auth
}

// Keeping Route type simple for now, assumes client-side building
export interface Route {
  id: string; // Could be generated client-side
  name: string;
  poiIds: string[]; // Ordered list of PointOfInterest IDs
}

// If storing routes in Firestore:
export interface FirestoreRoute {
  id?: string; // Firestore generates ID
  name?: string;
  user_id: string;
  created_at: Timestamp;
  poi_ids: string[]; // Array of POI IDs
}
