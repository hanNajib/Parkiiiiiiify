import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  IconEye,
  IconEyeOff,
  IconMail,
} from "@tabler/icons-react";
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layout/AuthLayout';
import { Form, Link } from '@inertiajs/react';
import { store } from '@/routes/login';
import InputError from '@/components/ui/input-error';
import { register } from '@/routes';

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
  canRegister: boolean;
}

export default function Login({
  status,
  canResetPassword,
  canRegister,
}: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AuthLayout title='Sign In'>
      <Form
        resetOnSuccess={['password']}
        method='POST'
        action='/login'
      >
        {({ processing, errors }) => (
          <>
            <div className="space-y-4">
              {/* Name Fields Row */}
              <div className="grid grid-cols-2 gap-4">
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-wide text-muted-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    placeholder="michal.masiak@anywhere.co"
                    type="email"
                    name='email'
                    className="h-12 rounded-xl border-border/50 bg-muted/30 pr-10 transition-all focus:border-primary focus:bg-background"
                  />
                  <IconMail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
                <InputError message={errors.email} />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs uppercase tracking-wide text-muted-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    placeholder="••••••••"
                    name='password'
                    type={showPassword ? "text" : "password"}
                    className="h-12 rounded-xl border-primary/50 bg-muted/30 pr-10 ring-1 ring-primary/20 transition-all focus:border-primary focus:bg-background focus:ring-primary/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? (
                      <IconEyeOff className="h-4 w-4" />
                    ) : (
                      <IconEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <InputError message={errors.password} />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Button
                type='submit'
                disabled={isLoading}
                className="group/btn relative h-12 flex-1 overflow-hidden rounded-full bg-gradient-to-r from-primary to-primary font-semibold shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 cursor-pointer disabled:opacity-50"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Loading...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </span>
              </Button>

            </div>
            {canRegister && (
              <div className="text-center text-sm text-muted-foreground mt-2">
                Don't have an account?{' '}
                <Link href={register()} tabIndex={5}>
                  Sign up
                </Link>
              </div>
            )}
          </>
        )}
      </Form>
    </AuthLayout>
  );
}