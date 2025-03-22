export interface Chat {
  id: number;
  messages: Message[];
  name: string;
  type: string;
}

interface Message {
  id: number;
  type: string;
  date: Date; // TODO: convert to Date type
  edited: string | null;
  from: string | null;
  fromId: string | null;
  forwardedFrom: string | null;
  savedFrom: string | null;
  replyToMessageId: number | null;

  photo: string | null;
  photoFileSize: number | null;

  actor: string | null;
  actorId: string | null;
  action: string | null;

  file: string | null;
  fileName: string | null;
  fileSize: number | null;
  thumbnail: string | null;
  thumbnailFileSize: number | null;
  mediaType: string | null;
  performer: string | null;
  title: string | null;
  stickerEmoji: string | null;
  mimeType: string | null;
  durationSeconds: number | null;
  width: number | null;
  height: number | null;

  text: string;
  // textEntities: TextEntity[];
  reactions: Reaction[] | null;
}

interface Reaction {
  count: number;
  documentId: string | null;
  emoji: string | null;
  recent: Recent[] | null;
  type: EmojiType;
}

interface Recent {
  date: string | null;
  from: string | null;
  fromId: string | null;
}

interface TextEntity {
  collapsed: boolean | null;
  documentId: string | null;
  href: string | null;
  text: string | null;
  type: string | null;
}

// Assuming EmojiType is an enum or a string type in TypeScript
type EmojiType = string; // or define an enum if you have specific values
