import { ID, Permission, Query, Role, type Models } from "appwrite";
import { SPELLDATA_ID, AUTH_ID, CHARACTERS_ID, DATABASE_ID, databases } from "../lib/appwrite";

// Templates for User & Item
export interface User extends Models.Document {
    email: string;
    password: string;
}

export interface Item extends Models.Document {
    title: string;
    time: string;
    location: string;
    all_day: boolean;
    finished: boolean;
}


// List All Items
export const listItems = async (): Promise<Item[]> => {
    const response = await databases.listDocuments<Item>({
    databaseId: DATABASE_ID,
    collectionId: CHARACTERS_ID,
    queries: [Query.orderDesc("$createdAt")],
  });
  return response.documents;
}

// Create a User
export const createUser = async (email: string, password: string): Promise<User[]> => {
    const response = await databases.createDocument({
    databaseId: '<DATABASE_ID>',
    collectionId: '<COLLECTION_ID>',
    documentId: ID.unique(),
    data: { email, password },
    });
    return response.documents;
};


// Create An item
export const createItem = async (title: string, time: string, location: string, all_day: boolean, finished: boolean): Promise<Item[]> => {
    const response = await databases.createDocument({
    databaseId: '<DATABASE_ID>',
    collectionId: '<COLLECTION_ID>',
    documentId: ID.unique(),
    data: { title, time, location, all_day, finished },
    });
    return response.documents;
};


// Update An Item
export const updateItem = async(
    documentId: string,
    data: Partial<Pick<Item, "title" | "time" | "location" | "all_day" | "finished">>
): Promise<Item> => {
    return databases.updateDocument({
    databaseId: '<DATABASE_ID>',
    collectionId: '<COLLECTION_ID>',
    documentId: '<DOCUMENT_ID>',
    data,
});
}

// Delete an Item
export const deleteItem = async (documentId: string): Promise<void> => {
    await databases.deleteDocument({
    databaseId: '<DATABASE_ID>',
    collectionId: '<COLLECTION_ID>',
    documentId,
});
}