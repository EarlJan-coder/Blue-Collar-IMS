import { getItems } from './app/actions/items.ts';

async function run() {
  try {
    const items = await getItems();
    console.log('items:', items);
  } catch (err) {
    console.error('getItems error', err);
    process.exit(1);
  }
}

run();
