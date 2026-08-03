require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}
const fs = require('fs');
const path = require('path');
const AppData = require('./models/AppData');
const { encryptTaskFields } = require('./utils/encryption');

const migrate = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI missing');

    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB for migration.');

    const dataPath = path.join(__dirname, '..', 'data.json');
    if (!fs.existsSync(dataPath)) {
      console.log('No data.json found. Skipping migration.');
      return;
    }

    const rawData = fs.readFileSync(dataPath, 'utf8');
    const parsedData = JSON.parse(rawData);

    if (parsedData && Array.isArray(parsedData.employees)) {
      const encryptedEmployees = parsedData.employees.map(emp => ({
        ...emp,
        tasks: (emp.tasks || []).map(task => encryptTaskFields(task))
      }));

      let appData = await AppData.findOne();
      if (!appData) {
        appData = new AppData();
      }

      appData.employees = encryptedEmployees;
      appData.exchangeRate = parsedData.exchangeRate || 51.33;
      appData.lastUpdatedBy = 'migration';
      
      await appData.save();
      console.log('Migration successful: Data encrypted and saved to MongoDB.');
    } else {
      console.log('Invalid data format in data.json.');
    }

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

migrate();
