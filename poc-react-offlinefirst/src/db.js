import Dexie from 'dexie';

// Configura il database IndexedDB
const db = new Dexie('EcommerceDB');

// Definisci le tabelle e gli indici
db.version(1).stores({
  cart: '++id, name, price, quantity', // Aggiungi 'quantity'
  offlineOrders: '++id, data',
});


export default db;
