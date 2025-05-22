
'use client';

import { YMaps } from '@pbe/react-yandex-maps';
import type { ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const YANDEX_MAPS_API_KEY = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;

interface YandexMapWrapperProps {
  children: ReactNode;
}

export function YandexMapWrapper({ children }: YandexMapWrapperProps) {
  if (!YANDEX_MAPS_API_KEY) {
    return (
      <div className="flex h-full items-center justify-center bg-muted p-4">
        <Alert variant="destructive" className="w-full max-w-md">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Ошибка конфигурации</AlertTitle>
          <AlertDescription>
            API ключ Яндекс.Карт отсутствует. Пожалуйста, установите переменную окружения NEXT_PUBLIC_YANDEX_MAPS_API_KEY.
            Функционал карт будет недоступен до тех пор, пока это не будет настроено.
            Вы можете получить ключ в <a href="https://developer.tech.yandex.ru/services/" target="_blank" rel="noopener noreferrer" className="underline">Кабинете Разработчика Яндекса</a>.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <YMaps query={{ apikey: YANDEX_MAPS_API_KEY }}>{children}</YMaps>;
}
