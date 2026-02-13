import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  IconEye,
  IconEyeOff,
  IconMail,
  IconUser,
  IconLock,
} from "@tabler/icons-react";
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layout/AuthLayout';
import { Form, Link } from '@inertiajs/react';
import { store } from '@/routes/register';
import InputError from '@/components/ui/input-error';
import { login } from '@/routes';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface RegisterProps {
  status?: string;
}

export default function Register({
  status,
}: RegisterProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AuthLayout title='Sign Up'>
      <Form
        method='POST'
        action='/register'
        resetOnSuccess={['password', 'password_confirmation']}
      >
        {({ processing, errors }) => (
          <>
            <div className="space-y-5">
              {/* Name Field */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <Label htmlFor="name" className="text-sm font-medium">
                  Nama Lengkap
                </Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <IconUser className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    type="text"
                    className="h-14 rounded-xl border-2 border-border/50 bg-background/50 pl-12 pr-4 text-base backdrop-blur-sm transition-all duration-200 focus:border-primary focus:bg-background focus:shadow-lg focus:shadow-primary/10"
                  />
                </div>
                <InputError message={errors.name} />
              </motion.div>

              {/* Email Field */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <IconMail className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    placeholder="nama@email.com"
                    type="email"
                    className="h-14 rounded-xl border-2 border-border/50 bg-background/50 pl-12 pr-4 text-base backdrop-blur-sm transition-all duration-200 focus:border-primary focus:bg-background focus:shadow-lg focus:shadow-primary/10"
                  />
                </div>
                <InputError message={errors.email} />
              </motion.div>

              {/* Password Field */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <IconLock className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    className="h-14 rounded-xl border-2 border-border/50 bg-background/50 pl-12 pr-12 text-base backdrop-blur-sm transition-all duration-200 focus:border-primary focus:bg-background focus:shadow-lg focus:shadow-primary/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-muted-foreground transition-all hover:text-foreground hover:scale-110"
                  >
                    {showPassword ? (
                      <IconEyeOff className="h-5 w-5" />
                    ) : (
                      <IconEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <InputError message={errors.password} />
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <Label htmlFor="password_confirmation" className="text-sm font-medium">
                  Konfirmasi Password
                </Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <IconLock className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                  <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    placeholder="••••••••"
                    type={showPasswordConfirmation ? "text" : "password"}
                    className="h-14 rounded-xl border-2 border-border/50 bg-background/50 pl-12 pr-12 text-base backdrop-blur-sm transition-all duration-200 focus:border-primary focus:bg-background focus:shadow-lg focus:shadow-primary/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                    className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-muted-foreground transition-all hover:text-foreground hover:scale-110"
                  >
                    {showPasswordConfirmation ? (
                      <IconEyeOff className="h-5 w-5" />
                    ) : (
                      <IconEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <InputError message={errors.password_confirmation} />
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <Button
                type='submit'
                disabled={processing}
                className="group relative h-14 w-full overflow-hidden rounded-xl bg-linear-to-r from-primary to-purple-600 text-base font-semibold shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {processing ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Membuat Akun...
                    </>
                  ) : (
                    <>
                      Daftar Sekarang
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity group-hover:opacity-100" />
              </Button>
            </motion.div>

            {/* Login Link */}
            <motion.div 
              className="mt-6 text-center text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              <span className="text-muted-foreground">Sudah punya akun?</span>{' '}
              <Link 
                href={login()} 
                className="font-semibold text-primary hover:text-purple-600 transition-colors hover:underline"
                tabIndex={6}
              >
                Masuk di sini
              </Link>
            </motion.div>
          </>
        )}
      </Form>
    </AuthLayout>
  );
}