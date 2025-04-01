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

export interface ApiKey {
    id: string;
    name: string;
    key: string;
    created_at: Date;
}

let db: IDBDatabase | null = null;

async function initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('unit9assignment', 2);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;

            if (!db.objectStoreNames.contains('evaluations')) {
                const store = db.createObjectStore('evaluations', { keyPath: 'id', autoIncrement: true });
                store.createIndex('student_name', 'student_name', { unique: false });
                store.createIndex('student_class', 'student_class', { unique: false });
                store.createIndex('created_at', 'created_at', { unique: false });
            }

            if (!db.objectStoreNames.contains('api_keys')) {
                const store = db.createObjectStore('api_keys', { keyPath: 'id' });
                store.createIndex('created_at', 'created_at', { unique: false });
            }
        };
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

export async function clearAllEvaluations(): Promise<void> {
    if (!browser) return;

    const db = await getDB();
    if (!db) return;

    const transaction = db.transaction(['evaluations'], 'readwrite');
    const store = transaction.objectStore('evaluations');

    return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export async function saveApiKey(apiKey: Omit<ApiKey, 'created_at'>): Promise<void> {
    if (!browser) return;

    const db = await getDB();
    if (!db) return;

    const transaction = db.transaction(['api_keys'], 'readwrite');
    const store = transaction.objectStore('api_keys');

    return new Promise((resolve, reject) => {
        const request = store.put({
            ...apiKey,
            created_at: new Date()
        });
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export async function getApiKeys(): Promise<ApiKey[]> {
    if (!browser) return [];

    const db = await getDB();
    if (!db) return [];

    const transaction = db.transaction(['api_keys'], 'readonly');
    const store = transaction.objectStore('api_keys');

    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function deleteApiKey(id: string): Promise<void> {
    if (!browser) return;

    const db = await getDB();
    if (!db) return;

    const transaction = db.transaction(['api_keys'], 'readwrite');
    const store = transaction.objectStore('api_keys');

    return new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
} 