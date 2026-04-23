import { useCallback } from 'react';

const DB_NAME = 'gradeflow-audio-cache';
const STORE_NAME = 'recordings';
const DB_VERSION = 1;

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (e) => reject(e.target.error);
    });
}

export function useAudioCache() {
    const saveToCache = useCallback(async (key, file) => {
        try {
            const db = await openDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                const store = tx.objectStore(STORE_NAME);
                const request = store.put(file, key);
                request.onsuccess = () => resolve();
                request.onerror = (e) => reject(e.target.error);
            });
        } catch (err) {
            console.error('[AudioCache] Failed to save:', err);
        }
    }, []);

    const loadFromCache = useCallback(async (key) => {
        try {
            const db = await openDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, 'readonly');
                const store = tx.objectStore(STORE_NAME);
                const request = store.get(key);
                request.onsuccess = (e) => resolve(e.target.result ?? null);
                request.onerror = (e) => reject(e.target.error);
            });
        } catch (err) {
            console.error('[AudioCache] Failed to load:', err);
            return null;
        }
    }, []);

    const deleteFromCache = useCallback(async (key) => {
        try {
            const db = await openDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                const store = tx.objectStore(STORE_NAME);
                const request = store.delete(key);
                request.onsuccess = () => resolve();
                request.onerror = (e) => reject(e.target.error);
            });
        } catch (err) {
            console.error('[AudioCache] Failed to delete:', err);
        }
    }, []);

    return { saveToCache, loadFromCache, deleteFromCache };
}

