const pg = require('pg');
const connectionString = require('./connectionString');

function query(queryText, values) {
  const client = new pg.Client(connectionString);
  client.connect();
  const q = client.query(queryText, values);
  q.on('end', () => { client.end(); });

  return q;
}

// returns the row or null
async function querySingleOrDefault(queryText, values) {
   let res = await query(queryText, values);
   if (res.rows.length > 1) {
     throw 'multiple entries selected where expected a single entry';
   }

   return res.rows[0] || null;
}

// returns the row
async function querySingle(queryText, values) {
   let res = await querySingleOrDefault(queryText, values);
   if (res.rows.length === 0) {
     throw 'no enry selected where expected a single entry';
   }

   return res.rows[0];
}

exports.query = query;
exports.querySingle = querySingle;
exports.querySingleOrDefault = querySingleOrDefault;
