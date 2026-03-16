const fs = require('fs');

const enPath = './src/locales/en.json';
const zhCNPath = './src/locales/zh-CN.json';
const zhTWPath = './src/locales/zh-TW.json';
const ruPath = './src/locales/ru.json';

sortJsonFile(enPath);
sortJsonFile(zhCNPath);
sortJsonFile(zhTWPath);
sortJsonFile(ruPath);

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const zhcn = JSON.parse(fs.readFileSync(zhCNPath, 'utf8'));
const zhtw = JSON.parse(fs.readFileSync(zhTWPath, 'utf8'));
const ru = JSON.parse(fs.readFileSync(ruPath, 'utf8'));

const enKeys = Object.keys(en);
const zhCNKeys = Object.keys(zhcn);
const zhTWKeys = Object.keys(zhtw);
const ruKeys = Object.keys(ru);

const setEn = new Set(enKeys);
const setZhCN = new Set(zhCNKeys);
const setZhTW = new Set(zhTWKeys);
const setRu = new Set(ruKeys);

// 1. missing keys
const missingInZhCN = enKeys.filter((k) => !setZhCN.has(k));
const extraInZhCN = zhCNKeys.filter((k) => !setEn.has(k));

const missingInZhTW = enKeys.filter((k) => !setZhTW.has(k));
const extraInZhTW = zhTWKeys.filter((k) => !setEn.has(k));

const missingInRu = enKeys.filter((k) => !setRu.has(k));
const extraInRu = ruKeys.filter((k) => !setEn.has(k));

// 2. missing .desc
const missingDesc = enKeys.filter(
  (k) => !k.endsWith('.desc') && typeof en[k] === 'string' && !setEn.has(`${k}.desc`)
);

console.log('❌ Missing in zh-CN:', missingInZhCN);
console.log('⚠️ Extra in zh-CN:', extraInZhCN);
console.log('❌ Missing in zh-TW:', missingInZhTW);
console.log('⚠️ Extra in zh-TW:', extraInZhTW);
console.log('❌ Missing in ru-RU:', missingInRu);
console.log('⚠️ Extra in ru-RU:', extraInRu);
console.log('⚠️ Missing .desc:', missingDesc);

function sortObjectByKey(obj) {
  return Object.keys(obj)
    .sort((a, b) => a.localeCompare(b))
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
}

function sortJsonFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(raw);

  const sorted = sortObjectByKey(json);

  fs.writeFileSync(filePath, JSON.stringify(sorted, null, 2) + '\n', 'utf8');

  console.log(`✓ Sorted in place: ${filePath}`);
}
