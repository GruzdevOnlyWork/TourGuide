'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { LogIn, LogOut, UserCircle, Menu, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import type { SidebarPanelsProps } from './SidebarPanels';
import { doc, getDoc } from 'firebase/firestore';
import { firestoreDb } from '@/lib/firebase';
import { ThemeToggle } from '../ui/ThemeToggle';

interface MobileSidebarContentProps
  extends Pick<
    SidebarPanelsProps,
    | 'selectedPoi'
    | 'setSelectedPoi'
    | 'currentRoutePois'
    | 'setCurrentRoutePois'
    | 'setActiveRouteOnMap'
    | 'allPois'
  > {}

interface NavbarProps {
  MobileSidebarContent?: React.ComponentType<MobileSidebarContentProps>;
  mobileSidebarProps?: MobileSidebarContentProps;
}

interface ExtendedUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  username?: string;
}

export function Navbar({ MobileSidebarContent, mobileSidebarProps }: NavbarProps) {
  const { user: firebaseUser, logout, isLoading } = useAuth();
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    async function fetchUsername() {
      if (!firebaseUser) {
        setUser(null);
        return;
      }
      try {
        const docRef = doc(firestoreDb, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            username: docSnap.data().username,
          });
        } else {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
          });
        }
      } catch {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        });
      }
    }
    fetchUsername();
  }, [firebaseUser]);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          {isMobile && MobileSidebarContent && mobileSidebarProps && (
            <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2 md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Открыть меню</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0">
                <MobileSidebarContent {...mobileSidebarProps} />
              </SheetContent>
            </Sheet>
          )}
          <div className="flex items-center">
            <Globe className="h-7 w-7 text-primary" />
            <h1 className="ml-2 text-2xl font-bold text-primary">Путеводитель по Бую</h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            {isLoading ? (
              <div className="h-8 w-20 animate-pulse rounded-md bg-muted"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5" />
                    {user.username ?? user.displayName ?? user.email ?? 'Пользователь'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" onClick={() => setAuthModalOpen(true)}>
                <LogIn className="mr-2 h-4 w-4" /> Войти
              </Button>
            )}
          </div>
          <ThemeToggle/>
        </div>
      </nav>
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
}
