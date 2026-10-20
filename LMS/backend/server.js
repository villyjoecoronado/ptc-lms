const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const webpush = require('web-push');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'lms_db'
});

db.connect((err) => {
  if (err) {
    console.log("❌ DB ERROR:", err.message);
  } else {
    console.log("✅ DATABASE CONNECTED!");
    initializeDatabase();
  }
});

// Initialize database schema with required fields
function initializeDatabase() {

  // Alter users table to support student approval workflow if columns do not exist
  const alterColumns = [
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(255) NULL",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS student_id VARCHAR(50) NULL",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS program VARCHAR(100) NULL",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS section VARCHAR(50) NULL",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_by VARCHAR(255) NULL",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_by_role VARCHAR(50) NULL",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP NULL",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS rejected_by VARCHAR(255) NULL",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMP NULL",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS rejection_reason TEXT NULL",
    "ALTER TABLE users MODIFY COLUMN account_status VARCHAR(50) DEFAULT 'pending'"
  ];
  alterColumns.forEach(sql => {
    db.query(sql, (err) => {
      // Ignore if column exists or MySQL version differences
    });
  });

  const createUsersTable = `
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
  
  const createVerificationCodesTable = `
    CREATE TABLE IF NOT EXISTS verification_codes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      email VARCHAR(255) NOT NULL,
      code_hash VARCHAR(255) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      attempts INT DEFAULT 0,
      is_used BOOLEAN DEFAULT FALSE,
      INDEX idx_user_id (user_id),
      INDEX idx_email (email),
      INDEX idx_expires_at (expires_at),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  
  const createPushSubscriptionsTable = `
    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      endpoint VARCHAR(500) NOT NULL,
      p256dh VARCHAR(255) NOT NULL,
      auth VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_user_id (user_id),
      INDEX idx_endpoint (endpoint(255)),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  
  db.query(createUsersTable, (err) => {
    if (err) {
      console.log("❌ Error creating users table:", err.message);
    } else {
      console.log("✅ Users table verified/created");
    }
  });

  db.query(createVerificationCodesTable, (err) => {
    if (err) {
      console.log("❌ Error creating verification_codes table:", err.message);
    } else {
      console.log("✅ Verification codes table verified/created");
    }
  });

  db.query(createPushSubscriptionsTable, (err) => {
    if (err) {
      console.log("❌ Error creating push_subscriptions table:", err.message);
    } else {
      console.log("✅ Push subscriptions table verified/created");
      seedDefaultUsers();
    }
  });
}

// Seed default test accounts
async function seedDefaultUsers() {
  const defaultUsers = [
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

  for (const user of defaultUsers) {
    const normalizedEmail = normalizeEmail(user.email);
    
    // Check if user already exists
    const checkSql = 'SELECT id FROM users WHERE email = ?';
    db.query(checkSql, [normalizedEmail], async (err, results) => {
      if (err) {
        console.log(`Error checking user ${user.email}:`, err.message);
        return;
      }
      
      if (results.length === 0) {
        // Hash password and create user
        const passwordHash = await bcrypt.hash(user.password, 10);
        const insertSql = `
          INSERT INTO users (email, password_hash, role, email_verified, account_status) 
          VALUES (?, ?, ?, TRUE, 'active')
        `;
        
        db.query(insertSql, [normalizedEmail, passwordHash, user.role], (err) => {
          if (err) {
            console.log(`Error seeding user ${user.email}:`, err.message);
          } else {
            console.log(`✅ Seeded default account: ${user.name} (${user.email})`);
          }
        });
      } else {
        console.log(`ℹ️  Default account already exists: ${user.email}`);
      }
    });
  }
}

// Email normalization function
function normalizeEmail(email) {
  if (!email) return '';
  return email.trim().toLowerCase();
}

// Map username shortcuts to full PTC email addresses
function mapUsernameToEmail(username) {
  const usernameMap = {
    'student': 'student@paterostechnologicalcollege.edu.ph',
    'prof': 'prof@paterostechnologicalcollege.edu.ph',
    'dean': 'dean@paterostechnologicalcollege.edu.ph',
    'admin': 'admin@paterostechnologicalcollege.edu.ph'
  };
  
  const normalizedUsername = username.trim().toLowerCase();
  return usernameMap[normalizedUsername] || null;
}

// Check if email belongs to a seed account (for bypassing certain validations)
function isSeedAccount(email) {
  const seedEmails = [
    'student@paterostechnologicalcollege.edu.ph',
    'prof@paterostechnologicalcollege.edu.ph',
    'dean@paterostechnologicalcollege.edu.ph',
    'admin@paterostechnologicalcollege.edu.ph'
  ];
  
  const normalizedEmail = normalizeEmail(email);
  return seedEmails.includes(normalizedEmail);
}

// PTC domain validation
function isValidPTCEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@paterostechnologicalcollege\.edu\.ph$/i;
  return emailRegex.test(normalizedEmail);
}

// Password complexity validation
function isValidPassword(password) {
  if (!password || password.length < 8) {
    return false;
  }
  
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return hasUppercase && hasLowercase && hasNumber && hasSpecial;
}

// Privileged role guard - reject admin/dean from public registration
function isAllowedRole(role) {
  const allowedRoles = ['student', 'professor'];
  return allowedRoles.includes(role);
}

// Generate cryptographically secure 6-digit OTP code
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// Email transporter configuration
const emailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || ''
  }
});

// Configure web-push with VAPID keys
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:admin@paterostechnologicalcollege.edu.ph',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Send verification email with OTP
async function sendVerificationEmail(email, otpCode) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'PTC LMS <noreply@paterostechnologicalcollege.edu.ph>',
    to: email,
    subject: 'Verify Your PTC Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0f172a;">Welcome to PTC LMS</h2>
        <p style="color: #475569;">Thank you for registering with Pateros Technological College Learning Management System.</p>
        <p style="color: #475569;">Your verification code is:</p>
        <div style="background: #f1f5f9; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; color: #0f172a; letter-spacing: 4px;">${otpCode}</span>
        </div>
        <p style="color: #475569;">This code will expire in 15 minutes.</p>
        <p style="color: #64748b; font-size: 14px;">If you did not request this verification, please ignore this email.</p>
      </div>
    `
  };

  try {
    await emailTransporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.log("Email sending error:", error.message);
    return false;
  }
}

