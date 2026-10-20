const mysql = require('mysql2');
const bcrypt = require('bcrypt');

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'lms_db'
});

// Seed accounts data
const seedAccounts = [
  {
    email: 'student@paterostechnologicalcollege.edu.ph',
    password: 'student',
    role: 'student',
    name: 'Student User'
  },
  {
    email: 'prof@paterostechnologicalcollege.edu.ph',
    password: 'prof',
    role: 'professor',
    name: 'Professor User'
  },
  {
    email: 'dean@paterostechnologicalcollege.edu.ph',
    password: 'dean',
    role: 'dean',
    name: 'Dean User'
  },
  {
    email: 'admin@paterostechnologicalcollege.edu.ph',
    password: 'admin',
    role: 'administrator',
    name: 'System Admin'
  }
];

async function createSeedAccounts() {
  try {
    console.log('Connecting to database...');
    
    await new Promise((resolve, reject) => {
      db.connect((err) => {
        if (err) {
          console.error('❌ Database connection failed:', err.message);
          console.error('\nPlease make sure MySQL is running and configured correctly in .env file');
          console.error('Default settings: host=localhost, user=root, password=(empty), database=lms_db');
          reject(err);
        } else {
          console.log('✅ Database connected!');
          resolve();
        }
      });
    });
    
    // Create users table if it doesn't exist
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('student', 'professor', 'dean', 'administrator') DEFAULT 'student',
        email_verified BOOLEAN DEFAULT FALSE,
        account_status ENUM('pending', 'active') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    
    await new Promise((resolve, reject) => {
      db.query(createTableSQL, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    console.log('✅ Users table verified/created');
    
    // Insert seed accounts
    for (const account of seedAccounts) {
      const normalizedEmail = account.email.toLowerCase().trim();
      
      // Check if account already exists
      const checkSQL = 'SELECT id FROM users WHERE email = ?';
      const existingUser = await new Promise((resolve, reject) => {
        db.query(checkSQL, [normalizedEmail], (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });
      
      if (existingUser.length > 0) {
        console.log(`ℹ️  Account already exists: ${account.email}`);
        continue;
      }
      
      // Hash password
      const passwordHash = await bcrypt.hash(account.password, 10);
      
      // Insert account
      const insertSQL = `
        INSERT INTO users (email, password_hash, role, email_verified, account_status)
        VALUES (?, ?, ?, TRUE, 'active')
      `;
      
      await new Promise((resolve, reject) => {
        db.query(insertSQL, [normalizedEmail, passwordHash, account.role], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      
      console.log(`✅ Created account: ${account.name} (${account.email}) - Password: ${account.password}`);
    }
    
    // Verify accounts
    console.log('\n📋 Verifying created accounts:');
    const verifySQL = 'SELECT id, email, role, email_verified, account_status FROM users WHERE email IN (?, ?, ?, ?)';
    const emails = seedAccounts.map(a => a.email);
    
    const results = await new Promise((resolve, reject) => {
      db.query(verifySQL, emails, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    results.forEach(user => {
      console.log(`  - ${user.email} | Role: ${user.role} | Verified: ${user.email_verified} | Status: ${user.account_status}`);
    });
    
    console.log('\n✅ Seed accounts created successfully!');
    console.log('\n🔐 Login Credentials:');
    seedAccounts.forEach(account => {
      console.log(`  ${account.role.toUpperCase()}: ${account.email} / ${account.password}`);
      console.log(`  Shortcut: ${account.email.split('@')[0]} / ${account.password}`);
    });
    
    db.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (db && db.state !== 'disconnected') {
      db.end();
    }
    process.exit(1);
  }
}

createSeedAccounts();
