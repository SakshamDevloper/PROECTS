import { Collection, MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';







dotenv.config({ path: '.env' });
const uri = process.env.MONGODB_CONNECTION_URI ?? '';

export default class Database {
    private client: MongoClient;
    constructor() {
        this.client = new MongoClient(uri);
    }

    async collection(collection: string): Promise<Collection> {
        return this.client.db(process.env.MONGODB_DATABASE).collection(collection);
    }

    async findById(id: string) {
        const collection = await this.collection('movies');
        return collection.findOne({ _id: new ObjectId(id) });

    }

    async findBy(filter: object) {
        const collection = await this.collection('movies');
        return collection.findOne(filter);
    }

    async all() {
        const collection = await this.collection('movies');
        return collection.find().toArray();
    }

    async create(payload: object) {
        const collection = await this.collection('movies');
        return collection.insertOne(payload);
    }

    async update(filter: object, updatePayload: object) {
        const collection = await this.collection('movies');
        return collection.updateOne(filter, updatePayload);
    }

    async delete(filter: object) {
        const collection = await this.collection('movies');
        return collection.deleteOne(filter);
    }
}
