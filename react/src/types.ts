export type FileTreeType = {
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: FileTreeType[];
}