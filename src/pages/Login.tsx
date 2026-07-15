import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, Loader2, ArrowLeft, ShieldAlert, Eye, EyeOff, X, KeyRound, CheckCircle2, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { authService } from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Forgot password flow states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotCode, setForgotCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
  const [receivedCode, setReceivedCode] = useState<string | null>(null);
  const [showForgotPass, setShowForgotPass] = useState(false);
  const [showForgotConfirmPass, setShowForgotConfirmPass] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    // If already authenticated, skip straight to the dashboard
    if (authService.isAuthenticated()) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      if (response.success) {
        navigate("/admin");
      } else {
        setErrorMessage(response.message || "Invalid credentials");
      }
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || "Connection refused. Please use default credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCode = async (e: FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotLoading(true);

    try {
      const res = await authService.forgotPassword(forgotEmail);
      if (res.success) {
        setReceivedCode(res.devCode || null);
        setForgotStep(2);
      } else {
        setForgotError(res.message || "Failed to initiate reset.");
      }
    } catch (err: any) {
      setForgotError(err.response?.data?.message || "Failed to generate verification code.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setForgotError(null);

    if (newPassword !== confirmNewPassword) {
      setForgotError("Passwords do not match.");
      return;
    }

    setForgotLoading(true);

    try {
      const res = await authService.resetPassword(forgotEmail, forgotCode, newPassword);
      if (res.success) {
        setForgotSuccess(res.message || "Password has been successfully updated.");
        // Set values in main login form so they are pre-filled for effortless login
        setEmail(forgotEmail);
        setPassword(newPassword);
        // Automatically hide the modal after 2.5 seconds
        setTimeout(() => {
          setShowForgotModal(false);
        }, 2500);
      } else {
        setForgotError(res.message || "Failed to reset password.");
      }
    } catch (err: any) {
      setForgotError(err.response?.data?.message || "Failed to update password.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[35%] h-[35%] rounded-full bg-brand-blue/5 dark:bg-brand-accent/5 blur-[120px]" />
      </div>

      <div className="max-w-md w-full px-4 relative z-10">
        
        {/* Back Link */}
        <button
          id="login-btn-back-home"
          onClick={() => navigate("/")}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-brand-accent dark:text-slate-400 dark:hover:text-brand-gold mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing Page</span>
        </button>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/60 dark:border-slate-800/80 p-8 sm:p-10">
          
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="w-12 h-12 bg-brand-blue/10 dark:bg-brand-accent/20 text-brand-blue dark:text-brand-gold rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Admin Portal Login</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold">
              Provide your accredited credentials to access the registration database.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email input */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">Admin Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <input
                  id="login-input-email"
                  type="email"
                  required
                  placeholder="e.g. admin@yourdomain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/50 text-sm font-bold text-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">Password</label>
                <button
                  id="login-btn-forgot-password"
                  type="button"
                  onClick={() => {
                    setForgotEmail(email); // Autofill from the main input if filled
                    setShowForgotModal(true);
                    setForgotStep(1);
                    setForgotError(null);
                    setForgotSuccess(null);
                    setReceivedCode(null);
                    setForgotCode("");
                    setNewPassword("");
                    setConfirmNewPassword("");
                  }}
                  className="text-xs font-extrabold text-brand-blue hover:text-brand-accent dark:text-brand-gold dark:hover:text-amber-400 hover:underline cursor-pointer focus:outline-none transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <input
                  id="login-input-password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/50 text-sm font-bold text-slate-800 dark:text-white"
                />
                <button
                  id="login-btn-toggle-password"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-2xl text-xs font-bold flex items-center gap-2">
                <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              id="login-btn-submit"
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-brand-blue hover:bg-brand-accent dark:bg-brand-accent dark:hover:bg-brand-blue text-white font-extrabold rounded-xl flex items-center justify-center space-x-2 shadow-md transition-colors cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Logging In...</span>
                </>
              ) : (
                <span>Access Database</span>
              )}
            </button>

          </form>

        </div>

      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!forgotLoading && !forgotSuccess) setShowForgotModal(false);
              }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 relative z-10 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 bg-brand-blue/10 dark:bg-brand-accent/20 text-brand-blue dark:text-brand-gold rounded-xl flex items-center justify-center">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-800 dark:text-white">Reset Password</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Step {forgotStep} of 2</p>
                  </div>
                </div>
                {!forgotLoading && (
                  <button
                    onClick={() => setShowForgotModal(false)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                {/* Alert/Error message */}
                {forgotError && (
                  <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-2xl text-xs font-bold flex items-center gap-2">
                    <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
                    <span>{forgotError}</span>
                  </div>
                )}

                {forgotSuccess ? (
                  /* Success State */
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-xs">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-lg font-black text-slate-800 dark:text-white">Password Reset Successfully</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold max-w-xs mx-auto leading-relaxed">
                        {forgotSuccess}
                      </p>
                    </div>
                  </div>
                ) : forgotStep === 1 ? (
                  /* Step 1 Form */
                  <form onSubmit={handleRequestCode} className="space-y-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                      Enter the accredited admin email address. We will verify your account and generate a 6-digit secure password reset code.
                    </p>

                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">Admin Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4.5 h-4.5" />
                        </div>
                        <input
                          type="email"
                          required
                          placeholder="Ihuomaifeanyi51@gmail.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/50 text-sm font-bold text-slate-800 dark:text-white"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full mt-2 py-3 bg-brand-blue hover:bg-brand-accent dark:bg-brand-accent dark:hover:bg-brand-blue text-white font-extrabold rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer text-xs uppercase tracking-wider"
                    >
                      {forgotLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Generating Code...</span>
                        </>
                      ) : (
                        <span>Generate Reset Code</span>
                      )}
                    </button>
                  </form>
                ) : (
                  /* Step 2 Form */
                  <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                    
                    {/* Dev Mode Intercept Box */}
                    {receivedCode && (
                      <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl space-y-1.5">
                        <p className="text-[10px] text-amber-700 dark:text-amber-400 font-extrabold uppercase tracking-wider">Development Sandbox Intercept</p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 font-bold leading-relaxed">
                          For testing and frictionless verification, we have captured your 6-digit reset code:
                        </p>
                        <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-amber-200/50 dark:border-amber-900/40 p-2.5 rounded-xl">
                          <span className="font-mono text-base font-black tracking-widest text-brand-accent dark:text-brand-gold ml-2">{receivedCode}</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(receivedCode || "");
                              setCopiedCode(true);
                              setTimeout(() => setCopiedCode(false), 2000);
                            }}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                            title="Copy Reset Code"
                          >
                            {copiedCode ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Verification Code Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">6-Digit Verification Code</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                          <KeyRound className="w-4.5 h-4.5" />
                        </div>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          placeholder="e.g. 123456"
                          value={forgotCode}
                          onChange={(e) => setForgotCode(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/50 text-sm font-bold text-slate-800 dark:text-white font-mono tracking-widest"
                        />
                      </div>
                    </div>

                    {/* New Password Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">New Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4.5 h-4.5" />
                        </div>
                        <input
                          type={showForgotPass ? "text" : "password"}
                          required
                          placeholder="At least 8 characters"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full pl-11 pr-11 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/50 text-sm font-bold text-slate-800 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowForgotPass(!showForgotPass)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        >
                          {showForgotPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">Confirm New Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4.5 h-4.5" />
                        </div>
                        <input
                          type={showForgotConfirmPass ? "text" : "password"}
                          required
                          placeholder="Re-type new password"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          className="w-full pl-11 pr-11 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/50 text-sm font-bold text-slate-800 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowForgotConfirmPass(!showForgotConfirmPass)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        >
                          {showForgotConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full mt-4 py-3 bg-brand-blue hover:bg-brand-accent dark:bg-brand-accent dark:hover:bg-brand-blue text-white font-extrabold rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer text-xs uppercase tracking-wider"
                    >
                      {forgotLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Resetting Password...</span>
                        </>
                      ) : (
                        <span>Save New Password</span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
