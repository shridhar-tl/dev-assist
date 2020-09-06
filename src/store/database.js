import Dexie from 'dexie';

const db = new Dexie('devAssist');

db.version(2).stores({
    handlers: 'id,enabled',
    settings: 'id,value,modified',
    executionInfo: 'id,count,modified'
});

export const handlersTable = db.handlers;
export const settingsTable = db.settings;
