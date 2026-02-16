const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// ═══════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════
const PORT = 3000;
const OUTPUT_DIR = process.env.OUTPUT_DIR || 'C:\\Users\\tgaut\\OneDrive - Advantage Solutions\\Signed Acknowledgements';

// ═══════════════════════════════════════════════
// SETUP
// ═══════════════════════════════════════════════
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Created output directory: ${OUTPUT_DIR}`);
}

const upload = multer({ storage: multer.memoryStorage() });
const app = express();

app.use(cors());
app.use(express.static(__dirname));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Acknowledgement receiver is running.' });
});

// PDF upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const filename = req.body.filename || req.file.originalname || 'unsigned.pdf';
    const filepath = path.join(OUTPUT_DIR, filename);

    fs.writeFileSync(filepath, req.file.buffer);

    console.log(`✓ Saved: ${filename}`);
    console.log(`  Teammate: ${req.body.teammate_name || 'unknown'}`);
    console.log(`  Date: ${req.body.date_signed || 'unknown'}`);
    console.log(`  Path: ${filepath}`);

    res.json({
      success: true,
      filename,
      path: filepath,
    });
  } catch (err) {
    console.error('Error saving file:', err);
    res.status(500).json({ error: 'Failed to save file.' });
  }
});

app.listen(PORT, () => {
  console.log(`\n📋 Acknowledgement Receiver`);
  console.log(`   Listening on port ${PORT}`);
  console.log(`   Saving to: ${OUTPUT_DIR}`);
  console.log(`   Web app: http://localhost:${PORT}`);
  console.log(`   POST endpoint: http://localhost:${PORT}/upload\n`);
});
