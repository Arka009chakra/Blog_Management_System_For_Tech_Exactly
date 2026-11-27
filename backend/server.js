require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/db');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  const email = String(process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Site Admin';

  if (!email || !password) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env');
  }

  let admin = await User.findOne({ email }).select('+password');
  if (!admin) {
    admin = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 12),
      role: 'admin'
    });
    console.log('Admin account created:', email);
  } else {
    admin.role = 'admin';
    if (!admin.password) admin.password = await bcrypt.hash(password, 12);
    await admin.save();
    console.log('Admin account ready:', email);
  }
}

async function startServer() {
  try {
    await connectDB();
    await createAdmin();

    const port = process.env.PORT || 5001;
    app.listen(port, () => console.log(`Backend running at http://localhost:${port}`));
  } catch (error) {
    console.error('Backend startup failed:', error.message);
    process.exit(1);
  }
}

startServer();
