'use client';

import type { PointOfInterest, Photo } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useState, type FormEvent, useEffect, useCallback } from 'react';
import {
  UploadCloud,
  Heart,
  Calendar,
  ThumbsUp,
  ArrowLeft,
  Image as ImageIcon,
  User,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { firestoreDb } from '@/lib/firebase';
import {
  collection,
  query,
  getDocs,
  serverTimestamp,
  addDoc,
  Timestamp,
} from 'firebase/firestore';

interface PoiDetailsPanelProps {
  poi: PointOfInterest;
  onBack?: () => void;
}

const ensureDate = (dateValue: string | Date | Timestamp): Date => {
  if (dateValue instanceof Timestamp) return dateValue.toDate();
  if (dateValue instanceof Date) return dateValue;
  return new Date(dateValue);
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject('Ошибка конвертации файла');
    };
    reader.onerror = (error) => reject(error);
  });
}

export function PoiDetailsPanel({ poi, onBack }: PoiDetailsPanelProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);
  const [sortOrder, setSortOrder] = useState<'recency' | 'popularity'>('recency');
  const [isUploading, setIsUploading] = useState(false);

  const fetchPhotos = useCallback(async () => {
    if (!poi?.id) return;
    setIsLoadingPhotos(true);
    try {
      const photosCollectionRef = collection(firestoreDb, 'point_of_interests', poi.id, 'photos');
      const q = query(photosCollectionRef);
      const querySnapshot = await getDocs(q);
      const fetchedPhotos = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          poiId: poi.id,
          url: data.url,
          uploadedBy: data.uploaded_by,
          uploadedAt: ensureDate(data.uploaded_at),
          likes: data.likes_count || 0,
          description: data.description || '',
        } as Photo;
      });
      setPhotos(fetchedPhotos);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка загрузки фото',
        description: 'Не удалось загрузить фотографии для этого места.',
      });
      setPhotos([]);
    } finally {
      setIsLoadingPhotos(false);
    }
  }, [poi?.id, toast]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handlePhotoUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      toast({
        title: 'Ошибка',
        description: 'Требуется авторизация',
        variant: 'destructive',
      });
      return;
    }

    const formData = new FormData(event.currentTarget);
    const file = formData.get('photo') as File;

    if (!file || file.size === 0) {
      toast({
        title: 'Ошибка загрузки',
        description: 'Пожалуйста, выберите файл для загрузки.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    try {
      const base64String = await fileToBase64(file);

      const photosCollectionRef = collection(firestoreDb, 'point_of_interests', poi.id, 'photos');
      await addDoc(photosCollectionRef, {
        url: base64String,
        uploaded_by: user.username || user.email || 'Аноним',
        uploaded_at: serverTimestamp(),
        likes_count: 0,
        description: '',
      });

      toast({
        title: 'Фото загружено!',
        description: `Файл ${file.name} успешно добавлен.`,
      });

      await fetchPhotos();

      event.currentTarget.reset();
    } catch (error) {
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить фото. Попробуйте позже.',
        variant: 'destructive',
      });
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleLike = (photoId: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, likes: p.likes + 1 } : p))
    );
    toast({ description: 'Вам понравилось фото!' });
  };

  const sortedPhotos = [...photos].sort((a, b) => {
    if (sortOrder === 'recency') {
      return ensureDate(b.uploadedAt).getTime() - ensureDate(a.uploadedAt).getTime();
    } else {
      return b.likes - a.likes;
    }
  });

  return (
    <Card className="h-full flex flex-col border-0 shadow-none rounded-none bg-card text-card-foreground dark:bg-card-dark dark:text-card-foreground-dark">
      <CardHeader className="flex-shrink-0">
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mb-2 self-start -ml-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Назад
          </Button>
        )}
        <CardTitle className="text-2xl text-primary">{poi.name}</CardTitle>
        <CardDescription>{poi.description}</CardDescription>
      </CardHeader>

      <ScrollArea className="flex-grow">
        <CardContent className="pt-0">
          <Separator className="my-4" />
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-accent" />
                Фотогалерея
              </h3>
              <div className="flex gap-2 mb-3">
                <Button
                  variant={sortOrder === 'recency' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortOrder('recency')}
                >
                  По дате
                </Button>
                <Button
                  variant={sortOrder === 'popularity' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortOrder('popularity')}
                >
                  Популярные
                </Button>
              </div>

              {isLoadingPhotos ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="h-48 w-full bg-gray-200 animate-pulse rounded" />
                  <div className="h-48 w-full bg-gray-200 animate-pulse rounded" />
                </div>
              ) : sortedPhotos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sortedPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="group relative rounded-lg overflow-hidden shadow-md"
                    >
                      <Image
                        src={photo.url}
                        alt={`Фото для ${poi.name} от ${photo.uploadedBy}`}
                        width={300}
                        height={200}
                        className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105 bg-muted dark:bg-muted-dark"
                        unoptimized
                        onError={(e) => {
                          e.currentTarget.src = 'https://picsum.photos/300/200?grayscale';
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="text-xs flex items-center gap-1">
                          <User className="h-3 w-3" /> {photo.uploadedBy || 'Аноним'}
                        </div>
                        <div className="text-xs flex items-center gap-1">
                          <Calendar className="h-3 w-3" />{' '}
                          {photo.uploadedAt
                            ? ensureDate(photo.uploadedAt).toLocaleDateString()
                            : 'Неизвестно'}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          {user && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 h-auto text-white hover:bg-white/20"
                              onClick={() => handleLike(photo.id)}
                            >
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground dark:text-muted-foreground-dark">
                  Фотографий для этого места пока нет.
                </p>
              )}
            </div>

            {user && (
              <div>
                <Separator className="my-6" />
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <UploadCloud className="h-5 w-5 text-accent" />
                  Загрузить ваше фото
                </h3>
                <form onSubmit={handlePhotoUpload} className="space-y-3">
                  <div>
                    <Label htmlFor="photo-upload" className="sr-only">
                      Выберите фото
                    </Label>
                    <input
                      id="photo-upload"
                      name="photo"
                      type="file"
                      accept="image/*"
                      required
                      disabled={isUploading}
                      className="w-full p-2 border rounded bg-input text-input-foreground dark:bg-input-dark dark:text-input-foreground-dark"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <UploadCloud className="mr-2 h-4 w-4" />
                    )}
                    Загрузить фото
                  </Button>
                </form>
              </div>
            )}
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
