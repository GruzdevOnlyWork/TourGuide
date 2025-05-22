import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

interface AdminOnlyProps {
  children: ReactNode;
}

export function AdminOnly({ children }: AdminOnlyProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <p>Загрузка...</p>;

  if (user?.role === "admin") {
    return <>{children}</>;
  }


}
