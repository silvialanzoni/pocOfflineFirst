import Dexie from 'dexie';

// Configura il database IndexedDB
const db = new Dexie('EcommerceDB');

// Definisci le tabelle e gli indici
db.version(1).stores({
  cart: '++id, name, price', // Tabella per i prodotti nel carrello
  offlineOrders: '++id, data', // Tabella per gli ordini offline
});

export default db;
