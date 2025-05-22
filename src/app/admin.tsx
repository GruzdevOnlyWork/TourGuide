'use client';

import { AdminOnly } from "@/components/auth/AdminOnly";
import { AddPointOfInterestForm } from "@/components/poi/PoiAdd";



export default function AdminPage() {
  return (
    <AdminOnly>
      <AddPointOfInterestForm />
    </AdminOnly>
  );
}
