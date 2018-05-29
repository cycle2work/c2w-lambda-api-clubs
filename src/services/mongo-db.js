import { MongoClient } from "mongodb";

import {
    MONGODB_URL,
    ACTIVITIES_COLLECTION,
    CLUBS_COLLECTION,
    USERS_COLLECTION,
    REPORTS_COLLECTION
} from "../config";

let dbInstance;

export async function getMongoClient() {
    if (!dbInstance) {
        dbInstance = await MongoClient.connect(MONGODB_URL);
    }
    return dbInstance;
}

export async function retrieveUser(query = {}) {
    const db = await getMongoClient();
    return await db.collection(USERS_COLLECTION).findOne(query);
}

export async function retrieveReports(query = {}) {
    const db = await getMongoClient();
    return await db
        .collection(REPORTS_COLLECTION)
        .find(query)
        .toArray();
}

export async function retrieveClubs(query = {}) {
    const db = await getMongoClient();
    return await db
        .collection(CLUBS_COLLECTION)
        .find(query)
        .toArray();
}

export async function retrieveUserActivities(query = {}) {
    const db = await getMongoClient();
    return await db
        .collection(ACTIVITIES_COLLECTION)
        .find(query)
        .toArray();
}

export async function retrieveClubActivities(query = {}) {
    const db = await getMongoClient();
    return await db
        .collection(ACTIVITIES_COLLECTION)
        .find(query)
        .toArray();
}
