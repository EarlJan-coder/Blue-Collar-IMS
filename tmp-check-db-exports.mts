import 'dotenv/config';

const m = await import('./db/db.ts');
console.log('db module', Object.keys(m));
console.log('db value', m);
