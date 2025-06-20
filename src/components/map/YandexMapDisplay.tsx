'use client';

import { YMaps, Map, Placemark, Polyline } from '@pbe/react-yandex-maps';
import type { PointOfInterest } from '@/types';
import { DEFAULT_YANDEX_MAP_CENTER, DEFAULT_YANDEX_MAP_ZOOM } from '@/lib/constants';
import { useCallback, useEffect, useState, useMemo } from 'react';

interface MapState {
  center: number[];
  zoom: number;
}

interface YandexMapDisplayProps {
  pois: PointOfInterest[];
  selectedPoi: PointOfInterest | null;
  onPoiSelect: (poi: PointOfInterest) => void;
  routePois?: PointOfInterest[];
  center?: number[];
  zoom?: number;
}

export function YandexMapDisplay({
  pois,
  selectedPoi,
  onPoiSelect,
  routePois,
  center: initialCenter,
  zoom: initialZoom,
}: YandexMapDisplayProps) {
  const [mapState, setMapState] = useState<MapState>({
    center: initialCenter || DEFAULT_YANDEX_MAP_CENTER,
    zoom: initialZoom || DEFAULT_YANDEX_MAP_ZOOM,
  });

  useEffect(() => {
    setMapState(prev => ({
      center: initialCenter || prev.center,
      zoom: initialZoom || prev.zoom,
    }));
  }, [initialCenter, initialZoom]);

  const handleMarkerClick = useCallback(
    (poi: PointOfInterest) => {
      onPoiSelect(poi);
    },
    [onPoiSelect]
  );

  const routePath = useMemo(() => routePois?.map(poi => [poi.latitude, poi.longitude]) || [], [routePois]);

  return (
    <YMaps>
      <Map
        defaultState={mapState}
        width="100%"
        height="100%"
        modules={['control.ZoomControl', 'control.FullscreenControl', 'geoObject.addon.balloon']}
        instanceRef={ref => {
          if (ref) {
          }
        }}
      >
        {pois.map(poi => (
          <Placemark
            key={poi.id}
            geometry={[poi.latitude, poi.longitude]}
            onClick={() => handleMarkerClick(poi)}
            properties={{
              balloonContentHeader: poi.name,
              balloonContentBody:
                poi.description.length > 100
                  ? poi.description.substring(0, 100) + '...'
                  : poi.description,
            }}
            options={{
              preset: selectedPoi?.id === poi.id ? 'islands#redDotIcon' : 'islands#blueDotIcon',
            }}
          />
        ))}

        {routePath.length > 1 && (
          <Polyline
            geometry={routePath}
            options={{
              strokeColor: '#FF5722',
              strokeWidth: 4,
              strokeOpacity: 0.8,
            }}
          />
        )}
      </Map>
    </YMaps>
  );
}
