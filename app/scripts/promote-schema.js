import { createDirectus, authentication, rest, schemaSnapshot, schemaDiff, schemaApply } from '@directus/sdk';
const BASE_DIRECTUS_URL = process.env.VITE_DIRECTUS_URL;

const TARGET_DIRECTUS_URL = 'https://staging.admin.originalorder.riversinstitute.org';

const baseDirectus = createDirectus(BASE_DIRECTUS_URL).with(rest()).with(authentication());
const targetDirectus = createDirectus(TARGET_DIRECTUS_URL).with(rest()).with(authentication());;

await baseDirectus.login({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
await targetDirectus.login({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });

async function main() {
  const snapshot = await getSnapshot();
  const diff = await getDiff(snapshot);
  if (diff) {
    console.log('applying', JSON.stringify(diff));
    await applyDiff(diff);
    console.log('done');
  }
  else {
    console.log('no diff to apply')
  }
}

main();

function getSnapshot() {
  return baseDirectus.request(schemaSnapshot());
}

function getDiff(snapshot) {
  return targetDirectus.request(schemaDiff(snapshot));
}

function applyDiff(diff) {
  return targetDirectus.request(schemaApply(diff));
}