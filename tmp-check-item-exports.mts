import 'dotenv/config';

const m = await import('./app/actions/items.ts');
console.log('module', m);