// Purge expired verification codes
function purgeExpiredCodes() {
  const purgeSql = 'DELETE FROM verification_codes WHERE expires_at < NOW()';
  db.query(purgeSql, (err) => {
    if (err) {
      console.log("Error purging expired codes:", err.message);
    }
  });
}

// Run purge every 5 minutes
setInterval(purgeExpiredCodes, 5 * 60 * 1000);

// Send verification code endpoint
app.post('/api/send-verification', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        message: "Email is required." 
      });
    }
    
    const normalizedEmail = normalizeEmail(email);
    
    // Validate PTC domain
    if (!isValidPTCEmail(normalizedEmail)) {
      return res.status(400).json({ 
        message: "Please use your official PTC email address ending with @paterostechnologicalcollege.edu.ph." 
      });
    }
    
    // Check if user exists
    const userSql = 'SELECT id, email_verified FROM users WHERE email = ?';
    db.query(userSql, [normalizedEmail], async (err, results) => {
      if (err) {
        console.log("Database error during verification send:", err.message);
        return res.status(500).json({ 
          message: "Something went wrong. Please try again." 
        });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ 
          message: "No account found with this email address." 
        });
      }
      
      const user = results[0];
      
      // If already verified, redirect to login
      if (user.email_verified) {
        return res.status(400).json({ 
          message: "This email is already verified. Please log in." 
        });
      }
      
      // Invalidate all previous codes for this user
      const invalidateSql = 'UPDATE verification_codes SET is_used = TRUE WHERE user_id = ? AND is_used = FALSE';
      db.query(invalidateSql, [user.id], (err) => {
        if (err) {
          console.log("Error invalidating old codes:", err.message);
        }
      });
      
      // Generate new OTP
      const otpCode = generateOTP();
      const codeHash = await bcrypt.hash(otpCode, 10);
      
      // Set expiration to 15 minutes from now
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
      
      // Store verification code
      const insertCodeSql = `
        INSERT INTO verification_codes (user_id, email, code_hash, expires_at) 
        VALUES (?, ?, ?, ?)
      `;
      
      db.query(insertCodeSql, [user.id, normalizedEmail, codeHash, expiresAt], async (err) => {
        if (err) {
          console.log("Database error storing verification code:", err.message);
          return res.status(500).json({ 
            message: "Something went wrong. Please try again." 
          });
        }
        
        // Send email
        const emailSent = await sendVerificationEmail(normalizedEmail, otpCode);
        
        if (!emailSent) {
          return res.status(500).json({ 
            message: "Failed to send verification email. Please try again." 
          });
        }
        
        res.json({ 
          message: "Verification code sent successfully. Please check your email.",
          userId: user.id
        });
      });
    });
    
  } catch (error) {
    console.log("Server error during verification send:", error.message);
    res.status(500).json({ 
      message: "Something went wrong. Please try again." 
    });
  }
});

