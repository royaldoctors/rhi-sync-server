'use strict';

// RHI Sync Server — Royal Herbs International
// Single in-memory store: last full dataset wins.
// No external dependencies beyond Express.
// CORS headers are set manually — no 'cors' package needed.

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// ── In-memory store ──────────────────────────────────
let store = { ts: 0, data: {} };

// ── Middleware ───────────────────────────────────────
app.use(express.json({ limit: '10mb' }));

// Manual CORS — allows any origin, supports preflight
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cache-Control, Pragma');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);   // preflight — done
  }
  next();
});

// ── Routes ───────────────────────────────────────────

// Health check
app.get('/', function(req, res) {
  res.send('RHI Sync Server is running');
});

// GET /rhi-sync — return latest stored dataset
app.get('/rhi-sync', function(req, res) {
  res.json(store);
});

// POST /rhi-sync — accept and store full dataset
app.post('/rhi-sync', function(req, res) {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Invalid payload' });
  }
  // Only overwrite if incoming timestamp is newer (or store is empty)
  if (!store.ts || (body.ts && body.ts >= store.ts)) {
    store = {
      ts:   body.ts   || Date.now(),
      data: body.data || {}
    };
  }
  res.json({ ok: true, ts: store.ts });
});

// ── Start ────────────────────────────────────────────
app.listen(PORT, function() {
  console.log('RHI Sync Server listening on port ' + PORT);
});
