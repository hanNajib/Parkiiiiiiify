import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  IconEye,
  IconEyeOff,
  IconMail,
  IconLock,
} from "@tabler/icons-react";
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layout/AuthLayout';
import { Form, Link } from '@inertiajs/react';
import InputError from '@/components/ui/input-error';
import { register } from '@/routes';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
  canRegister: boolean;
}

const inputClass =
  "h-13 rounded-xl border-2 border-border/50 bg-background/50 pl-12 pr-4 text-base backdrop-blur-sm transition-all duration-200 focus:border-primary focus:bg-background focus:shadow-lg focus:shadow-primary/10";

export default function Login({ status, canResetPassword, canRegister }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthLayout title='Sign In'>
      {status && (
        <motion.div
          className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {status}
        </motion.div>
      )}

      <Form resetOnSuccess={['password']} method='POST' action='/login'>
        {({ processing, errors }) => (
          <>
            <div className="space-y-5">
              {/* Email */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
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
                    autoComplete="email"
                    autoFocus
                    className={inputClass}
                  />
                </div>
                <InputError message={errors.email} />
              </motion.div>

              {/* Password */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  {canResetPassword && (
                    <Link
                      href="/forgot-password"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      Lupa password?
                    </Link>
                  )}
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <IconLock className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className={`${inputClass} pr-12`}
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
            </div>

            {/* Submit Button */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26, duration: 0.3 }}
            >
              <Button
                type="submit"
                disabled={processing}
                className="group relative h-13 w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary to-purple-600 text-base font-semibold shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {processing ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      Masuk
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity group-hover:opacity-100" />
              </Button>
            </motion.div>

            {/* Register Link */}
            {canRegister && (
              <motion.div
                className="mt-6 text-center text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.32, duration: 0.3 }}
              >
                <span className="text-muted-foreground">Belum punya akun?</span>{' '}
                <Link
                  href={register()}
                  className="font-semibold text-primary hover:text-purple-600 transition-colors hover:underline"
                >
                  Daftar sekarang
                </Link>
              </motion.div>
            )}
          </>
        )}
      </Form>
    </AuthLayout>
  );
}