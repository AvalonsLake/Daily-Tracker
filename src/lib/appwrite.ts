import { Client, Databases } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT!);

export const databases = new Databases(client);

export const DATABASE_ID = process.env.APPWRITE_DATABASE_ID!;
export const AUTH_ID = process.env.APPWRITE_COLLECTION_ID_AUTH!;
export const SPELLDATA_ID = process.env.APPWRITE_COLLECTION_ID_SPELLDATA!;
export const CHARACTERS_ID = process.env.APPWRITE_COLLECTION_ID_CHARACTERS!;