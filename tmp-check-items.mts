import { getItems } from './app/actions/items.ts';

async function run() {
  try {
    const rows = await getItems();
    console.log('rows', rows);
  } catch (err) {
    console.error('getItems err', err);
    process.exit(1);
  }
}

run();