// Verify email code endpoint
app.post('/api/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({ 
        message: "Email and verification code are required." 
      });
    }
    
    const normalizedEmail = normalizeEmail(email);
    
    // Validate code format (6 digits)
    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({ 
        message: "Invalid verification code format." 
      });
    }
    
    // Get user and active verification code
    const sql = `
      SELECT u.id, u.email_verified, u.account_status, vc.id as code_id, vc.code_hash, 
             vc.expires_at, vc.attempts, vc.is_used
      FROM users u
      LEFT JOIN verification_codes vc ON u.id = vc.user_id AND vc.is_used = FALSE
      WHERE u.email = ?
      ORDER BY vc.created_at DESC
      LIMIT 1
    `;
    
    db.query(sql, [normalizedEmail], async (err, results) => {
      if (err) {
        console.log("Database error during verification:", err.message);
        return res.status(500).json({ 
          message: "Something went wrong. Please try again." 
        });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ 
          message: "No account found with this email address." 
        });
      }
      
      const user = results[0];
      
      // If already verified
      if (user.email_verified) {
        return res.status(400).json({ 
          message: "This email is already verified. Please log in." 
        });
      }
      
      // Check if verification code exists
      if (!user.code_id) {
        return res.status(400).json({ 
          message: "No active verification code found. Please request a new code." 
        });
      }
      
      // Check if code is already used
      if (user.is_used) {
        return res.status(400).json({ 
          message: "This verification code has already been used. Please request a new code." 
        });
      }
      
      // Check if code is expired
      if (new Date(user.expires_at) < new Date()) {
        return res.status(400).json({ 
          message: "Verification code has expired. Please request a new code." 
        });
      }
      
      // Check attempt limit (max 5 attempts)
      if (user.attempts >= 5) {
        return res.status(429).json({ 
          message: "Maximum verification attempts exceeded. Please request a new code." 
        });
      }
      
      // Verify code hash
      const isCodeValid = await bcrypt.compare(code, user.code_hash);
      
      if (!isCodeValid) {
        // Increment attempt count
        const incrementSql = 'UPDATE verification_codes SET attempts = attempts + 1 WHERE id = ?';
        db.query(incrementSql, [user.code_id]);
        
        const remainingAttempts = 5 - (user.attempts + 1);
        return res.status(400).json({ 
          message: `Invalid verification code. ${remainingAttempts} attempts remaining.` 
        });
      }
      
      // Mark code as used
      const markUsedSql = 'UPDATE verification_codes SET is_used = TRUE WHERE id = ?';
      db.query(markUsedSql, [user.code_id]);
      
      // Update user as verified and active
      // Update email as verified, but enforce registration approval workflow for students
      const updateUserSql = `
        UPDATE users 
        SET email_verified = TRUE, 
            account_status = CASE WHEN role = 'student' AND account_status = 'pending' THEN 'pending' ELSE account_status END
        WHERE id = ?
      `;
      
      db.query(updateUserSql, [user.id], (err) => {
        if (err) {
          console.log("Database error updating user status:", err.message);
          return res.status(500).json({ 
            message: "Something went wrong. Please try again." 
          });
        }
        
        res.json({ 
          message: user.role === 'student' && user.account_status === 'pending' 
            ? "Email verified successfully! Your account registration is now pending review and approval by Faculty, Dean, or Admin before you can log in."
            : "Email verified successfully! Please log in.",
          isPendingApproval: user.role === 'student' && user.account_status === 'pending',
          success: true
        });
      });
    });
    
  } catch (error) {
    console.log("Server error during verification:", error.message);
    res.status(500).json({ 
      message: "Something went wrong. Please try again." 
    });
  }
});

// Registration endpoint with full security
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;
    
    // Validate required fields
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ 
        message: "Email, password, and confirm password are required." 
      });
    }
    
    // Normalize email
    const normalizedEmail = normalizeEmail(email);
    
    // Validate PTC domain
    if (!isValidPTCEmail(normalizedEmail)) {
      return res.status(400).json({ 
        message: "Please use your official PTC email address ending with @paterostechnologicalcollege.edu.ph." 
      });
    }
    
    // Validate password complexity
    if (!isValidPassword(password)) {
      return res.status(400).json({ 
        message: "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character." 
      });
    }
    
    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({ 
        message: "Passwords do not match." 
      });
    }
    
    // Privileged role guard - force student role for public registration
    const userRole = isAllowedRole(role) ? role : 'student';
    
    // Check for duplicate email
    const checkDuplicateSql = 'SELECT id FROM users WHERE email = ?';
    db.query(checkDuplicateSql, [normalizedEmail], async (err, results) => {
      if (err) {
        console.log("Database error during duplicate check:", err.message);
        return res.status(500).json({ 
          message: "Something went wrong while creating your account. Please try again." 
        });
      }
      
      if (results.length > 0) {
        return res.status(409).json({ 
          message: "This PTC email is already registered. Please log in or use Forgot Password if you cannot access your account." 
        });
      }
      
      // Hash password securely
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      
      // Insert user into database
      const fullName = req.body.fullName || req.body.name || "";
      const studentId = req.body.studentId || "";
      const program = req.body.program || "BS Information Technology";
      const section = req.body.section || "BSIT 3-A";

      const insertSql = `
        INSERT INTO users (email, password_hash, role, email_verified, account_status, full_name, student_id, program, section) 
        VALUES (?, ?, ?, FALSE, 'pending', ?, ?, ?, ?)
      `;
      
      db.query(insertSql, [normalizedEmail, passwordHash, userRole, fullName, studentId, program, section], async (err, result) => {
        if (err) {
          console.log("Database error during user creation:", err.message);
          return res.status(500).json({ 
            message: "Something went wrong while creating your account. Please try again." 
          });
        }
        
        const userId = result.insertId;
        
        // Generate and send verification email automatically
        const otpCode = generateOTP();
        const codeHash = await bcrypt.hash(otpCode, 10);
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        
        const insertCodeSql = `
          INSERT INTO verification_codes (user_id, email, code_hash, expires_at) 
          VALUES (?, ?, ?, ?)
        `;
        
        db.query(insertCodeSql, [userId, normalizedEmail, codeHash, expiresAt], async (codeErr) => {
          if (codeErr) {
            console.log("Database error storing verification code:", codeErr.message);
          }
          
          // Send email (non-blocking - don't fail registration if email fails)
          const emailSent = await sendVerificationEmail(normalizedEmail, otpCode);
          
          if (!emailSent) {
            console.log("Failed to send verification email after registration");
          }
        });
        
        res.status(201).json({ 
          message: "Account created successfully. Please verify your email to activate your account.",
          userId: userId,
          email: normalizedEmail
        });
      });
    });
  } catch (error) {
    console.log("Server error during registration:", error.message);
    res.status(500).json({ 
      message: "Something went wrong while creating your account. Please try again." 
    });
  }
});

