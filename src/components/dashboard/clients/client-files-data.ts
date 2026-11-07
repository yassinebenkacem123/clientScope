import type { ClientRecord } from "./clients-data";

export const FILE_KINDS = {
  image: "Image", document: "Document", spreadsheet: "Spreadsheet", presentation: "Presentation",
  archive: "Archive", audio: "Audio", video: "Video", other: "File",
} as const;
export type ClientFileKind = keyof typeof FILE_KINDS;
export type ClientFileRecord = {
  id: string;
  clientId: string;
  name: string;
  kind: ClientFileKind;
  status: "requested" | "uploaded";
  requestedAt?: string;
  requestedName?: string;
  uploadedAt?: string;
  description: string;
  file?: File;
};

export const MAX_CLIENT_FILE_BYTES = 25 * 1024 * 1024;
const extensions: Record<ClientFileKind, string[]> = {
  image: ["png", "jpg", "jpeg", "gif", "webp", "svg", "avif", "heic", "bmp", "tif", "tiff"],
  document: ["pdf", "doc", "docx", "txt", "rtf", "odt", "md"],
  spreadsheet: ["xls", "xlsx", "csv", "ods", "tsv"],
  presentation: ["ppt", "pptx", "odp", "key"],
  archive: ["zip", "rar", "7z", "tar", "gz"],
  audio: ["mp3", "wav", "ogg", "m4a", "flac", "aac"],
  video: ["mp4", "mov", "webm", "avi", "mkv", "m4v"],
  other: [],
};

export function detectFileKind(name: string, mimeType = ""): ClientFileKind {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.startsWith("video/")) return "video";
  const extension = name.split(".").pop()?.toLowerCase() ?? "";
  const kind = (Object.keys(extensions) as ClientFileKind[]).find((key) => extensions[key].includes(extension));
  if (kind) return kind;
  if (mimeType === "application/pdf" || mimeType.startsWith("text/")) return "document";
  if (/spreadsheet|excel/.test(mimeType)) return "spreadsheet";
  if (/presentation|powerpoint/.test(mimeType)) return "presentation";
  if (/word|opendocument.text/.test(mimeType)) return "document";
  return "other";
}

export function acceptedFileTypes(kind: ClientFileKind) {
  return kind === "other" ? undefined : extensions[kind].map((extension) => `.${extension}`).join(",");
}

export function validateLocalFile(file: Pick<File, "size" | "name" | "type">, expectedKind?: ClientFileKind) {
  if (!file.name.trim()) return "Select a named file.";
  if (file.size > MAX_CLIENT_FILE_BYTES) return `${file.name} exceeds the 25 MB limit.`;
  if (expectedKind && expectedKind !== "other" && detectFileKind(file.name, file.type) !== expectedKind) {
    return `Choose a ${FILE_KINDS[expectedKind].toLowerCase()} for this request.`;
  }
  return null;
}

export function getClientFiles(client: ClientRecord) {
  return (client.files ?? []).filter((file) => file.clientId === client.id);
}

export function fileStatistics(files: ClientFileRecord[]) {
  return { requested: files.filter((file) => file.status === "requested").length,
    uploaded: files.filter((file) => file.status === "uploaded").length, all: files.length };
}

export function saveClientFile(clients: ClientRecord[], clientId: string, record: ClientFileRecord) {
  if (record.clientId !== clientId) return clients;
  return clients.map((client) => {
    if (client.id !== clientId) return client;
    const files = getClientFiles(client);
    return { ...client, files: files.some((file) => file.id === record.id)
      ? files.map((file) => file.id === record.id ? record : file) : [record, ...files] };
  });
}

export function removeClientFile(clients: ClientRecord[], clientId: string, fileId: string) {
  return clients.map((client) => client.id === clientId
    ? { ...client, files: getClientFiles(client).filter((file) => file.id !== fileId) } : client);
}

export function formatFileDate(value?: string) {
  if (!value || !Number.isFinite(Date.parse(value))) return "Not requested";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "Africa/Casablanca" }).format(new Date(value));
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
