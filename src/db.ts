import { createRxDatabase } from 'rxdb';
import { getRxStorageMongoDB } from 'rxdb/plugins/storage-mongodb';

export const myRxDatabase = await createRxDatabase({
    name: 'exampledb',
    storage: getRxStorageMongoDB({
        connection: 'mongodb://localhost:27017'
    })
});

const schema = {
    "title": "hero schema",
    "version": 0,
    "description": "describes a simple hero",
    "primaryKey": "name",
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "maxLength": 100 // <- the primary key must have set maxLength
        },
        "color": {
            "type": "string"
        },
    },
    "required": [
        "name",
    ],
}

myRxDatabase.addCollections({
    human: {
        schema: schema,
    }
})