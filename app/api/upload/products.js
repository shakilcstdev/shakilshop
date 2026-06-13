require('dotenv').config();
const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const imageFolder = path.join(__dirname, 'public', 'images', 'products');
const files = fs.readdirSync(imageFolder).filter(file => /\.(png|jpe?g)$/i.test(file));

console.log(`মোট ${files.length} টি ছবি পাওয়া গেছে।`);

async function uploadAndCreateProduct(fileName) {
  const filePath = path.join(imageFolder, fileName);
  const fileBuffer = fs.readFileSync(filePath);
  let title = fileName.replace(/\.(png|jpe?g)$/i, '').replace(/_/g, ' ').replace(/product/i, 'Product');
  if (fileName === 'product_9.png') title = 'SEJATE POWERRATIC';
  if (fileName === 'product_12.png') title = 'FORBES';
  if (fileName === 'product_13.png') title = 'MI Band';
  if (fileName === 'product_14.png') title = 'SAMSUNG Galaxy';
  if (fileName === 'product_22.png') title = 'Canon EOS Lens';

  try {
    const asset = await client.assets.upload('image', fileBuffer, { filename: fileName });
    const product = {
      _type: 'product',
      title: title,
      slug: { _type: 'slug', current: fileName.replace(/\.(png|jpe?g)$/i, '').toLowerCase() },
      price: 999,
      mainImage: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
    };
    await client.create(product);
    console.log(`✅ ${title} তৈরি হয়েছে।`);
  } catch (err) {
    console.error(`❌ ${fileName} ব্যর্থ: ${err.message}`);
  }
}

async function run() {
  for (const file of files) {
    await uploadAndCreateProduct(file);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  console.log('🎉 সব কাজ শেষ!');
}

run();