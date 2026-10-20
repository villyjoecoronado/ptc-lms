import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Shield, ArrowLeft, RefreshCw, Key, CheckCircle } from 'lucide-react';
import axios from 'axios';

const ForgotPassword = ({ isDarkMode, onBack, onResetComplete }) => {
  const [step, setStep] = useState(1); // 1: Email input, 2: OTP input, 3: New password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  // Password requirements
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  // Check password requirements
  useEffect(() => {
    setPasswordRequirements({
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
    });
  }, [newPassword]);

  // Handle email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your PTC email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/forgot-password', {
        email: email
      });

      if (response.data.message) {
        setStep(2);
        setError('');
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP code input
  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    setError('');
  };

  // Verify OTP code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/reset-password', {
        email: email,
        code: code,
        newPassword: 'TEMP' // Will be updated in next step
      });

      // If code is valid, proceed to password step
      setStep(3);
      setError('');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP code
  const handleResend = async () => {
    if (cooldown > 0) return;

    setResendLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/forgot-password', {
        email: email
      });

      if (response.data.message) {
        setCooldown(60);
        setError('');
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError('Failed to resend verification code. Please try again.');
      }
    } finally {
      setResendLoading(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    // Validate password requirements
    const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);
    if (!allRequirementsMet) {
      setError('Password must meet all requirements.');
      return;
    }

    // Validate password match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/reset-password', {
        email: email,
        code: code,
        newPassword: newPassword
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onResetComplete();
        }, 2000);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Cooldown timer
  useEffect(() => {
    let interval;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? 'bg-slate-950' : 'bg-gray-100'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-md"
      >
        <div 
          className={`rounded-2xl shadow-xl p-8 ${isDarkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-gray-200'}`}
        >
          {/* Back Button */}
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-sm transition-colors hover:opacity-70"
            style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
          >
            <ArrowLeft size={16} />
            Back to Login
          </button>

          {/* Step 1: Email Input */}
          {step === 1 && (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div 
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}
                >
                  <Mail size={32} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                </div>
                <h2 
                  className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                >
                  Forgot Password?
                </h2>
                <p 
                  className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
                >
                  Enter your PTC email address to receive a password reset code.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className={`mb-6 p-4 rounded-lg text-sm ${isDarkMode ? 'bg-red-900/20 border border-red-800 text-red-400' : 'bg-red-50 border border-red-200 text-red-600'}`}>
                  {error}
                </div>
              )}

              {/* Email Form */}
              <form onSubmit={handleEmailSubmit}>
                <div className="mb-6">
                  <label 
                    className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}
                  >
                    PTC Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="username@paterostechnologicalcollege.edu.ph"
                    className={`w-full px-4 py-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all ${isDarkMode ? 'bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500' : 'bg-gray-100 border border-gray-200 text-slate-900 placeholder:text-slate-400'}`}
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full py-3 rounded-lg font-semibold text-white transition-all mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Code'}
                </motion.button>
              </form>
            </>
          )}

          {/* Step 2: OTP Input */}
          {step === 2 && (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div 
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}
                >
                  <Key size={32} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                </div>
                <h2 
                  className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                >
                  Enter Reset Code
                </h2>
                <p 
                  className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
                >
                  A 6-digit code has been sent to{' '}
                  <span className={`font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {email}
                  </span>
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className={`mb-6 p-4 rounded-lg text-sm ${isDarkMode ? 'bg-red-900/20 border border-red-800 text-red-400' : 'bg-red-50 border border-red-200 text-red-600'}`}>
                  {error}
                </div>
              )}

              {/* OTP Form */}
              <form onSubmit={handleVerifyCode}>
                <div className="mb-6">
                  <label 
                    className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}
                  >
                    Verification Code
                  </label>
                  <div className="flex gap-2 justify-center">
                    {[...Array(6)].map((_, index) => (
                      <div
                        key={index}
                        className={`w-12 h-14 rounded-lg flex items-center justify-center text-2xl font-bold transition-all ${isDarkMode ? 'bg-slate-800 border-2' : 'bg-gray-100 border-2'}`}
                        style={{
                          borderColor: code[index] ? '#3b82f6' : (isDarkMode ? '#334155' : '#e2e8f0'),
                          color: isDarkMode ? '#ffffff' : '#0f172a'
                        }}
                      >
                        {code[index] || ''}
                      </div>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={code}
                    onChange={handleCodeChange}
                    maxLength={6}
                    className="opacity-0 absolute"
                    autoFocus
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  whileHover={{ scale: loading || code.length !== 6 ? 1 : 1.02 }}
                  whileTap={{ scale: loading || code.length !== 6 ? 1 : 0.98 }}
                  className="w-full py-3 rounded-lg font-semibold text-white transition-all mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={loading || code.length !== 6}
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </motion.button>

                {/* Resend Code */}
                <div className="text-center">
                  <p 
                    className={`text-sm mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
                  >
                    Didn't receive the code?
                  </p>
                  <motion.button
                    type="button"
                    onClick={handleResend}
                    disabled={cooldown > 0 || resendLoading}
                    whileHover={{ scale: cooldown > 0 || resendLoading ? 1 : 1.02 }}
                    whileTap={{ scale: cooldown > 0 || resendLoading ? 1 : 0.98 }}
                    className={`flex items-center justify-center gap-2 mx-auto text-sm font-medium transition-colors ${cooldown > 0 || resendLoading ? 'text-slate-500 cursor-not-allowed opacity-60' : 'text-blue-600 dark:text-blue-400'}`}
                    disabled={cooldown > 0 || resendLoading}
                  >
                    <RefreshCw size={16} className={resendLoading ? 'animate-spin' : ''} />
                    {resendLoading ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
                  </motion.button>
                </div>
              </form>
            </>
          )}

          {/* Step 3: New Password */}
          {step === 3 && !success && (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div 
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'}`}
                >
                  <Shield size={32} className={isDarkMode ? 'text-green-400' : 'text-green-600'} />
                </div>
                <h2 
                  className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                >
                  Set New Password
                </h2>
                <p 
                  className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
                >
                  Create a strong password for your account.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className={`mb-6 p-4 rounded-lg text-sm ${isDarkMode ? 'bg-red-900/20 border border-red-800 text-red-400' : 'bg-red-50 border border-red-200 text-red-600'}`}>
                  {error}
                </div>
              )}

              {/* Password Form */}
              <form onSubmit={handlePasswordReset}>
                <div className="mb-4">
                  <label 
                    className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter new password"
                    className={`w-full px-4 py-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all ${isDarkMode ? 'bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500' : 'bg-gray-100 border border-gray-200 text-slate-900 placeholder:text-slate-400'}`}
                    required
                  />
                </div>

                {/* Password Requirements */}
                <div className={`mb-4 p-3 rounded-lg text-xs ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                  <p className={`font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Password must contain:</p>
                  <div className="space-y-1">
                    <p className={passwordRequirements.length ? 'text-green-600' : (isDarkMode ? 'text-slate-500' : 'text-slate-400')}>
                      {passwordRequirements.length ? '✓' : '○'} At least 8 characters
                    </p>
                    <p className={passwordRequirements.uppercase ? 'text-green-600' : (isDarkMode ? 'text-slate-500' : 'text-slate-400')}>
                      {passwordRequirements.uppercase ? '✓' : '○'} One uppercase letter
                    </p>
                    <p className={passwordRequirements.lowercase ? 'text-green-600' : (isDarkMode ? 'text-slate-500' : 'text-slate-400')}>
                      {passwordRequirements.lowercase ? '✓' : '○'} One lowercase letter
                    </p>
                    <p className={passwordRequirements.number ? 'text-green-600' : (isDarkMode ? 'text-slate-500' : 'text-slate-400')}>
                      {passwordRequirements.number ? '✓' : '○'} One number
                    </p>
                    <p className={passwordRequirements.special ? 'text-green-600' : (isDarkMode ? 'text-slate-500' : 'text-slate-400')}>
                      {passwordRequirements.special ? '✓' : '○'} One special character
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <label 
                    className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="Confirm new password"
                    className={`w-full px-4 py-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all ${isDarkMode ? 'bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500' : 'bg-gray-100 border border-gray-200 text-slate-900 placeholder:text-slate-400'}`}
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full py-3 rounded-lg font-semibold text-white transition-all bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </motion.button>
              </form>
            </>
          )}

          {/* Success State */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div 
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'}`}
                >
                  <CheckCircle size={40} className={isDarkMode ? 'text-green-400' : 'text-green-600'} />
                </div>
                <h2 
                  className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                >
                  Password Updated!
                </h2>
                <p 
                  className={`text-sm mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
                >
                  Your password has been successfully updated. Redirecting to login...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Security Notice */}
          {step !== 3 && !success && (
            <div 
              className={`mt-6 p-4 rounded-lg text-xs ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-gray-50 border border-gray-200'}`}
            >
              <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                <strong className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>Security Notice:</strong> 
                {step === 1 ? ' For your protection, we will send a verification code to your email.' : ' This code will expire in 10 minutes. You have a maximum of 5 verification attempts.'}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
