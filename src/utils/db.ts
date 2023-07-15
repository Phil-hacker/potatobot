import {MongoClient, MongoClientOptions, ObjectId, Filter} from 'mongodb';
import 'dotenv/config';
//don't check process.env

import { Identifier } from '../@types/index.js';

const client = process.env.mode==='DEV' ?
new MongoClient(`mongodb+srv://${process.env.DEV_MONGO_USERNAME}:${process.env.DEV_MONGO_PASSWORD}@${process.env.DEV_DB_URL}/${process.env.DEV_DB_NAME}?retryWrites=true&w=majority`) :
await new MongoClient(`mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.DB_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`);

export const disconnect = async ()=> {
    await client.close();
}

export const db = await client.db();


const mongoArrays = {
    'users': 1,
}

/**
 * @function
 * @description Takes in a protected Identifier and allows (forces) us to perform an AND on the properties of objects embedded in arrays
 * @param {Identifier} q
 * @returns {object} 
 */
const formatIdentifier = (q: Identifier) => Object.entries(q).reduce((agg: object, e: Array<any>) => {
    const mongoArrayKey = e[0].split('.')[0];
    mongoArrayKey in mongoArrays ?
        mongoArrayKey in agg ?
        // @ts-ignore
            agg[mongoArrayKey]["$elemMatch" as keyof typeof Object][e[0].replace(`${mongoArrayKey}.`,'')]=e[1]
            // @ts-ignore
            : agg[mongoArrayKey] = {$elemMatch: {[e[0].replace(`${mongoArrayKey}.`,'')]: e[1]}}
            // @ts-ignore
        : agg[e[0]] = e[1]
    return agg;}, {});

    

/**
 * @function
 * @description Returns a function which creates one entry in collection *type* containing *data*
 * @param {String} type Collection Name
 * @return {Function} A function taking *data* and returning *insertedId* as a string
 */
export const create = (type:string) => 
    async (data:Object) => 
        (await db.collection(type).insertOne(data))?.insertedId?.toString();


/**
 * @function
 * @description Returns a function which updates one entry in collection *type* matching *Identifier* with *updates*
 * @param {String} type Collection Name
 * @returns {Function} A function taking *Identifier* and *updates* and returning the updated document.
 */
export const update = (type:string) => 
    async (Identifier:Identifier, updates:Object) => 
        (await db.collection(type).findOneAndUpdate(Identifier._id ? 
            formatIdentifier({...Identifier, ...{_id: new ObjectId(Identifier._id)}}) : 
            formatIdentifier(Identifier) as Filter<Document>, 
            [{$addFields: {...updates}}],
            { returnDocument: 'after'}))?.value;


/**
 * @function
 * @description Returns a function which adds one or an array of items as *list* to an entry in collection *type* matching *Identifier* with *updates*
 * @param {String} type Collection Name
 * @returns {Function} A function taking *Identifier*, *list* and *updates* and returning modifiedCount.
 */
export const addToList = (type:string) => 
    async (Identifier:Identifier, list:string, updates:Object | string) => 
        (await db.collection(type).updateOne(Identifier._id ? 
            formatIdentifier({...Identifier, ...{_id: new ObjectId(Identifier._id)}}) : 
            formatIdentifier(Identifier) as Filter<Document>, 
            {$addToSet: {[list]: Array.isArray(updates) ? { $each: updates } : updates }}))?.modifiedCount;

/**
 * @function
 * @description Returns a function which removes one entry from a *list* to an entry in collection *type* matching *Identifier* and *updates*
 * @param {String} type Collection Name
 * @returns {Function} A function taking *Identifier*, *list* and *match* and returning returning modifiedCount.
 */
export const removeOneFromList = (type:string) => 
    async (Identifier:Identifier, list:string, match:Object | string) => 
        (await db.collection(type).updateOne(Identifier._id ? 
            formatIdentifier({...Identifier, ...{_id: new ObjectId(Identifier._id)}}) : 
            formatIdentifier(Identifier) as Filter<Document>, 
            {$pull: {[list]: match }}))?.modifiedCount

/**
 * @function
 * @description Returns a function which updates a list in collection *type* matching *Identifier* with *updates*
 * @param {String} type Collection Name
 * @returns {Function} A function taking *Identifier* and *updates* and returning the modifiedCount.
 */
export const updateInList = (type:string) => 
    async (Identifier:Identifier, updates:Object) => 
        (await db.collection(type).updateOne(Identifier._id ? 
            formatIdentifier({...Identifier, ...{_id: new ObjectId(Identifier._id)}}) : 
            formatIdentifier(Identifier) as Filter<Document>,
            {$set: {...updates}}))?.modifiedCount;


/**
 * @function
 * @description Returns a function which gets one entry in collection *type* matching *Identifier*
 * @param {String} type Collection Name 
 * @returns {db_get_inner} A function taking *Identifier* and returning the document.
 */
export const get = (type:string) =>     
    /**
    * @alias db_get_inner
    * @function
    * @description A function which gets one entry in a collection
    * @param {Identifier} Identifier
    * @param {Object} project The mongo projection object (optional)
    * @returns {Object} An object of the type of the collection referenced in {@link get}
    */
    async (Identifier:Identifier, project:Object={}) => 
        await db.collection(type).findOne(Identifier._id ? 
            formatIdentifier({...Identifier, ...{_id: new ObjectId(Identifier._id)}}) : 
            formatIdentifier(Identifier) as Filter<Document>, 
            {projection: project});


/**
 * @function
 * @description Returns a function which gets many entries in collection *type* matching *Identifier*
 * @param {String} type Collection Name 
 * @returns {db_get_many_inner} A function taking *Identifier* and returning the document.
 */
export const getMany = (type:string) =>     
/**
* @alias db_get_many_inner
* @function
* @description A function which gets many entries in a collection
* @param {Identifier} Identifier
* @param {Object} project The mongo projection object (optional)
* @returns {Array} An array of objects of the type of the collection referenced in {@link get}
*/
async (Identifier:Identifier, project:Object={}) => 
    await db.collection(type).find(Identifier._id ? 
        formatIdentifier({...Identifier, ...{_id: new ObjectId(Identifier._id)}}) : 
        formatIdentifier(Identifier) as Filter<Document>, 
        {projection: project}).toArray();


/**
 * @function
 * @description Returns a function which removes one entry in collection *type* matching *Identifier*
 * @param {String} type Collection Name
 * @returns {Function} A function taking *Identifier* and returning a DeleteResult { acknowledged, deletedCount }
 */
export const remove = (type:string) => 
    async (Identifier:Identifier) => 
        await db.collection(type).deleteOne(Identifier._id ? 
            formatIdentifier({...Identifier, ...{_id: new ObjectId(Identifier._id)}}) : 
            formatIdentifier(Identifier) as Filter<Document>);


/**
 * @function
 * @description Returns a function which removes all entries in collection *type* matching *Identifier*
 * @param {String} type Collection Name
 * @returns {Function} A function taking *Identifier* and returning a DeleteResult { acknowledged, deletedCount }
 */
export const removeMany = (type:string) => 
    async (Identifier:Identifier) => 
        await db.collection(type).deleteMany(Identifier._id ? 
            formatIdentifier({...Identifier, ...{_id: new ObjectId(Identifier._id)}}) : 
            formatIdentifier(Identifier) as Filter<Document>);