// Login endpoint with password verification
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required." 
      });
    }
    
    // Map username shortcuts to full email addresses
    const mappedEmail = mapUsernameToEmail(email);
    const normalizedEmail = normalizeEmail(mappedEmail || email);
    
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [normalizedEmail], async (err, results) => {
      if (err) {
        console.log("Database error during login:", err.message);
        return res.status(500).json({ 
          message: "Something went wrong. Please try again." 
        });
      }
      
      if (results.length === 0) {
        return res.status(401).json({ 
          message: "Invalid email or password." 
        });
      }
      
      const user = results[0];
      
      // Verify password hash
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      
      if (!isPasswordValid) {
        return res.status(401).json({ 
          message: "Invalid email or password." 
        });
      }
      
      // Check account approval status for registration workflow
      if (user.role === 'student') {
        if (user.account_status === 'pending') {
          return res.status(403).json({
            status: "pending",
            message: "Your registration is currently pending approval by Faculty, Dean, or Admin. Please wait for an administrator to review your application."
          });
        }
        if (user.account_status === 'rejected') {
          return res.status(403).json({
            status: "rejected",
            message: `Your account registration was rejected.${user.rejection_reason ? " Reason: " + user.rejection_reason : ""} Please contact administration or submit a new registration.`
          });
        }
      }
      if (user.account_status !== 'active' && user.account_status !== 'approved') {
        return res.status(403).json({ 
          message: "Your account is not active. Please contact support or administration." 
        });
      }
      
      // Return user data without password hash
      const { password_hash, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    });
    
  } catch (error) {
    console.log("Server error during login:", error.message);
    res.status(500).json({ 
      message: "Something went wrong. Please try again." 
    });
  }
});

// Admin: Get all users (admin-only)
app.get('/api/admin/users', (req, res) => {
  const sql = `
    SELECT id, email, role, email_verified, account_status, created_at, updated_at
    FROM users
    ORDER BY created_at DESC
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.log("Database error fetching users:", err.message);
      return res.status(500).json({ 
        message: "Something went wrong. Please try again." 
      });
    }
    
    res.json({ users: results });
  });
});


// Role-based User Management: Get accounts by role (admin, dean, professor, student)
app.get("/api/users/role/:role", (req, res) => {
  const { role } = req.params;
  const requesterRole = (req.headers["x-user-role"] || req.query.userRole || "administrator").toLowerCase();
  
  const targetRole = role.toLowerCase();
  const isAdmin = ["admin", "administrator"].includes(requesterRole);
  const isDean = requesterRole === "dean";
  const isFaculty = ["professor", "teacher", "faculty"].includes(requesterRole);

  if (!isAdmin && !isDean && !isFaculty) {
    return res.status(403).json({ message: "Access denied." });
  }

  if (["administrator", "admin", "dean"].includes(targetRole) && !isAdmin) {
    return res.status(403).json({ message: "Access denied to administrative accounts." });
  }

  if (targetRole === "professor" && !isAdmin && !isDean) {
    return res.status(403).json({ message: "Access denied to faculty accounts." });
  }

  const queryRoles = targetRole === "professor" ? ["professor", "teacher"] : [targetRole];
  const placeholders = queryRoles.map(() => "?").join(",");

  const sql = `
    SELECT id, email, role, email_verified, account_status, created_at, updated_at
    FROM users
    WHERE role IN (${placeholders})
    ORDER BY created_at DESC
  `;

  db.query(sql, queryRoles, (err, results) => {
    if (err) {
      console.log("Database error fetching users by role:", err.message);
      return res.status(500).json({ message: "Something went wrong. Please try again." });
    }
    res.json({ users: results });
  });
});

// Create new user account (role-authorized)
app.post("/api/users", async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !role) {
    return res.status(400).json({ message: "Email and role are required." });
  }
  const validRoles = ["student", "professor", "dean", "administrator"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role." });
  }
  try {
    const defaultPassword = password || "PtcLms2026!";
    const password_hash = await bcrypt.hash(defaultPassword, 10);
    const sql = `
      INSERT INTO users (email, password_hash, role, email_verified, account_status)
      VALUES (?, ?, ?, TRUE, "active")
    `;
    db.query(sql, [email.trim().toLowerCase(), password_hash, role], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ message: "An account with this email already exists." });
        }
        return res.status(500).json({ message: "Failed to create user account." });
      }
      res.status(201).json({
        success: true,
        message: `${role} account created successfully.`,
        userId: result.insertId
      });
    });
  } catch (err) {
    res.status(500).json({ message: "Error processing account creation." });
  }
});

// Delete user account
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const requesterRole = (req.headers["x-user-role"] || "administrator").toLowerCase();
  if (!["admin", "administrator", "dean"].includes(requesterRole)) {
    return res.status(403).json({ message: "Access denied." });
  }
  const sql = "DELETE FROM users WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Failed to remove user account." });
    }
    res.json({ success: true, message: "User account removed." });
  });
});

// --- STUDENT MANAGEMENT & REGISTRATION APPROVAL WORKFLOW (Faculty, Dean, Admin) ---
const isAuthorizedReviewer = (role) => {
  const normalized = (role || "").toLowerCase();
  return ["professor", "teacher", "faculty", "dean", "administrator", "admin"].includes(normalized);
};

// GET /api/students - List all student accounts with approval metadata
app.get("/api/students", (req, res) => {
  const requesterRole = req.headers["x-user-role"] || req.query.userRole;
  if (requesterRole && !isAuthorizedReviewer(requesterRole)) {
    return res.status(403).json({ message: "Access denied. Only Faculty, Dean, or Admin can access Student Management." });
  }

  const sql = `
    SELECT id, email, full_name, student_id, program, section, role, email_verified, 
           account_status, approved_by, approved_by_role, approved_at, rejected_by, 
           rejected_at, rejection_reason, created_at, updated_at
    FROM users
    WHERE role = 'student'
    ORDER BY CASE WHEN account_status = 'pending' THEN 0 ELSE 1 END, created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.log("Error fetching students:", err.message);
      return res.status(500).json({ message: "Database error fetching students" });
    }
    res.json({ students: results });
  });
});

