require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}
const User = require('./models/User');
const AppData = require('./models/AppData');

const setup = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI missing');
    
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB for setup.');

    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminExists = await User.findOne({ username: adminUsername });

    if (!adminExists) {
      const passwordHash = await User.hashPassword('admin123');
      const admin = new User({
        username: adminUsername,
        passwordHash,
        role: 'admin'
      });
      await admin.save();
      console.log(`Admin user created: ${adminUsername} / admin123`);
    } else {
      console.log('Admin user already exists.');
    }

    const dataCount = await AppData.countDocuments();
    if (dataCount === 0) {
      const initialData = new AppData({ employees: [], exchangeRate: 0 });
      await initialData.save();
      console.log('Initial AppData document created.');
    } else {
      console.log('AppData document already exists.');
    }

    console.log('Setup completed successfully.');
  } catch (error) {
    console.error('Setup failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

setup();
