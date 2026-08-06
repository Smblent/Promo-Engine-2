const fs = require('fs');
const assert = require('assert');

// Promo Engine 2 smoke tests

const app = fs.readFileSync('./app.js', 'utf8');
const html = fs.readFileSync('./index.html', 'utf8');
const manifest = fs.readFileSync('./manifest.json', 'utf8');

assert.ok(
    app.includes('CONTENT_TYPES'),
    'CONTENT_TYPES should exist'
);

assert.ok(
    app.includes('PLATFORMS'),
    'PLATFORMS should exist'
);

assert.ok(
    app.includes('CAMPAIGN_TEMPLATES'),
    'CAMPAIGN_TEMPLATES should exist'
);

assert.ok(
    html.includes('Promo'),
    'index.html should contain app branding'
);

const parsedManifest = JSON.parse(manifest);

assert.ok(
    parsedManifest.name || parsedManifest.short_name,
    'PWA manifest should define a name'
);

console.log('Promo Engine smoke tests passed.');