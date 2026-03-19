import 'dotenv/config';

const m = await import('./app/actions/items.ts');

try {
  const rows = await m.getItems();
  console.log('row count', rows.length);
  console.log(rows[0]);
} catch (err) {
  console.error('getItems error', err);
  process.exit(1);
}
