"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Lock, Mail, ChevronLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Dev mode bypass
      if (email === "admin@example.com" && password === "admin123") {
        localStorage.setItem("dev_bypass", "true");
        toast.success("Login successful (Dev Mode)");
        window.location.href = "/dashboard";
        return;
      }
      
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Please check your inbox.");
      setMode("login");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email. Verify your email address.");
    } finally {
      setMode("login");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0f4c81] via-[#0b3558] to-[#041524] p-6 text-white selection:bg-sky-500/30">
      <div className="w-full max-w-sm space-y-12">
        {/* Logo and Brand Header */}
        <div className="text-center space-y-6">
          <div className="text-4xl tracking-[0.2em] text-white flex justify-center items-center gap-0.5">
            <span className="font-light">U</span>
            <span className="font-extrabold">CARE</span>
          </div>

          {/* SVG Headphone Pulse Logo */}
          <div className="relative flex justify-center">
            <svg viewBox="0 0 200 200" className="w-44 h-44 drop-shadow-[0_8px_24px_rgba(56,189,248,0.15)]">
              {/* Headphones arch */}
              <path 
                d="M 30 110 A 70 70 0 0 1 170 110" 
                fill="none" 
                stroke="white" 
                strokeWidth="10" 
                strokeLinecap="round" 
              />
              {/* Headphones ear pads */}
              <circle cx="30" cy="110" r="10" fill="white" />
              <circle cx="170" cy="110" r="10" fill="white" />
              
              {/* Heartbeat circular body */}
              <circle cx="100" cy="110" r="50" fill="white" />
              
              {/* Pulse Waveform */}
              <path 
                d="M 68 110 L 82 110 L 88 95 L 96 130 L 106 80 L 116 120 L 123 105 L 128 110 L 134 110" 
                fill="none" 
                stroke="#2ea3f2" 
                strokeWidth="5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </div>
        </div>

        {mode === "login" ? (
          /* LOGIN FORM */
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username/Email Field */}
            <div className="relative flex items-center bg-[#09253d]/50 border border-white/5 rounded-full p-1.5 focus-within:border-sky-400 focus-within:ring-1 focus-within:ring-sky-400 transition-all duration-200">
              <div className="h-11 w-11 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0">
                <User className="h-5 w-5" />
              </div>
              <Input
                type="email"
                placeholder="USERNAME"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-transparent border-0 text-white placeholder-white/40 text-xs font-semibold tracking-widest pl-4 h-11 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            {/* Password Field */}
            <div className="relative flex items-center bg-[#09253d]/50 border border-white/5 rounded-full p-1.5 focus-within:border-sky-400 focus-within:ring-1 focus-within:ring-sky-400 transition-all duration-200">
              <div className="h-11 w-11 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0">
                <Lock className="h-5 w-5" />
              </div>
              <Input
                type="password"
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-transparent border-0 text-white placeholder-white/40 text-xs font-semibold tracking-widest pl-4 h-11 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            {/* Login Button */}
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white text-sm font-bold tracking-widest rounded-full shadow-lg shadow-sky-500/20 border-none uppercase transition-all duration-200 active:scale-[0.98]"
            >
              {loading ? "Logging in..." : "Login Now"}
            </Button>

            {/* Form Footer Links */}
            <div className="flex justify-between items-center text-[10px] font-bold tracking-wider text-white/50 px-2 pt-2">
              <button type="button" onClick={() => toast("Sign up is restricted to Store Managers.")} className="hover:text-white transition-colors uppercase">
                Signup Today
              </button>
              <button 
                type="button" 
                onClick={() => setMode("forgot")} 
                className="hover:text-white transition-colors uppercase"
              >
                Forgot password?
              </button>
            </div>
          </form>
        ) : (
          /* FORGOT PASSWORD FORM */
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-sm font-bold tracking-wider uppercase text-sky-400">Forgot Password?</h2>
              <p className="text-xs text-white/50">Enter your registered email address to receive password reset instructions.</p>
            </div>

            {/* Email Field */}
            <div className="relative flex items-center bg-[#09253d]/50 border border-white/5 rounded-full p-1.5 focus-within:border-sky-400 focus-within:ring-1 focus-within:ring-sky-400 transition-all duration-200">
              <div className="h-11 w-11 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <Input
                type="email"
                placeholder="EMAIL ADDRESS"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-transparent border-0 text-white placeholder-white/40 text-xs font-semibold tracking-widest pl-4 h-11 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white text-sm font-bold tracking-widest rounded-full shadow-lg shadow-sky-500/20 border-none uppercase transition-all duration-200"
            >
              {loading ? "Sending..." : "Reset Password"}
            </Button>

            {/* Back to Login */}
            <div className="flex justify-center">
              <button 
                type="button" 
                onClick={() => setMode("login")} 
                className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-white/50 hover:text-white uppercase transition-colors"
              >
                <ChevronLeft className="h-3 w-3" />
                Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
