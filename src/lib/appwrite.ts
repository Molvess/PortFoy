import { Client, Databases, Account } from 'appwrite';

// ─────────────────────────────────────────────
// Appwrite Yapılandırması
// ─────────────────────────────────────────────
// Bu değerleri kendi Appwrite projenize göre güncelleyin:
//
// 1. https://cloud.appwrite.io adresinde bir proje oluşturun
// 2. Proje ID'sini VITE_APPWRITE_PROJECT_ID olarak .env dosyasına ekleyin
// 3. Veritabanı oluşturup ID'sini VITE_APPWRITE_DATABASE_ID olarak ekleyin
// 4. "videos" ve "projects" koleksiyonlarını oluşturun
//
// .env dosyası örneği:
//   VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
//   VITE_APPWRITE_PROJECT_ID=your_project_id
//   VITE_APPWRITE_DATABASE_ID=your_database_id
//   VITE_APPWRITE_VIDEOS_COLLECTION_ID=your_videos_collection_id
//   VITE_APPWRITE_PROJECTS_COLLECTION_ID=your_projects_collection_id
// ─────────────────────────────────────────────

const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || 'YOUR_PROJECT_ID');

export const databases = new Databases(client);
export const account = new Account(client);

// Collection ve Database ID'leri
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'YOUR_DATABASE_ID';
export const VIDEOS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_VIDEOS_COLLECTION_ID || 'videos';
export const PROJECTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PROJECTS_COLLECTION_ID || 'projects';

export { ID, Query } from 'appwrite';
export default client;
