'use client';

import { useState, FormEvent, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestoreDb } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';

export function AddPointOfInterestForm() {
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Конвертация файла в Base64
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') resolve(reader.result);
        else reject('Ошибка конвертации');
      };
      reader.onerror = (error) => reject(error);
    });

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(photoFile);
  }, [photoFile]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      setMessage('Требуется авторизация');
      return;
    }
    if (!title.trim() || !description.trim()) {
      setMessage('Заполните название и описание');
      return;
    }
    if (!latitude || !longitude) {
      setMessage('Введите координаты');
      return;
    }
    setLoading(true);
    setMessage('');

    try {
      let photoBase64 = null;
      if (photoFile) {
        photoBase64 = await fileToBase64(photoFile);
      }

      await addDoc(collection(firestoreDb, 'point_of_interests'), {
        name: title.trim(),
        description: description.trim(),
        latitude: Number(latitude),
        longitude: Number(longitude),
        main_photo_base64: photoBase64,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
      });

      setMessage('Достопримечательность добавлена!');
      setTitle('');
      setDescription('');
      setLatitude('');
      setLongitude('');
      setPhotoFile(null);
      setPhotoPreview(null);
    } catch (error) {
      console.error('Ошибка добавления POI:', error);
      setMessage('Ошибка при добавлении.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 border rounded bg-card text-card-foreground dark:bg-card-dark dark:text-card-foreground-dark"
    >
      <h2 className="text-xl mb-4">Добавить достопримечательность</h2>

      <input
        type="text"
        placeholder="Название"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full mb-2 p-2 border rounded bg-input text-input-foreground dark:bg-input-dark dark:text-input-foreground-dark"
      />

      <textarea
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="w-full mb-2 p-2 border rounded bg-input text-input-foreground dark:bg-input-dark dark:text-input-foreground-dark"
      />

      <input
        type="number"
        step="any"
        placeholder="Широта"
        value={latitude}
        onChange={(e) => setLatitude(e.target.value)}
        required
        className="w-full mb-2 p-2 border rounded bg-input text-input-foreground dark:bg-input-dark dark:text-input-foreground-dark"
        min={-90}
        max={90}
      />

      <input
        type="number"
        step="any"
        placeholder="Долгота"
        value={longitude}
        onChange={(e) => setLongitude(e.target.value)}
        required
        className="w-full mb-2 p-2 border rounded bg-input text-input-foreground dark:bg-input-dark dark:text-input-foreground-dark"
        min={-180}
        max={180}
      />

      <label className="block mb-2">
        Основное фото:
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setPhotoFile(e.target.files[0]);
            }
          }}
          className="mt-1"
        />
      </label>

      {photoPreview && (
        <div className="mb-2">
          <img
            src={photoPreview}
            alt="Превью фото"
            className="max-h-48 rounded object-cover border"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-white px-4 py-2 rounded w-full hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? 'Добавление...' : 'Добавить'}
      </button>

      {message && <p className="mt-2 text-center">{message}</p>}
    </form>
  );
}
