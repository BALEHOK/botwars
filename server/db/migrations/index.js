const dictRepo = require('../dictRepo');
const dictKeys = require('../dictKeys');
const drop = require('./drop');
const v1 = require('./v1');
const v2 = require('./v2');
const v3 = require('./v3');

exports.prepaireDb = async function () {
  let dbVersion;
  try {
    dbVersion = await dictRepo.getInt(dictKeys.dbVersion);
  } catch (e) {
    dbVersion = 0;
  }
  // dbVersion = 0;

  console.log('dbVersion', dbVersion);

  let versionToSet = dbVersion;

  if (dbVersion < 1) {
    await drop(); // just in case
    await v1();

    versionToSet = 1;

    console.log('applied migration v1');
  }

  if (dbVersion < 2) {
    await v2();

    versionToSet = 2;

    console.log('applied migration v2');
  }

  if (dbVersion < 3) {
    await v3();

    versionToSet = 3;

    console.log('applied migration v3');
  }

  if (versionToSet > dbVersion) {
    await dictRepo.setInt(dictKeys.dbVersion, versionToSet);
  }
}