// POST /api/students/:id/approve - Approve a student registration
app.post("/api/students/:id/approve", (req, res) => {
  const { id } = req.params;
  const approverRole = req.headers["x-user-role"] || req.body.approverRole || "Admin";
  const approverName = req.headers["x-user-name"] || req.body.approverName || "Administrator";

  if (!isAuthorizedReviewer(approverRole)) {
    return res.status(403).json({ message: "Unauthorized. Only Faculty, Dean, or Admin can approve student registrations." });
  }

  const updateSql = `
    UPDATE users
    SET account_status = 'approved',
        approved_by = ?,
        approved_by_role = ?,
        approved_at = CURRENT_TIMESTAMP,
        rejected_by = NULL,
        rejected_at = NULL,
        rejection_reason = NULL,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND role = 'student'
  `;

  db.query(updateSql, [approverName, approverRole, id], (err, result) => {
    if (err) {
      console.log("Error approving student:", err.message);
      return res.status(500).json({ message: "Failed to approve student" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student record not found" });
    }
    res.json({ success: true, message: "Student registration approved successfully!" });
  });
});

// POST /api/students/:id/reject - Reject a student registration
app.post("/api/students/:id/reject", (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const reviewerRole = req.headers["x-user-role"] || req.body.approverRole || "Admin";
  const reviewerName = req.headers["x-user-name"] || req.body.approverName || "Administrator";

  if (!isAuthorizedReviewer(reviewerRole)) {
    return res.status(403).json({ message: "Unauthorized. Only Faculty, Dean, or Admin can reject student registrations." });
  }

  const updateSql = `
    UPDATE users
    SET account_status = 'rejected',
        rejected_by = ?,
        rejected_at = CURRENT_TIMESTAMP,
        rejection_reason = ?,
        approved_by = NULL,
        approved_at = NULL,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND role = 'student'
  `;

  db.query(updateSql, [reviewerName, reason || "Did not meet admission / verification criteria", id], (err, result) => {
    if (err) {
      console.log("Error rejecting student:", err.message);
      return res.status(500).json({ message: "Failed to reject student registration" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student record not found" });
    }
    res.json({ success: true, message: "Student registration rejected." });
  });
});

// Admin: Update user role/details (admin-only)
app.put('/api/admin/users/:id', (req, res) => {
  const { id } = req.params;
  const { role, email_verified, account_status } = req.body;
  
  if (!role) {
    return res.status(400).json({ 
      message: "Role is required." 
    });
  }
  
  const validRoles = ['student', 'professor', 'dean', 'administrator'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ 
      message: "Invalid role." 
    });
  }
  
  const updateSql = `
    UPDATE users 
    SET role = ?, 
        email_verified = COALESCE(?, email_verified),
        account_status = COALESCE(?, account_status),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  db.query(updateSql, [role, email_verified, account_status, id], (err, result) => {
    if (err) {
      console.log("Database error updating user:", err.message);
      return res.status(500).json({ 
        message: "Something went wrong. Please try again." 
      });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: "User not found." 
      });
    }
    
    res.json({ 
      message: "User updated successfully.",
      auditNote: "Role modified by Administrator"
    });
  });
});

// Forgot Password - Send Reset OTP
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        message: "Email is required." 
      });
    }
    
    const normalizedEmail = normalizeEmail(email);
    
    // Validate PTC domain
    if (!isValidPTCEmail(normalizedEmail)) {
      return res.status(400).json({ 
        message: "Please use your official PTC email address ending with @paterostechnologicalcollege.edu.ph." 
      });
    }
    
    // Check if user exists
    const userSql = 'SELECT id, email FROM users WHERE email = ?';
    db.query(userSql, [normalizedEmail], async (err, results) => {
      if (err) {
        console.log("Database error during forgot password:", err.message);
        return res.status(500).json({ 
          message: "Something went wrong. Please try again." 
        });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ 
          message: "No account found with this PTC email address."
        });
      }
      
      const user = results[0];
      
      // Invalidate all previous reset codes for this user
      const invalidateSql = 'UPDATE verification_codes SET is_used = TRUE WHERE user_id = ? AND is_used = FALSE';
      db.query(invalidateSql, [user.id], (err) => {
        if (err) {
          console.log("Error invalidating old reset codes:", err.message);
        }
      });
      
      // Generate new OTP for password reset
      const otpCode = generateOTP();
      const codeHash = await bcrypt.hash(otpCode, 10);
      
      // Set expiration to 10 minutes from now
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      
      // Store reset code
      const insertCodeSql = `
        INSERT INTO verification_codes (user_id, email, code_hash, expires_at) 
        VALUES (?, ?, ?, ?)
      `;
      
      db.query(insertCodeSql, [user.id, normalizedEmail, codeHash, expiresAt], async (err) => {
        if (err) {
          console.log("Database error storing reset code:", err.message);
          return res.status(500).json({ 
            message: "Something went wrong. Please try again." 
          });
        }
        
        // Send email with reset code
        const mailOptions = {
          from: process.env.EMAIL_FROM || 'PTC LMS <noreply@paterostechnologicalcollege.edu.ph>',
          to: normalizedEmail,
          subject: 'Pateros Technological College LMS - Password Reset Request',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #0f172a;">Pateros Technological College LMS - Password Reset Request</h2>
              <p style="color: #475569;">You requested to reset your PTC LMS account password. Use the verification code below to authorize your password reset:</p>
              <div style="background: #f1f5f9; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; color: #0f172a; letter-spacing: 4px;">${otpCode}</span>
              </div>
              <p style="color: #475569;">This code is valid for 10 minutes. If you did not request this code, please ignore this email or contact the PTC LMS Administrator.</p>
            </div>
          `
        };
        
        try {
          await emailTransporter.sendMail(mailOptions);
          res.json({ 
            message: "If an account exists with this email, a password reset code has been sent."
          });
        } catch (error) {
          console.log("SMTP Error - Raw server error:", error);
          res.status(500).json({ 
            message: "Failed to send reset code. Please check your email address or connection." 
          });
        }
      });
    });
    
  } catch (error) {
    console.log("Server error during forgot password:", error.message);
    res.status(500).json({ 
      message: "Something went wrong. Please try again." 
    });
  }
});

