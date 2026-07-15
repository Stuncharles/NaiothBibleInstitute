import { useState, FormEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { User, Mail, Phone, Church, Share2, ShieldAlert, CheckCircle2, ChevronRight, ChevronLeft, Loader2, RefreshCw, Receipt, Copy, Check, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { registrationService } from "../services/registrationService";
import { Registration } from "../types";

// Zod Schema definition for validation
const registrationSchema = z.object({
  fullName: z.string().min(3, "Full Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(8, "Please enter a valid phone number"),
  gender: z.enum(["Male", "Female"]),
  church: z.string().min(2, "Church/Ministry name must be at least 2 characters"),
  referralSource: z.enum(["Facebook", "WhatsApp", "Friend", "Other"]),
  agreement: z.boolean().refine((val) => val === true, {
    message: "You must agree to the NBI commitment terms to register"
  })
});

type FormValues = z.infer<typeof registrationSchema>;

export default function RegistrationForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<Registration | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { register, getValues, trigger, reset } = useForm<FormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      gender: "Male",
      church: "",
      referralSource: "WhatsApp",
      agreement: undefined
    }
  });

  const handleNext = async () => {
    setValidationErrors({});
    const values = getValues();
    
    // Validate Step 1 fields
    if (step === 1) {
      const step1Schema = registrationSchema.pick({
        fullName: true,
        email: true,
        phoneNumber: true,
        gender: true
      });
      
      const result = step1Schema.safeParse({
        fullName: values.fullName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        gender: values.gender
      });

      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          if (issue.path[0]) {
            errors[issue.path[0] as string] = issue.message;
          }
        });
        setValidationErrors(errors);
        return;
      }
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const onSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    setSubmitError(null);
    
    const values = getValues();
    // Validate everything
    const result = registrationSchema.safeParse({
      ...values,
      agreement: (e.target as any).agreement.checked
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0] as string] = issue.message;
        }
      });
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const response = await registrationService.submitRegistration(result.data);
      if (response.success) {
        setSuccessData(response.data);
        reset();
        setStep(1);
      } else {
        setSubmitError(response.message || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || "Server connection error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const resetFormState = () => {
    setSuccessData(null);
    setValidationErrors({});
    setSubmitError(null);
    setStep(1);
  };

  return (
    <section id="register-section" className="py-24 bg-brand-blue/5 dark:bg-slate-950 relative overflow-hidden">
      
      {/* Background Ornaments */}
      <div className="absolute top-[30%] -left-[10%] w-[40%] h-[40%] rounded-full bg-brand-accent/5 dark:bg-brand-accent/3 blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10 w-full">
        
        {/* Title */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-3 print:hidden">
          <span className="px-3 py-1 bg-brand-blue/10 dark:bg-brand-accent/20 text-brand-blue dark:text-brand-gold text-xs font-extrabold uppercase tracking-widest rounded-md inline-block">
            Online Form
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-blue dark:text-white tracking-tight">
            Apply for Cohort 2026
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
            Please fill in the details below. Ensure all information is accurate. Registration provides admission to the six-week theological study.
          </p>
        </div>

        {/* Multi-Section Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/60 dark:border-slate-800/80 p-8 sm:p-10 relative">
          
          <AnimatePresence mode="wait">
            {!successData ? (
              <form onSubmit={onSubmitHandler} className="space-y-8 print:hidden">
                
                {/* Step Progress Bar */}
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${step >= 1 ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-400"}`}>
                        1
                      </div>
                      <span className={`text-xs font-extrabold tracking-wide uppercase ${step === 1 ? "text-brand-blue dark:text-brand-gold" : "text-slate-400"}`}>Personal Profile</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-slate-100 dark:bg-slate-800 mx-4" />
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${step === 2 ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-400"}`}>
                        2
                      </div>
                      <span className={`text-xs font-extrabold tracking-wide uppercase ${step === 2 ? "text-brand-blue dark:text-brand-gold" : "text-slate-400"}`}>Ministry Profile</span>
                    </div>
                  </div>
                  <div className="h-1 bg-slate-100 dark:bg-slate-800 mt-4 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-gold transition-all duration-300" style={{ width: step === 1 ? "50%" : "100%" }} />
                  </div>
                </div>

                {/* Step 1 Content */}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Full Name */}
                      <div className="space-y-2">
                        <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Full Name</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                            <User className="w-4.5 h-4.5" />
                          </div>
                          <input
                            id="reg-input-fullname"
                            type="text"
                            placeholder="e.g. John Doe"
                            {...register("fullName")}
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/50 dark:focus:ring-brand-gold/50 text-sm font-bold text-slate-800 dark:text-white"
                          />
                        </div>
                        {validationErrors.fullName && (
                          <span className="text-xs text-red-500 font-bold flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5" /> {validationErrors.fullName}
                          </span>
                        )}
                      </div>

                      {/* Email Address */}
                      <div className="space-y-2">
                        <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Email Address</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                            <Mail className="w-4.5 h-4.5" />
                          </div>
                          <input
                            id="reg-input-email"
                            type="email"
                            placeholder="e.g. johndoe@gmail.com"
                            {...register("email")}
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/50 dark:focus:ring-brand-gold/50 text-sm font-bold text-slate-800 dark:text-white"
                          />
                        </div>
                        {validationErrors.email && (
                          <span className="text-xs text-red-500 font-bold flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5" /> {validationErrors.email}
                          </span>
                        )}
                      </div>

                      {/* Phone Number */}
                      <div className="space-y-2">
                        <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Phone Number</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                            <Phone className="w-4.5 h-4.5" />
                          </div>
                          <input
                            id="reg-input-phone"
                            type="tel"
                            placeholder="e.g. +234 803 000 0000"
                            {...register("phoneNumber")}
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/50 dark:focus:ring-brand-gold/50 text-sm font-bold text-slate-800 dark:text-white"
                          />
                        </div>
                        {validationErrors.phoneNumber && (
                          <span className="text-xs text-red-500 font-bold flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5" /> {validationErrors.phoneNumber}
                          </span>
                        )}
                      </div>

                      {/* Gender Choice */}
                      <div className="space-y-2">
                        <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Gender</label>
                        <select
                          id="reg-input-gender"
                          {...register("gender")}
                          className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/50 text-sm font-bold text-slate-800 dark:text-white"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                        {validationErrors.gender && (
                          <span className="text-xs text-red-500 font-bold flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5" /> {validationErrors.gender}
                          </span>
                        )}
                      </div>

                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        id="reg-btn-next"
                        type="button"
                        onClick={handleNext}
                        className="px-6 py-3.5 bg-brand-blue hover:bg-brand-accent text-white font-bold rounded-xl flex items-center space-x-2 shadow-md transition-colors cursor-pointer"
                      >
                        <span>Next Step</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2 Content */}
                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Church / Ministry */}
                      <div className="space-y-2">
                        <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Church / Ministry Organization</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                            <Church className="w-4.5 h-4.5" />
                          </div>
                          <input
                            id="reg-input-church"
                            type="text"
                            placeholder="e.g. Redeemed Christian Church"
                            {...register("church")}
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/50 text-sm font-bold text-slate-800 dark:text-white"
                          />
                        </div>
                        {validationErrors.church && (
                          <span className="text-xs text-red-500 font-bold flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5" /> {validationErrors.church}
                          </span>
                        )}
                      </div>

                      {/* Referral Source */}
                      <div className="space-y-2">
                        <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider">How did you hear about us?</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                            <Share2 className="w-4.5 h-4.5" />
                          </div>
                          <select
                            id="reg-input-referral"
                            {...register("referralSource")}
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/50 text-sm font-bold text-slate-800 dark:text-white"
                          >
                            <option value="WhatsApp">WhatsApp</option>
                            <option value="Facebook">Facebook</option>
                            <option value="Friend">Friend</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        {validationErrors.referralSource && (
                          <span className="text-xs text-red-500 font-bold flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5" /> {validationErrors.referralSource}
                          </span>
                        )}
                      </div>

                    </div>

                    {/* Agreement Checkbox */}
                    <div className="p-5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800 rounded-2xl">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          id="reg-input-agreement"
                          type="checkbox"
                          name="agreement"
                          className="mt-1 accent-brand-blue"
                        />
                        <span className="text-xs text-slate-600 dark:text-slate-300 font-bold leading-relaxed">
                          By checking this box, I covenant to attend classes regularly, complete required theological studies, and honor the spiritual guidelines set by Naioth Bible Institute.
                        </span>
                      </label>
                      {validationErrors.agreement && (
                        <span className="text-xs text-red-500 font-bold flex items-center gap-1 mt-2">
                          <ShieldAlert className="w-3.5 h-3.5" /> {validationErrors.agreement}
                        </span>
                      )}
                    </div>

                    {/* Submit and errors */}
                    {submitError && (
                      <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 rounded-2xl text-xs font-bold flex items-center gap-2">
                        <ShieldAlert className="w-4.5 h-4.5" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4">
                      <button
                        id="reg-btn-back"
                        type="button"
                        onClick={handleBack}
                        className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl flex items-center space-x-2 transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>

                      <button
                        id="reg-btn-submit"
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-500/50 text-white font-extrabold rounded-xl flex items-center space-x-2 shadow-md transition-colors cursor-pointer"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Submit Registration</span>
                          </>
                        )}
                      </button>
                    </div>

                  </motion.div>
                )}

              </form>
            ) : (
              /* Success Enrollment Screen */
              <motion.div
                key="success-slip"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                
                {/* Status indicator */}
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Registration Complete!</h3>
                  <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Your application has been received</p>
                </div>

                {/* Semester Fee & Payment Details Block */}
                <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-6 max-w-lg mx-auto text-left">
                  <div>
                    <h4 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-brand-blue dark:text-brand-gold" />
                      <span>Complete Your Enrollment</span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-bold">
                      Thank you for registering! Your application to Naioth Bible Institute has been received. Please note the semester fees and bank transfer details below to finalize your slot.
                    </p>
                  </div>

                  {/* Fee Breakdown */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">SEMESTER FEE BREAKDOWN</span>
                    <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900/80 divide-y divide-slate-100 dark:divide-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
                      <div className="flex justify-between p-3.5">
                        <span>Acceptance Fee</span>
                        <span className="text-slate-800 dark:text-white font-extrabold">₦10,000</span>
                      </div>
                      <div className="flex justify-between p-3.5">
                        <span>Application Fee</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-extrabold uppercase text-[10px]">Free</span>
                      </div>
                      <div className="flex justify-between p-3.5">
                        <span>Tuition Fee</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-extrabold uppercase text-[10px]">Free</span>
                      </div>
                      <div className="flex justify-between p-3.5">
                        <span>Course Registration</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-extrabold uppercase text-[10px]">Free</span>
                      </div>
                      <div className="flex justify-between p-3.5">
                        <span>Library / Material Fee</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-extrabold uppercase text-[10px]">Free</span>
                      </div>
                      <div className="flex justify-between p-3.5">
                        <span>Certificate Fee</span>
                        <span className="text-slate-400">-</span>
                      </div>
                      <div className="flex justify-between p-3.5 bg-brand-blue/5 dark:bg-brand-gold/5 text-slate-800 dark:text-white font-black text-sm">
                        <span>TOTAL</span>
                        <span className="text-brand-blue dark:text-brand-gold">₦10,000</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">PAYMENT DETAILS</span>
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 space-y-3 text-xs font-bold text-slate-600 dark:text-slate-300">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-[11px]">Bank:</span>
                        <span className="text-slate-800 dark:text-white">Access Bank</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-[11px]">Account Number:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-brand-accent dark:text-brand-gold font-extrabold">0044550721</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText("0044550721");
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            }}
                            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                            title="Copy Account Number"
                          >
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-[11px]">Account Name:</span>
                        <span className="text-slate-800 dark:text-white">Ihuoma Ifeanyi</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-[11px]">Narration:</span>
                        <span className="text-slate-800 dark:text-white">Please use "Naioth Acceptance Fee"</span>
                      </div>
                    </div>
                  </div>

                  {/* Next Step WhatsApp Call-To-Action */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-black">NEXT STEP</span>
                    <a
                      href="https://wa.me/2348164848406"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-2xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs text-xs sm:text-sm tracking-wide text-center"
                    >
                      <span>👉 Send Payment Receipt via WhatsApp</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Sponsor Support Note */}
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl">
                    <p className="text-[10px] text-amber-700 dark:text-amber-400 font-extrabold uppercase mb-1">Support Other Students</p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 font-bold leading-relaxed">
                      In case the Lord has blessed you and you may want to support one or two students who couldn't afford, you can indicate in the payment slip. We will acknowledge your payment and add you to the official School WhatsApp Group.
                    </p>
                  </div>
                </div>

                {/* Print button / controls */}
                <div className="flex justify-center">
                  <button
                    id="slip-btn-register-new"
                    onClick={resetFormState}
                    className="px-8 py-3.5 bg-brand-blue hover:bg-brand-accent text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4.5 h-4.5" />
                    <span>Register Another Candidate</span>
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
