import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Shield, ArrowLeft, RefreshCw } from 'lucide-react';
import axios from 'axios';

const VerifyEmail = ({ email, onBack, onVerified, setLoginSuccess }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  // Handle 6-digit code input
  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    setError('');
  };

  // Verify the code
  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/verify-email', {
        email: email,
        code: code
      });

      if (response.data.success) {
        setSuccess(true);
        if (setLoginSuccess) setLoginSuccess(true);
        setTimeout(() => {
          onVerified();
        }, 1500);
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

  // Resend verification code
  const handleResend = async () => {
    if (cooldown > 0) return;

    setResendLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/send-verification', {
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

  // Prevent page refresh from resubmitting
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (code && !success) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [code, success]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-main)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-md"
      >
        <div 
          className="rounded-2xl shadow-xl p-8"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--border-light)' }}
        >
          {/* Back Button */}
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-sm transition-colors hover:opacity-70"
            style={{ color: 'var(--color-muted)' }}
          >
            <ArrowLeft size={16} />
            Back
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'var(--highlight)' }}
            >
              <Mail size={32} style={{ color: 'var(--color-primary)' }} />
            </div>
            <h2 
              className="text-2xl font-bold mb-2"
              style={{ color: 'var(--color-primary)' }}
            >
              Verify Your PTC Email
            </h2>
            <p 
              className="text-sm"
              style={{ color: 'var(--color-secondary)' }}
            >
              A verification code has been sent to{' '}
              <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>
                {email}
              </span>
            </p>
            <p 
              className="text-sm mt-2"
              style={{ color: 'var(--color-muted)' }}
            >
              Enter the 6-digit code below to activate your account.
            </p>
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mb-6 p-4 rounded-lg flex items-center gap-3"
                style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e' }}
              >
                <Shield size={24} className="text-green-500" />
                <div>
                  <p className="font-semibold text-green-600">Email Verified Successfully!</p>
                  <p className="text-sm text-green-600">Redirecting to login...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && !success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-lg text-sm"
                style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444' }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Verification Form */}
          {!success && (
            <form onSubmit={handleVerify}>
              <div className="mb-6">
                <label 
                  className="block text-sm font-medium mb-3"
                  style={{ color: 'var(--color-secondary)' }}
                >
                  Verification Code
                </label>
                <div className="flex gap-2 justify-center">
                  {[...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className="w-12 h-14 rounded-lg flex items-center justify-center text-2xl font-bold transition-all"
                      style={{
                        background: 'var(--bg-tertiary)',
                        border: `2px solid ${code[index] ? 'var(--accent)' : 'var(--border-light)'}`,
                        color: 'var(--color-primary)'
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
                className="w-full py-3 rounded-lg font-semibold text-white transition-all mb-4"
                disabled={loading || code.length !== 6}
                style={{
                  background: loading || code.length !== 6 
                    ? 'var(--color-muted)' 
                    : 'var(--gradient-electric)',
                  cursor: loading || code.length !== 6 ? 'not-allowed' : 'pointer',
                  opacity: loading || code.length !== 6 ? 0.6 : 1
                }}
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </motion.button>

              {/* Resend Code */}
              <div className="text-center">
                <p 
                  className="text-sm mb-3"
                  style={{ color: 'var(--color-muted)' }}
                >
                  Didn't receive the code?
                </p>
                <motion.button
                  type="button"
                  onClick={handleResend}
                  disabled={cooldown > 0 || resendLoading}
                  whileHover={{ scale: cooldown > 0 || resendLoading ? 1 : 1.02 }}
                  whileTap={{ scale: cooldown > 0 || resendLoading ? 1 : 0.98 }}
                  className="flex items-center justify-center gap-2 mx-auto text-sm font-medium transition-colors"
                  disabled={cooldown > 0 || resendLoading}
                  style={{
                    color: cooldown > 0 || resendLoading 
                      ? 'var(--color-muted)' 
                      : 'var(--accent)',
                    cursor: cooldown > 0 || resendLoading ? 'not-allowed' : 'pointer',
                    opacity: cooldown > 0 || resendLoading ? 0.6 : 1
                  }}
                >
                  <RefreshCw size={16} className={resendLoading ? 'animate-spin' : ''} />
                  {resendLoading ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
                </motion.button>
              </div>
            </form>
          )}

          {/* Security Notice */}
          <div 
            className="mt-6 p-4 rounded-lg text-xs"
            style={{ background: 'var(--highlight)', border: '1px solid var(--highlight-border)' }}
          >
            <p style={{ color: 'var(--color-muted)' }}>
              <strong style={{ color: 'var(--color-secondary)' }}>Security Notice:</strong> 
              This code will expire in 15 minutes. For your protection, you have a maximum of 5 verification attempts.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
