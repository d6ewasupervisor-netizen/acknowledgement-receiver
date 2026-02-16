const { Service } = require('node-windows');
const path = require('path');

const svc = new Service({
  name: 'AcknowledgementReceiver',
  description: 'Receives signed handbook PDFs and saves to OneDrive',
  script: path.join(__dirname, 'server.js'),
  env: [{
    name: 'OUTPUT_DIR',
    value: 'C:\\Users\\tgaut\\OneDrive - Advantage Solutions\\Signed Acknowledgements'
  }]
});

svc.on('install', () => {
  console.log('✓ Service installed. Starting...');
  svc.start();
});

svc.on('start', () => {
  console.log('✓ Service is running.');
  console.log('  It will now auto-start on boot.');
  console.log('  View in Task Manager > Services > AcknowledgementReceiver');
});

svc.on('alreadyinstalled', () => {
  console.log('Service is already installed.');
});

svc.install();