// Reset Password - Verify OTP and Update Password
app.post('/api/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    
    if (!email || !code || !newPassword) {
      return res.status(400).json({ 
        message: "Email, verification code, and new password are required." 
      });
    }
    
    const normalizedEmail = normalizeEmail(email);
    
    // Validate code format (6 digits)
    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({ 
        message: "Invalid verification code format." 
      });
    }
    
    // Validate password complexity (bypass for seed accounts)
    if (!isSeedAccount(normalizedEmail) && !isValidPassword(newPassword)) {
      return res.status(400).json({ 
        message: "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character." 
      });
    }
    
    // Get user and active reset code
    const sql = `
      SELECT u.id, u.email, vc.id as code_id, vc.code_hash, 
             vc.expires_at, vc.attempts, vc.is_used
      FROM users u
      LEFT JOIN verification_codes vc ON u.id = vc.user_id AND vc.is_used = FALSE
      WHERE u.email = ?
      ORDER BY vc.created_at DESC
      LIMIT 1
    `;
    
    db.query(sql, [normalizedEmail], async (err, results) => {
      if (err) {
        console.log("Database error during password reset:", err.message);
        return res.status(500).json({ 
          message: "Something went wrong. Please try again." 
        });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ 
          message: "No account found with this email address." 
        });
      }
      
      const user = results[0];
      
      // Check if reset code exists
      if (!user.code_id) {
        return res.status(400).json({ 
          message: "No active reset code found. Please request a new code." 
        });
      }
      
      // Check if code is already used
      if (user.is_used) {
        return res.status(400).json({ 
          message: "This reset code has already been used. Please request a new code." 
        });
      }
      
      // Check if code is expired
      if (new Date(user.expires_at) < new Date()) {
        return res.status(400).json({ 
          message: "Reset code has expired. Please request a new code." 
        });
      }
      
      // Check attempt limit (max 5 attempts)
      if (user.attempts >= 5) {
        return res.status(429).json({ 
          message: "Maximum reset attempts exceeded. Please request a new code." 
        });
      }
      
      // Verify code hash
      const isCodeValid = await bcrypt.compare(code, user.code_hash);
      
      if (!isCodeValid) {
        // Increment attempt count
        const incrementSql = 'UPDATE verification_codes SET attempts = attempts + 1 WHERE id = ?';
        db.query(incrementSql, [user.code_id]);
        
        const remainingAttempts = 5 - (user.attempts + 1);
        return res.status(400).json({ 
          message: `Invalid verification code. ${remainingAttempts} attempts remaining.` 
        });
      }
      
      // Mark code as used
      const markUsedSql = 'UPDATE verification_codes SET is_used = TRUE WHERE id = ?';
      db.query(markUsedSql, [user.code_id]);
      
      // Hash new password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(newPassword, saltRounds);
      
      // Update password in database
      const updatePasswordSql = 'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      
      db.query(updatePasswordSql, [passwordHash, user.id], (err) => {
        if (err) {
          console.log("Database error updating password:", err.message);
          return res.status(500).json({ 
            message: "Something went wrong. Please try again." 
          });
        }
        
        res.json({ 
          message: "Password updated successfully. Please log in with your new password.",
          success: true
        });
      });
    });
    
  } catch (error) {
    console.log("Server error during password reset:", error.message);
    res.status(500).json({ 
      message: "Something went wrong. Please try again." 
    });
  }
});

