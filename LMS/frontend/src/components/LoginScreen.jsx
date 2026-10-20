import React from 'react';
import { LogOut, Moon, Sun } from 'lucide-react';

const LoginScreen = ({
  isDarkMode,
  setIsDarkMode,
  isRegisterMode,
  setIsRegisterMode,
  handleLogin,
  handleRegister,
  username,
  setUsername,
  password,
  setPassword,
  registerData,
  setRegisterData,
  setUser,
  setIsLoggedIn,
  setCurrentUser,
  setActiveNav,
  t,
  emailError,
  setEmailError,
  emailValid,
  setEmailValid,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  passwordError,
  setPasswordError,
  confirmPasswordError,
  setConfirmPasswordError,
  isSubmitting,
  setIsSubmitting,
  passwordRequirements,
  setPasswordRequirements,
  validateEmail,
  checkPasswordRequirements,
  loginSuccessMessage,
  error,
  setError,
  loading
}) => {

  return (
    <div className={`min-h-screen flex overflow-x-hidden overflow-y-auto ${isDarkMode ? 'bg-slate-950' : 'bg-gray-100'} dark:bg-slate-950 dark:text-white transition-colors duration-300`}>
      {/* Left Panel - Hero Branding Section (55%) */}
      <div className={`hidden lg:flex lg:w-[55%] relative ${isDarkMode ? 'bg-gradient-to-br from-blue-900/40 via-slate-950 to-indigo-950' : 'bg-gradient-to-br from-blue-100 via-white to-indigo-100'}`}>
        {/* Animated Glowing Mesh Orbs */}
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-32 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="relative z-10 flex flex-col justify-center items-center p-12 h-full">
          {/* PTC Logo with Glowing Aura */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-2xl animate-pulse" />
            <img src="/PTCLOGO.webp" alt="PTC Logo" className="relative w-48 h-48 object-contain" style={{ filter: 'drop-shadow(0 10px 15px rgba(37,99,235,0.2))' }} />
          </div>
          
          {/* Bold Branding */}
          <h1 className={`font-bold uppercase tracking-wide text-5xl lg:text-6xl mb-2 text-center drop-shadow-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: 'Arial, sans-serif' }}>
            PATEROS TECHNOLOGICAL COLLEGE
          </h1>
          
          {/* Academic Motto Badge */}
          <p className="text-xs font-semibold tracking-widest text-blue-600 dark:text-blue-400 uppercase mt-2">Empowering Quality Technological Education</p>
          
          {/* Academic Portal Badge */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Academic Portal • S.Y. 2026-2027</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Interactive Auth Studio (45%) */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 lg:p-12 relative">
        {/* Background Gradient */}
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950' : 'bg-gradient-to-br from-gray-50 via-white to-indigo-50'}`} />
        <div className={`absolute top-0 right-0 w-64 h-64 ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-200/20'} rounded-full blur-3xl`} />
        <div className={`absolute bottom-0 left-0 w64 h-64 ${isDarkMode ? 'bg-indigo-500/10' : 'bg-indigo-200/20'} rounded-full blur-3xl`} />
        
        {/* Glassmorphic Auth Card */}
        <div className={`relative z-10 w-full max-w-md bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-blue-500/30 rounded-3xl p-8 shadow-2xl dark:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-colors duration-300 auth-card login-card-forced-dark`}>
          {/* Dark Mode Toggle */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 border ${isDarkMode ? 'bg-slate-800/50 hover:bg-slate-700/50 border-slate-700/50' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'}`}
            >
              {isDarkMode ? (
                <Sun size={20} className="text-cyan-300" />
              ) : (
                <Moon size={20} className="text-slate-600" />
              )}
            </button>
          </div>

          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-6">
            <img src="/PTCLOGO.webp" alt="PTC Logo" className="w-24 h-24 object-contain drop-shadow-md" />
          </div>

          {/* Decorative Welcome Header */}
          <div className="mb-6 text-center">
            <span className="bg-blue-100 dark:bg-blue-950/90 text-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-700 font-bold px-4 py-1.5 rounded-full text-xs shadow-sm inline-block">
              ✨ Welcome to PTC Learning Management System
            </span>
            <h2 className="text-slate-950 dark:text-white font-black text-2xl mt-4 mb-1 tracking-tight drop-shadow-none dark:drop-shadow-[0_2px_10px_rgba(255,255,255,0.25)] transition-colors">{isRegisterMode ? 'Create Account' : 'Sign in to your account'}</h2>
            <p className="text-slate-700 dark:text-slate-300 font-bold text-xs mb-6 transition-colors">{isRegisterMode ? 'Create your PTC Learning Management System account using your official PTC email address.' : 'Sign in with your registered PTC credentials'}</p>
          </div>

          {loginSuccessMessage && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-700 dark:text-green-400 text-xs font-semibold">{loginSuccessMessage}</p>
            </div>
          )}


          {!isRegisterMode ? (
            // Login Form
            <form onSubmit={handleLogin} className="space-y-5">
              <input
                key="global-login-username-field"
                id="login-username"
                type="text"
                placeholder="PTC Email Address or Username (student, prof, dean, admin)"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
className="w-full px-4 py-3 !text-slate-900 dark:!text-white placeholder:!text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
              />
              <input
                key="global-login-password-field"
                id="login-password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
className="w-full px-4 py-3 !text-slate-900 dark:!text-white placeholder:!text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
              />
              {error && (
                <p className="text-red-500 text-xs font-semibold">{error}</p>
              )}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3"
              >
                <LogOut size={20} className="rotate-180" />
                {loading ? 'Signing in...' : t.signIn}
              </button>
            </form>
          ) : (
            // Registration Form
            <form onSubmit={handleRegister} className="space-y-5">
              <input
                key="global-register-fullname-field"
                id="register-fullname"
                name="name"
                type="text"
                placeholder="Full Name"
                value={registerData.name}
                onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
className="w-full px-4 py-3 !text-slate-900 dark:!text-white placeholder:!text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-slate-300 dark:hover:border-slate-600"
                required
              />
              
              {/* PTC Email Field with Validation */}
              <div>
                <input
                  key="global-register-email-field"
                  id="register-email"
                  name="email"
                  type="email"
                  placeholder="username@paterostechnologicalcollege.edu.ph"
                  value={registerData.email}
                  onChange={(e) => {
                    setRegisterData(prev => ({ ...prev, email: e.target.value }));
                    validateEmail(e.target.value);
                  }}
                  onBlur={() => validateEmail(registerData.email)}
                  className={`w-full px-4 py-3 !text-slate-900 dark:!text-white placeholder:!text-slate-400 bg-slate-100 dark:bg-slate-800 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-slate-300 dark:hover:border-slate-600 ${emailValid ? 'border-green-500' : 'border-slate-200 dark:border-slate-700'}`}
                  required
                />
              </div>
              
              {/* Password Field with Show/Hide and Requirements Checklist */}
              <div>
                <div className="relative">
                  <input
                    key="global-register-password-field"
                    id="register-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create Password"
                    value={registerData.password}
                    onChange={(e) => {
                      setRegisterData(prev => ({ ...prev, password: e.target.value }));
                      checkPasswordRequirements(e.target.value);
                      setPasswordError("");
                    }}
                    className="w-full px-4 py-3 pr-12 !text-slate-900 dark:!text-white placeholder:!text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-slate-300 dark:hover:border-slate-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                
                {/* Live Password Requirement Checklist */}
                <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  <p className="text-slate-700 dark:text-slate-300 text-xs font-bold mb-3">Password must contain:</p>
                  <ul className="space-y-2">
                    <li className={`text-xs flex items-center gap-2 ${passwordRequirements.length ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                      {passwordRequirements.length ? '✓' : '○'} At least 8 characters
                    </li>
                    <li className={`text-xs flex items-center gap-2 ${passwordRequirements.uppercase ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                      {passwordRequirements.uppercase ? '✓' : '○'} At least one uppercase letter (A-Z)
                    </li>
                    <li className={`text-xs flex items-center gap-2 ${passwordRequirements.lowercase ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                      {passwordRequirements.lowercase ? '✓' : '○'} At least one lowercase letter (a-z)
                    </li>
                    <li className={`text-xs flex items-center gap-2 ${passwordRequirements.number ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                      {passwordRequirements.number ? '✓' : '○'} At least one number (0-9)
                    </li>
                    <li className={`text-xs flex items-center gap-2 ${passwordRequirements.special ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                      {passwordRequirements.special ? '✓' : '○'} At least one special character (!@#$%^&* etc.)
                    </li>
                  </ul>
                </div>
                
                {passwordError && (
                  <p className="text-red-500 text-xs mt-2 font-semibold">{passwordError}</p>
                )}
              </div>
              
              {/* Confirm Password Field with Show/Hide */}
              <div>
                <div className="relative">
                  <input
                    key="global-register-confirm-password-field"
                    id="register-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={registerData.confirmPassword}
                    onChange={(e) => {
                      setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }));
                      if (e.target.value !== registerData.password) {
                        setConfirmPasswordError("Passwords do not match.");
                      } else {
                        setConfirmPasswordError("");
                      }
                    }}
                    className={`w-full px-4 py-3 pr-12 !text-slate-900 dark:!text-white placeholder:!text-slate-400 bg-slate-100 dark:bg-slate-800 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-slate-300 dark:hover:border-slate-600 ${confirmPasswordError ? 'border-red-500' : registerData.confirmPassword && registerData.confirmPassword === registerData.password ? 'border-green-500' : 'border-slate-200 dark:border-slate-700'}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {confirmPasswordError && (
                  <p className="text-red-500 text-xs mt-2 font-semibold">{confirmPasswordError}</p>
                )}
              </div>
              
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Role</label>
                <select
                  key="global-register-role-field"
                  id="register-role"
                  name="role"
                  value={registerData.role}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer"
                  required
                >
                  <option value="student">Student</option>
                  <option value="professor">Teacher / Professor</option>
                  <option value="dean">Dean</option>
                  <option value="administrator">Administrator</option>
                </select>
              </div>
              
              {/* Submit Button with Anti-Double Submission */}
              <button 
                type="submit" 
                disabled={isSubmitting || !registerData.name || !emailValid || !!confirmPasswordError || !Object.values(passwordRequirements).every(Boolean)}
                className="w-full h-14 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed disabled:opacity-50 text-white font-bold text-lg rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}


          {/* Toggle Register/Login */}
          <div className="mt-6 text-center">
            {!isRegisterMode ? (
              <button 
                onClick={() => setIsRegisterMode(true)}
                className="text-slate-800 dark:text-slate-200 font-semibold text-xs mt-6 text-center block"
              >
                Don't have an account? <span className="text-blue-700 dark:text-blue-400 font-extrabold hover:underline cursor-pointer ml-1 drop-shadow-none dark:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">Register here</span>
              </button>
            ) : (
              <button 
                onClick={() => setIsRegisterMode(false)}
                className="text-slate-800 dark:text-slate-200 font-semibold text-xs mt-6 text-center block"
              >
                Already have an account? <span className="text-blue-700 dark:text-blue-400 font-extrabold hover:underline cursor-pointer ml-1 drop-shadow-none dark:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">Log in here</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
