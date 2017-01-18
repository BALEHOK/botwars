const db = require('./provider');

const setQuery =
  `INSERT INTO dict (key, valueString, valueInt)
    VALUES ($1, $2, $3)
    ON CONFLICT (key) DO UPDATE
      SET valueString = $2, valueInt = $3`;
async function set(key, valueString, valueInt) {
  if (typeof key !== 'string') {
    key = key.toString();
  }

  return await db.query(setQuery, [key, valueString, valueInt])
}

const getQuery =
  `SELECT valueString, valueInt FROM dict
    WHERE key = $1`;
async function get(key) {
  return await db.querySingleOrDefault(getQuery, [key]);
}

class DictRepo {
  setString(key, value) {
    return set(key, value, null);
  }

  async getString(key) {
    const result = await get(key);
    return result && result.valuestring || null;
  }

  setInt(key, value) {
    return set(key, null, value);
  }

  async getInt(key) {
    const result = await get(key);
    return result && result.valuesint || 0;
  }

  setObj(key, value) {
    const valueJson = JSON.stringify(value);

    return this.setString(key, valueJson);
  }

  async getObj(key) {
    const result = await this.getString(key);
    return JSON.parse(result);
  }
}

module.exports = new DictRepo();