// ==================== PUSH NOTIFICATION ENDPOINTS ====================

// Get VAPID public key for frontend subscription
app.get('/api/notifications/vapid-public-key', (req, res) => {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  if (!publicKey) {
    return res.status(500).json({ error: 'VAPID public key not configured' });
  }
  res.json({ publicKey });
});

// Subscribe to push notifications
app.post('/api/notifications/subscribe', (req, res) => {
  const { endpoint, keys } = req.body;
  
  if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
    return res.status(400).json({ message: 'Invalid subscription data' });
  }
  
  // For now, we'll store without user_id - in production, this should come from JWT/session
  const userId = req.body.user_id || 1; // Default to user 1 for testing
  
  const sql = `
    INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    p256dh = VALUES(p256dh),
    auth = VALUES(auth),
    updated_at = CURRENT_TIMESTAMP
  `;
  
  db.query(sql, [userId, endpoint, keys.p256dh, keys.auth], (err) => {
    if (err) {
      console.log('Error saving push subscription:', err.message);
      return res.status(500).json({ message: 'Failed to save subscription' });
    }
    console.log('✅ Push subscription saved for user:', userId);
    res.json({ message: 'Subscription saved successfully' });
  });
});

// Unsubscribe from push notifications
app.post('/api/notifications/unsubscribe', (req, res) => {
  const { endpoint } = req.body;
  
  if (!endpoint) {
    return res.status(400).json({ message: 'Endpoint is required' });
  }
  
  const sql = 'DELETE FROM push_subscriptions WHERE endpoint = ?';
  
  db.query(sql, [endpoint], (err) => {
    if (err) {
      console.log('Error removing push subscription:', err.message);
      return res.status(500).json({ message: 'Failed to remove subscription' });
    }
    console.log('✅ Push subscription removed');
    res.json({ message: 'Subscription removed successfully' });
  });
});

// Send push notification to a specific user
async function sendPushNotification(userId, title, body, data = {}) {
  const sql = 'SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE user_id = ?';
  
  db.query(sql, [userId], async (err, results) => {
    if (err) {
      console.log('Error fetching push subscriptions:', err.message);
      return;
    }
    
    if (results.length === 0) {
      console.log('No push subscriptions found for user:', userId);
      return;
    }
    
    const pushPayload = JSON.stringify({
      title,
      body,
      icon: '/PTCLOGO.webp',
      badge: '/PTCLOGO.webp',
      data: {
       url: data.url || '/',
        ...data
      }
    });
    
    for (const subscription of results) {
      const pushSubscription = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth
        }
      };
      
      try {
        await webpush.sendNotification(pushSubscription, pushPayload);
        console.log('✅ Push notification sent to user:', userId);
      } catch (error) {
        console.log('❌ Failed to send push notification:', error.message);
        
        // Remove invalid subscription
        if (error.statusCode === 410) {
          const deleteSql = 'DELETE FROM push_subscriptions WHERE endpoint = ?';
          db.query(deleteSql, [subscription.endpoint]);
        }
      }
    }
  });
}

// Send push notification to multiple users
async function sendPushNotificationToUsers(userIds, title, body, data = {}) {
  for (const userId of userIds) {
    await sendPushNotification(userId, title, body, data);
  }
}

// ==================== TEST ENDPOINT FOR PUSH NOTIFICATIONS ====================

// Test endpoint to send a push notification to all subscribed users
app.post('/api/notifications/test', async (req, res) => {
  const { title, body, userIds } = req.body;
  
  if (!title || !body) {
    return res.status(400).json({ message: 'Title and body are required' });
  }
  
  try {
    if (userIds && Array.isArray(userIds)) {
      // Send to specific users
      await sendPushNotificationToUsers(userIds, title, body);
      res.json({ message: `Push notification sent to ${userIds.length} users` });
    } else {
      // Send to all users with subscriptions
      const sql = 'SELECT DISTINCT user_id FROM push_subscriptions';
      db.query(sql, async (err, results) => {
        if (err) {
          console.log('Error fetching user IDs:', err.message);
          return res.status(500).json({ message: 'Failed to fetch subscriptions' });
        }
        
        const userIds = results.map(row => row.user_id);
        if (userIds.length === 0) {
          return res.json({ message: 'No subscribers found' });
        }
        
        await sendPushNotificationToUsers(userIds, title, body);
        res.json({ message: `Push notification sent to ${userIds.length} users` });
      });
    }
  } catch (error) {
    console.log('Error sending test notification:', error.message);
    res.status(500).json({ message: 'Failed to send notification' });
  }
});

// ==================== EXAMPLE CLASSWORK/ANNOUNCEMENT ENDPOINTS ====================
// These are example endpoints that demonstrate push notification integration
// In production, these should be integrated with your actual LMS classwork/announcement system

