const dictRepo = require('../dictRepo');
const dictKeys = require('../dictKeys');
const drop = require('./drop');
const init = require('./init');

exports.prepaireDb = async function() {
  let dbVersion;
  try{
    dbVersion = await dictRepo.getInt(dictKeys.dbVersion);
  } catch (e){
    dbVersion = 0;
  }

  let versionToSet = dbVersion;

  if (dbVersion === 0) {
    await drop(); // just in case
    await init();

    versionToSet = 1;
  }

  if(versionToSet > dbVersion) {
    await dictRepo.setInt(dictKeys.dbVersion, versionToSet);
  }
}
