import 'dotenv/config';
import * as m from './app/actions/items.ts';

console.log('module keys', Object.keys(m));

try {
  const items = await m.getItems();
  console.log('items length', items.length);
} catch (err) {
  console.error('getItems error', err);
  process.exit(1);
}