// Example: Create classwork and send push notifications to enrolled students
app.post('/api/classwork/create', async (req, res) => {
  const { title, description, classId, professorId } = req.body;
  
  if (!title || !classId || !professorId) {
    return res.status(400).json({ message: 'Title, classId, and professorId are required' });
  }
  
  try {
    // TODO: Save classwork to database
    // const insertSql = 'INSERT INTO classwork (title, description, class_id, professor_id) VALUES (?, ?, ?, ?)';
    // db.query(insertSql, [title, description, classId, professorId], ...);
    
    // Get enrolled students for this class
    // TODO: Replace with actual enrollment query
    // const enrollmentSql = 'SELECT student_id FROM enrollments WHERE class_id = ?';
    // db.query(enrollmentSql, [classId], async (err, results) => {
    //   const studentIds = results.map(row => row.student_id);
    //   
    //   // Send push notifications to all enrolled students
    //   await sendPushNotificationToUsers(studentIds, 
    //     `📢 New Classwork: ${title}`,
    //     `Prof. posted a new assignment.`,
    //     { url: `/class/${classId}` }
    //   );
    // });
    
    // For now, send to all subscribed users as a demo
    const sql = 'SELECT DISTINCT user_id FROM push_subscriptions';
    db.query(sql, async (err, results) => {
      const userIds = results.map(row => row.user_id);
      
      await sendPushNotificationToUsers(userIds,
        `📢 New Classwork: ${title}`,
        `Prof. posted a new assignment.`,
        { url: `/class/${classId}` }
      );
      
      res.json({ 
        message: 'Classwork created and notifications sent',
        classworkId: Date.now() // placeholder
      });
    });
  } catch (error) {
    console.log('Error creating classwork:', error.message);
    res.status(500).json({ message: 'Failed to create classwork' });
  }
});

// Example: Create announcement and send push notifications
app.post('/api/announcements/create', async (req, res) => {
  const { title, content, targetRole } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }
  
  try {
    // TODO: Save announcement to database
    // const insertSql = 'INSERT INTO announcements (title, content, target_role) VALUES (?, ?, ?)';
    // db.query(insertSql, [title, content, targetRole], ...);
    
    // Get users based on target role
    let userSql = 'SELECT id FROM users';
    const params = [];
    
    if (targetRole) {
      userSql += ' WHERE role = ?';
      params.push(targetRole);
    }
    
    db.query(userSql, params, async (err, results) => {
      const userIds = results.map(row => row.id);
      
      await sendPushNotificationToUsers(userIds,
        `📢 Announcement: ${title}`,
        content.substring(0, 100) + (content.length > 100 ? '...' : ''),
        { url: '/announcements' }
      );
      
      res.json({ 
        message: 'Announcement created and notifications sent',
        announcementId: Date.now() // placeholder
      });
    });
  } catch (error) {
    console.log('Error creating announcement:', error.message);
    res.status(500).json({ message: 'Failed to create announcement' });
  }
});


// --- REAL-TIME WEBRTC SIGNALING & MEETING COORDINATION ---
const activeMeetingRooms = new Map();

io.on('connection', (socket) => {
  console.log('🔌 Socket connected to WebRTC signaling:', socket.id);

  socket.on('join-meeting-room', ({ roomId, userId, userName, role }) => {
    socket.join(roomId);
    if (!activeMeetingRooms.has(roomId)) {
      activeMeetingRooms.set(roomId, new Map());
    }
    const roomParticipants = activeMeetingRooms.get(roomId);
    roomParticipants.set(socket.id, { socketId: socket.id, userId, userName, role, joinedAt: new Date() });

    socket.to(roomId).emit('user-joined-meeting', {
      socketId: socket.id,
      userId,
      userName,
      role
    });

    const participantsList = Array.from(roomParticipants.values()).filter(p => p.socketId !== socket.id);
    socket.emit('meeting-room-users', { participants: participantsList });
  });

  socket.on('meeting-signal-offer', ({ targetSocketId, offer, senderName }) => {
    io.to(targetSocketId).emit('meeting-signal-offer', { senderSocketId: socket.id, offer, senderName });
  });

  socket.on('meeting-signal-answer', ({ targetSocketId, answer }) => {
    io.to(targetSocketId).emit('meeting-signal-answer', { senderSocketId: socket.id, answer });
  });

  socket.on('meeting-ice-candidate', ({ targetSocketId, candidate }) => {
    io.to(targetSocketId).emit('meeting-ice-candidate', { senderSocketId: socket.id, candidate });
  });

  socket.on('meeting-chat-message', ({ roomId, message, senderName, timestamp }) => {
    io.to(roomId).emit('meeting-chat-broadcast', { message, senderName, timestamp: timestamp || new Date().toISOString() });
  });

  socket.on('disconnect', () => {
    activeMeetingRooms.forEach((participants, roomId) => {
      if (participants.has(socket.id)) {
        const leavingUser = participants.get(socket.id);
        participants.delete(socket.id);
        socket.to(roomId).emit('user-left-meeting', { socketId: socket.id, userName: leavingUser?.userName });
        if (participants.size === 0) activeMeetingRooms.delete(roomId);
      }
    });
  });
});

// Automatic Attendance Logging Endpoint for Video Meetings
app.post('/api/attendance/log', (req, res) => {
  const { studentName, subjectCode, status } = req.body;
  console.log(`📝 Attendance logged for ${studentName} in ${subjectCode}`);
  res.json({ success: true, message: 'Attendance record synchronized with LMS' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));