import 'dotenv/config';

const m = await import('./db/db.ts');

const res = await m.db.execute('SELECT * FROM drizzle_migrations');
console.log(JSON.stringify(res, null, 2));
