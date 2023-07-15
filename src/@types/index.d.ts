import { Client } from 'discord.js/typings';
type WithId<Document> = import('mongodb').WithId<import('mongodb').Document>;
type ObjectId = import('mongodb').ObjectId;

interface PotatoClient extends Client{
    commands?: Collection
}

interface Identifier{
    _id?: import('mongodb').ObjectId | string
    id: string
}