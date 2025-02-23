import Dexie from 'dexie';

const db = new Dexie('SportsEcommerceDB');

db.version(1).stores({
  cart: '++id, name, price, quantity',
  offlineOrders: '++id, data',
});

export default db;
