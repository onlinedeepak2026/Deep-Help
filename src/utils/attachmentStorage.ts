import { ItemAttachmentData, AttachedNote, AttachedPhoto } from '../types/attachments';

const STORAGE_KEY = 'deephelp_item_attachments';

/**
 * Loads all attachments map from localStorage
 */
export function getAllAttachments(): Record<string, ItemAttachmentData> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('Failed to parse attachments from localStorage', err);
    return {};
  }
}

/**
 * Gets attachments for a specific target ID (Formula, IS Code, etc.)
 */
export function getItemAttachments(targetId: string): ItemAttachmentData {
  const all = getAllAttachments();
  return (
    all[targetId] || {
      targetId,
      targetType: 'general',
      targetTitle: '',
      notes: [],
      photos: [],
    }
  );
}

/**
 * Adds a text note to an item
 */
export function addNoteToItem(
  targetId: string,
  targetType: ItemAttachmentData['targetType'],
  targetTitle: string,
  text: string,
  author: string = 'User'
): ItemAttachmentData {
  const all = getAllAttachments();
  const current = all[targetId] || {
    targetId,
    targetType,
    targetTitle,
    notes: [],
    photos: [],
  };

  const newNote: AttachedNote = {
    id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    text: text.trim(),
    author: author.trim() || 'Site Engineer',
    addedAt: Date.now(),
  };

  const updated: ItemAttachmentData = {
    ...current,
    targetTitle: targetTitle || current.targetTitle,
    targetType: targetType || current.targetType,
    notes: [newNote, ...current.notes],
  };

  all[targetId] = updated;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to save note to localStorage', e);
  }
  return updated;
}

/**
 * Adds a photo to an item
 */
export function addPhotoToItem(
  targetId: string,
  targetType: ItemAttachmentData['targetType'],
  targetTitle: string,
  photoUrl: string,
  photoName: string,
  caption?: string
): ItemAttachmentData {
  const all = getAllAttachments();
  const current = all[targetId] || {
    targetId,
    targetType,
    targetTitle,
    notes: [],
    photos: [],
  };

  const newPhoto: AttachedPhoto = {
    id: `photo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    url: photoUrl,
    name: photoName || 'civil_site_photo.jpg',
    caption: caption?.trim(),
    addedAt: Date.now(),
  };

  const updated: ItemAttachmentData = {
    ...current,
    targetTitle: targetTitle || current.targetTitle,
    targetType: targetType || current.targetType,
    photos: [newPhoto, ...current.photos],
  };

  all[targetId] = updated;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to save photo to localStorage', e);
  }
  return updated;
}

/**
 * Deletes a note from an item
 */
export function deleteNoteFromItem(targetId: string, noteId: string): ItemAttachmentData {
  const all = getAllAttachments();
  if (!all[targetId]) return getItemAttachments(targetId);

  const current = all[targetId];
  const updated: ItemAttachmentData = {
    ...current,
    notes: current.notes.filter((n) => n.id !== noteId),
  };

  all[targetId] = updated;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to update localStorage', e);
  }
  return updated;
}

/**
 * Deletes a photo from an item
 */
export function deletePhotoFromItem(targetId: string, photoId: string): ItemAttachmentData {
  const all = getAllAttachments();
  if (!all[targetId]) return getItemAttachments(targetId);

  const current = all[targetId];
  const updated: ItemAttachmentData = {
    ...current,
    photos: current.photos.filter((p) => p.id !== photoId),
  };

  all[targetId] = updated;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to update localStorage', e);
  }
  return updated;
}

/**
 * Compresses an image file using Canvas to optimize memory and enable unlimited uploads
 */
export function compressImageFile(file: File, maxDim = 1000, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Invalid image file format'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('File reading error'));
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) {
        reject(new Error('Empty file'));
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error('Image decode error'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(src);
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}
