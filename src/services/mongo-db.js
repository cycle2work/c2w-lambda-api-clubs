import { MongoClient } from "mongodb";

import {
    MONGODB_URL,
    CLUBS_COLLECTION,
    REPORTS_COLLECTION
} from "../config";

let dbInstance;

export async function getMongoClient() {
    if (!dbInstance) {
        dbInstance = await MongoClient.connect(MONGODB_URL);
    }
    return dbInstance;
}

export async function retrieveReports(query = {}) {
    const db = await getMongoClient();
    return await db.collection(REPORTS_COLLECTION).find(query).toArray();
}

export async function retrieveClubs(query = {}) {
    const db = await getMongoClient();
    return await db.collection(CLUBS_COLLECTION).find(query).toArray();
}
