import Dexie from 'dexie';

const db = new Dexie('devAssist');

db.version(1).stores({
    handlers: 'id,enabled'
});

export const handlersTable = db.handlers;

