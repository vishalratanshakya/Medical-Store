"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Cross, Loader2, Lock, Mail, HelpCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Lamp Light state
  const [lightOn, setLightOn] = useState(false);
  const [lampClick, setLampClick] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.replace("/dashboard");
    } catch {
      setError("Invalid admin credentials. Access denied.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-gray-950 md:flex-row">
      
      {/* LEFT SIDE: Interactive Hanging Lamp & Ambient Room */}
      <div className="relative flex flex-1 flex-col items-center justify-center p-8 transition-colors duration-500 bg-radial-[at_top] from-gray-900 to-gray-950">
        {/* Glow / Light Cone Effect */}
        <AnimatePresence>
          {lightOn && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 pointer-events-none"
            >
              {/* Radial gradient background representing room illumination */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_250px,rgba(253,224,71,0.15)_0%,rgba(0,0,0,0)_60%)]" />
              
              {/* Cone of Light downwards from lamp */}
              <div 
                className="absolute left-1/2 -translate-x-1/2 top-[242px] w-[500px] h-[600px]"
                style={{
                  clipPath: "polygon(45% 0%, 55% 0%, 100% 100%, 0% 100%)",
                  background: "linear-gradient(180deg, rgba(253,224,71,0.25) 0%, rgba(253,224,71,0.03) 70%, rgba(0,0,0,0) 100%)",
                  filter: "blur(8px)",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lamp SVG Graphics Container */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-[200px]">
          <svg width="200" height="260" viewBox="0 0 200 260" fill="none" className="overflow-visible">
            {/* Ceiling Cord */}
            <line x1="100" y1="0" x2="100" y2="150" stroke="#374151" strokeWidth="3" />
            
            {/* Lamp Fixture Base */}
            <path d="M70 150 H130 L140 180 H60 L70 150 Z" fill="#1f2937" stroke="#111827" strokeWidth="2" />
            
            {/* Lamp Shade Rim */}
            <ellipse cx="100" cy="180" rx="40" ry="10" fill="#374151" />

            {/* Glowing Bulb */}
            <motion.circle
              cx="100"
              cy="195"
              r="18"
              animate={{
                fill: lightOn ? "#fef08a" : "#4b5563",
                filter: lightOn 
                  ? ["drop-shadow(0 0 8px #fde047)", "drop-shadow(0 0 20px #fef08a)"]
                  : "none",
              }}
              transition={lightOn ? { repeat: Infinity, repeatType: "reverse", duration: 2 } : {}}
            />
            
            {/* Filament */}
            <path d="M96 195 C98 190, 102 190, 104 195" stroke={lightOn ? "#eab308" : "#374151"} strokeWidth="2" fill="none" />
          </svg>

          {/* Interactive Pull String (Cord) */}
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.8 }}
            onDragEnd={(event, info) => {
              if (info.offset.y >= 40) {
                setLightOn((prev) => !prev);
                setLampClick(true);
                setTimeout(() => setLampClick(false), 150);
              }
            }}
            className="absolute left-[100px] top-[195px] flex flex-col items-center cursor-ns-resize origin-top select-none"
          >
            {/* Cable thread */}
            <div className="w-[2px] h-[90px] bg-gray-500" />
            
            {/* Clickable Knob */}
            <motion.div
              animate={{ scale: lampClick ? 0.8 : 1 }}
              className="w-4 h-4 rounded-full bg-yellow-500 shadow-md border-2 border-gray-900 flex items-center justify-center"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
            </motion.div>
          </motion.div>
        </div>

        {/* Instructive Hint */}
        <div className="absolute bottom-10 flex flex-col items-center text-center">
          <p className="text-sm font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-1">
            {lightOn ? "Light is ON" : "Room is Dark"}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-500 flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5" />
            Pull the hanging cord down to toggle light
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Illuminated Glassmorphism Login Panel */}
      <div className="relative flex flex-1 items-center justify-center p-8 transition-all duration-500 bg-gray-950/90 border-t border-gray-900 md:border-l md:border-t-0">
        
        {/* Shadow Darkening Cover when Light is OFF */}
        <AnimatePresence>
          {!lightOn && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 z-20 bg-gray-950/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-6"
            >
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="max-w-xs space-y-3"
              >
                <div className="mx-auto w-12 h-12 rounded-full border border-gray-800 flex items-center justify-center bg-gray-900 text-gray-500">
                  <Lock className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-gray-400">
                  Form obscured in shadow. Turn on the ceiling light to reveal credentials panel.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Frosted Glass Login Form */}
        <div className="w-full max-w-md relative z-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl">
              <Cross className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              Medical Store Admin
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Enter credentials to securely authenticate into the store database.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@medicalstore.com"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {error && (
                <p className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Admin Login"
                )}
              </Button>
            </form>

            <div className="mt-6 flex flex-col items-center justify-center gap-1 border-t border-white/10 pt-4 text-center">
              <p className="text-[11px] text-gray-500">
                Authorized Admin Login. Public registration is disabled.
              </p>
              <p className="text-[10px] text-blue-400/80 font-medium">
                Demo: admin@medicalstore.com | admin123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
