import { browser } from '$app/environment';

const DB_NAME = 'essay_evaluations';
const DB_VERSION = 1;
const STORE_NAME = 'evaluations';

export interface Evaluation {
    id: number;
    student_name: string;
    student_class: string;
    statement: string;
    essay_text: string;
    score: number;
    review: string;
    created_at: string;
}

let db: IDBDatabase | null = null;

async function initDB(): Promise<IDBDatabase | null> {
    if (!browser) return null;

    return new Promise((resolve, reject) => {
        try {
            if (typeof window === 'undefined') {
                resolve(null);
                return;
            }

            const request = window.indexedDB.open('evaluations', 1);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains('evaluations')) {
                    const store = db.createObjectStore('evaluations', { keyPath: 'id', autoIncrement: true });
                    store.createIndex('created_at', 'created_at', { unique: false });
                }
            };
        } catch (error) {
            resolve(null);
        }
    });
}

async function getDB(): Promise<IDBDatabase | null> {
    if (!browser) return null;
    if (!db) {
        db = await initDB();
    }
    return db;
}

export async function saveEvaluation(data: Omit<Evaluation, 'id' | 'created_at'>): Promise<void> {
    if (!browser) return;

    const db = await getDB();
    if (!db) return;

    const transaction = db.transaction(['evaluations'], 'readwrite');
    const store = transaction.objectStore('evaluations');

    const evaluation = {
        ...data,
        created_at: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
        const request = store.add(evaluation);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export async function getEvaluations(): Promise<Evaluation[]> {
    if (!browser) return [];

    const db = await getDB();
    if (!db) return [];

    const transaction = db.transaction(['evaluations'], 'readonly');
    const store = transaction.objectStore('evaluations');
    const index = store.index('created_at');

    return new Promise((resolve, reject) => {
        const request = index.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function deleteEvaluation(id: number): Promise<void> {
    if (!browser) return;

    const db = await getDB();
    if (!db) return;

    const transaction = db.transaction(['evaluations'], 'readwrite');
    const store = transaction.objectStore('evaluations');

    return new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
} 