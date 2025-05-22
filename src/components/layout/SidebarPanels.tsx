'use client';

import type { PointOfInterest } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PoiListPanel } from '@/components/poi/PoiListPanel';
import { RouteBuilderPanel } from '@/components/route/RouteBuilderPanel';

import { useState, useEffect } from 'react';
import { MapPin, Route, Info } from 'lucide-react';
import { AdminOnly } from '../auth/AdminOnly';
import { AddPointOfInterestForm } from '../poi/PoiAdd';

export interface SidebarPanelsProps {
  allPois: PointOfInterest[];
  selectedPoi: PointOfInterest | null;
  setSelectedPoi: (poi: PointOfInterest | null) => void;
  currentRoutePois: PointOfInterest[];
  setCurrentRoutePois: (pois: PointOfInterest[]) => void;
  setActiveRouteOnMap: (pois: PointOfInterest[]) => void; // To show full route on map
}

export function SidebarPanels({
  allPois,
  selectedPoi,
  setSelectedPoi,
  currentRoutePois,
  setCurrentRoutePois,
  setActiveRouteOnMap,
}: SidebarPanelsProps) {
  const [activeTab, setActiveTab] = useState('pois');

  useEffect(() => {
    if (selectedPoi) {
      setActiveTab('details');
    }
  }, [selectedPoi]);

  const handleSelectPoiFromList = (poi: PointOfInterest) => {
    setSelectedPoi(poi);
    // setActiveTab('details'); // useEffect above handles this
  };
  
  const handleBackFromDetails = () => {
    setSelectedPoi(null);
    setActiveTab('pois'); // Go back to POI list
  };

  const handleShowRouteOnMap = () => {
    setActiveRouteOnMap(currentRoutePois);
  };
  
  const handleViewPoiOnMap = (poi: PointOfInterest) => {
    setSelectedPoi(poi); // This will also trigger map recenter via page.tsx logic
  };

  return (
    <div className="flex flex-col h-full bg-card">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-grow">
        <TabsList className="grid w-full grid-cols-3 sticky top-0 bg-card z-10 rounded-none border-b">
          <TabsTrigger value="pois" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none">
            <MapPin className="mr-1 h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Места</span>
          </TabsTrigger>
          <TabsTrigger value="route" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none">
            <Route className="mr-1 h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Маршрут</span>
          </TabsTrigger>
          <TabsTrigger value="details" disabled={!selectedPoi} className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none">
            <Info className="mr-1 h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Детали</span>
          </TabsTrigger>
        </TabsList>
        <AdminOnly>
          <AddPointOfInterestForm />
        </AdminOnly>
        <div className="flex-grow overflow-y-auto">
          <TabsContent value="pois" className="h-full mt-0">
            <PoiListPanel pois={allPois} onSelectPoi={handleSelectPoiFromList} />
          </TabsContent>
          <TabsContent value="route" className="h-full mt-0">
            <RouteBuilderPanel
              allPois={allPois}
              currentRoutePois={currentRoutePois}
              setCurrentRoutePois={setCurrentRoutePois}
              onShowRouteOnMap={handleShowRouteOnMap}
              onViewPoiOnMap={handleViewPoiOnMap}
            />
          </TabsContent>

              
        </div>
      </Tabs>
    </div>
  );
}
