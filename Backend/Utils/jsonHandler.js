const fs = require('fs').promises;
const path = require('path');

async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Greška pri čitanju fajla ${filePath}:`, error);
    throw error;
  }
}

async function writeJsonFile(filePath, data) {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, jsonString, 'utf8');
  } catch (error) {
    console.error(`Greška pri pisanju u fajl ${filePath}:`, error);
    throw error;
  }
}
module.exports = { readJsonFile, writeJsonFile };
