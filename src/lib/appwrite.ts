import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';
import { useState, useEffect } from 'react';

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || 'your-project-id');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export { ID, Query };

export const APPWRITE_DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'your-database-id';
export const APPWRITE_COLLECTION_EVENTS = import.meta.env.VITE_APPWRITE_COLLECTION_EVENTS || 'events';
export const APPWRITE_COLLECTION_BLOGS = import.meta.env.VITE_APPWRITE_COLLECTION_BLOGS || 'blogs';
export const APPWRITE_BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID || 'your-bucket-id';

// Custom hook matching replacing react-firebase-hooks/auth
export function useAuthState() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    account.get()
      .then(res => {
        setUser(res);
        setLoading(false);
      })
      .catch((err) => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  return [user, loading] as const;
}
