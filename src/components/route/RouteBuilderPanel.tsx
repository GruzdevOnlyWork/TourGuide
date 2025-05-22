'use client';

import type { PointOfInterest } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Route as RouteIcon, Trash2, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';

interface RouteBuilderPanelProps {
  allPois: PointOfInterest[];
  currentRoutePois: PointOfInterest[];
  setCurrentRoutePois: (pois: PointOfInterest[]) => void;
  onShowRouteOnMap: () => void;
  onViewPoiOnMap: (poi: PointOfInterest) => void;
}

export function RouteBuilderPanel({
  allPois,
  currentRoutePois,
  setCurrentRoutePois,
  onShowRouteOnMap,
  onViewPoiOnMap,
}: RouteBuilderPanelProps) {
  const { toast } = useToast();
  const [selectedPoiIds, setSelectedPoiIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSelectedPoiIds(new Set(currentRoutePois.map((p) => p.id)));
  }, [currentRoutePois]);

  const handlePoiToggle = (poi: PointOfInterest) => {
    const newSelectedPoiIds = new Set(selectedPoiIds);
    let newRoutePois: PointOfInterest[];

    if (newSelectedPoiIds.has(poi.id)) {
      newSelectedPoiIds.delete(poi.id);
      newRoutePois = currentRoutePois.filter((p) => p.id !== poi.id);
    } else {
      newSelectedPoiIds.add(poi.id);
      newRoutePois = [...currentRoutePois, poi];
    }
    setSelectedPoiIds(newSelectedPoiIds);
    setCurrentRoutePois(newRoutePois);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(currentRoutePois);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setCurrentRoutePois(items);
  };

  const handleShowRoute = () => {
    if (currentRoutePois.length < 2) {
      toast({
        title: 'Недостаточно точек',
        description: 'Пожалуйста, выберите как минимум две точки для создания маршрута.',
        variant: 'default',
      });
      return;
    }
    onShowRouteOnMap();
    toast({
      title: 'Маршрут обновлен',
      description: 'Маршрут отображается на карте.',
    });
  };

  const clearRoute = () => {
    setCurrentRoutePois([]);
    setSelectedPoiIds(new Set());
    toast({ description: 'Маршрут очищен.' });
  };

  return (
    <Card className="h-full flex flex-col border-0 shadow-lg rounded-2xl bg-card text-card-foreground">
      <CardHeader className="flex-shrink-0 px-6 py-4">
        <CardTitle className="text-3xl font-extrabold text-primary flex items-center gap-3">
          <RouteIcon className="h-8 w-8" /> Планировщик маршрутов
        </CardTitle>
        <CardDescription className="text-muted-foreground mt-1">
          Выберите достопримечательности для маршрута
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col pt-0 px-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Доступные достопримечательности</h3>
          <ScrollArea className="h-64 border rounded-lg p-3 bg-background">
            <div className="space-y-3">
              {allPois.map((poi) => (
                <div
                  key={poi.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={`poi-${poi.id}`}
                      checked={selectedPoiIds.has(poi.id)}
                      onCheckedChange={() => handlePoiToggle(poi)}
                    />
                    <Label htmlFor={`poi-${poi.id}`} className="cursor-pointer select-none">
                      {poi.name}
                    </Label>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onViewPoiOnMap(poi)}
                    title={`Показать ${poi.name} на карте`}
                  >
                    <Eye className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <Separator className="my-6" />

        <div className="flex-grow flex flex-col">
          <h3 className="text-xl font-semibold mb-3">Текущий маршрут</h3>
          {currentRoutePois.length > 0 ? (
            <>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="routePois">
                  {(provided) => (
                    <ScrollArea
                      className="h-40 border rounded-lg p-3 mb-4 bg-background"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      <ul className="space-y-2">
                        {currentRoutePois.map((poi, index) => (
                          <Draggable key={poi.id} draggableId={poi.id} index={index}>
                            {(provided, snapshot) => (
                              <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`flex items-center justify-between p-2 rounded-md bg-secondary text-sm cursor-move select-none ${
                                  snapshot.isDragging ? 'shadow-lg bg-primary/80' : ''
                                }`}
                              >
                                <span>
                                  {index + 1}. {poi.name}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-destructive hover:text-destructive"
                                  onClick={() => handlePoiToggle(poi)}
                                  aria-label={`Удалить ${poi.name} из маршрута`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </li>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </ul>
                    </ScrollArea>
                  )}
                </Droppable>
              </DragDropContext>
              <div className="flex gap-4">
                <Button onClick={handleShowRoute} className="flex-1 bg-primary hover:bg-accent transition">
                  <RouteIcon className="mr-2 h-5 w-5" /> Показать маршрут на карте
                </Button>
                <Button variant="outline" onClick={clearRoute} title="Очистить маршрут">
                  <Trash2 className="h-6 w-6" />
                </Button>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-center mt-auto">
              Выберите точки для маршрута
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
