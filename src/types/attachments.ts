export interface AttachedPhoto {
  id: string;
  url: string;
  name: string;
  caption?: string;
  addedAt: number;
}

export interface AttachedNote {
  id: string;
  text: string;
  author?: string;
  addedAt: number;
}

export interface ItemAttachmentData {
  targetId: string;
  targetType: 'formula' | 'isCode' | 'note' | 'concept' | 'calculator' | 'general';
  targetTitle: string;
  notes: AttachedNote[];
  photos: AttachedPhoto[];
}
