'use client';

import Slider from 'react-slick';
import type { PointOfInterest } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MapPin, Info } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface PoiListPanelProps {
  pois: PointOfInterest[];
  onSelectPoi: (poi: PointOfInterest) => void;
}

export function PoiListPanel({ pois, onSelectPoi }: PoiListPanelProps) {
    const settings = {
    dots: true,
    infinite: pois.length > 3,
    speed: 500,
    slidesToShow: Math.min(pois.length, 3),
    slidesToScroll: 1,
    arrows: true,
    variableWidth: false, 
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(pois.length, 2),
          arrows: true,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 375,
        settings: {
          slidesToShow: 1,
          arrows: false,
          dots: true,
        },
      },
    ],
  };

  return (
    <Card className="h-full flex flex-col border-0 shadow-lg rounded-2xl bg-card text-card-foreground">
      <CardHeader className="flex-shrink-0 px-6 py-4">
        <CardTitle className="text-3xl font-extrabold text-primary flex items-center gap-3">
          <MapPin className="h-8 w-8" /> Достопримечательности
        </CardTitle>
        <CardDescription className="text-muted-foreground mt-1">
          Откройте для себя лучшие места
        </CardDescription>
      </CardHeader>
      <div className="flex-grow px-6 pb-6">
        {pois.length > 0 ? (
          <Slider {...settings} className="poi-slider w-full">
            {pois.map((poi) => (
              <div key={poi.id} className="px-2 min-w-[280px]">
                <Card
                  className="overflow-hidden rounded-xl shadow-md cursor-pointer hover:shadow-xl transition flex flex-col h-full"
                  onClick={() => onSelectPoi(poi)}
                >
                  {poi.main_photo_base64 ? (
                    <div className="h-48 w-full relative bg-muted">
                      <Image
                        src={poi.main_photo_base64}
                        alt={`Фото ${poi.name}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 400px"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="h-48 w-full bg-muted flex items-center justify-center text-muted-foreground">
                      <MapPin className="h-12 w-12 opacity-50" />
                    </div>
                  )}
                  <CardHeader className="px-4 py-3">
                    <CardTitle className="text-xl font-semibold">{poi.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0 flex-grow">
                    <p className="text-muted-foreground line-clamp-3">{poi.description}</p>
                  </CardContent>
                  <CardFooter className="px-4 pb-4 pt-0">
                    <Link href={`/pois/${poi.id}`} onClick={e => e.stopPropagation()} className="w-full">
                      <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-2">
                        <Info className="h-5 w-5" /> Подробнее
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </Slider>
        ) : (
          <p className="text-muted-foreground text-center py-10">Достопримечательности не найдены.</p>
        )}
      </div>
    </Card>
  );
}
