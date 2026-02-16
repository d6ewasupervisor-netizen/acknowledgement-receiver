const { Service } = require('node-windows');
const path = require('path');

const svc = new Service({
  name: 'AcknowledgementReceiver',
  script: path.join(__dirname, 'server.js')
});

svc.on('uninstall', () => {
  console.log('✓ Service uninstalled.');
});

svc.uninstall();
