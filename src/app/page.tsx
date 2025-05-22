'use client';

import { useState, useEffect } from 'react';
import type { PointOfInterest } from '@/types';
import { firestoreDb } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

import { Navbar } from '@/components/layout/Navbar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { PoiListPanel } from '@/components/poi/PoiListPanel';
import { YandexMapDisplay } from '@/components/map/YandexMapDisplay';
import { RouteBuilderPanel } from '@/components/route/RouteBuilderPanel';
import { PoiDetailsPanel } from '@/components/poi/PoiDetailsPanel';
import { AddPointOfInterestForm } from '@/components/poi/PoiAdd';
import { Footer } from '@/components/layout/footer';
import { AdminOnly } from '@/components/auth/AdminOnly';

export default function LandingPage() {
  const [allPois, setAllPois] = useState<PointOfInterest[]>([]);
  const [selectedPoi, setSelectedPoi] = useState<PointOfInterest | null>(null);
  const [currentRoutePois, setCurrentRoutePois] = useState<PointOfInterest[]>([]);
  const [activeRouteOnMap, setActiveRouteOnMap] = useState<PointOfInterest[] | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchPois() {
      try {
        const querySnapshot = await getDocs(collection(firestoreDb, 'point_of_interests'));
        const pois = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          photos: doc.data().photos || [],
        })) as PointOfInterest[];
        setAllPois(pois);
      } catch (e) {
        toast({
          variant: 'destructive',
          title: 'Ошибка загрузки',
          description: 'Не удалось загрузить достопримечательности.',
        });
      }
    }
    fetchPois();
  }, [toast]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <ThemeToggle />
      <Navbar />

      {/* Первый экран */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-4 max-w-3xl leading-tight">
          Путешествуйте по городу Буй с нашим интерактивным путеводителем
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mb-8">
          Откройте для себя лучшие достопримечательности, стройте маршруты и делитесь впечатлениями.
        </p>
        <button
          onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
          className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold shadow-lg hover:bg-accent transition"
        >
          Начать исследовать
        </button>
      </section>

      {/* Блок достопримечательностей */}
      <section id="pois" className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-6">Достопримечательности Буя</h2>
        <PoiListPanel pois={allPois} onSelectPoi={setSelectedPoi} />
      </section>

      {/* Карта и планировщик маршрутов */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-[500px] rounded-2xl overflow-hidden shadow-lg">
          <YandexMapDisplay
            pois={allPois}
            selectedPoi={selectedPoi}
            onPoiSelect={setSelectedPoi}
            routePois={activeRouteOnMap ?? currentRoutePois}
          />
        </div>
        <div className="flex flex-col gap-8">
          <RouteBuilderPanel
            allPois={allPois}
            currentRoutePois={currentRoutePois}
            setCurrentRoutePois={setCurrentRoutePois}
            onShowRouteOnMap={() => setActiveRouteOnMap(currentRoutePois)}
            onViewPoiOnMap={setSelectedPoi}
          />
          {selectedPoi && (
            <PoiDetailsPanel poi={selectedPoi} onBack={() => setSelectedPoi(null)} />
          )}
        </div>
      </section>

      <AdminOnly>
        <section className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold mb-6">Добавить новую достопримечательность</h2>
          <AddPointOfInterestForm />
        </section>
      </AdminOnly>

      {/* Футер */}
      <Footer />
    </div>
  );
}
