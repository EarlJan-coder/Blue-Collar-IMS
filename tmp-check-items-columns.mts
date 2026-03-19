import 'dotenv/config';

const m = await import('./db/db.ts');
const cols = await m.db.execute(`select column_name from information_schema.columns where table_name='items' order by ordinal_position`);
console.log(cols);
