import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  IconEye,
  IconEyeOff,
  IconMail,
  IconUser,
} from "@tabler/icons-react";
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layout/AuthLayout';
import { Form, Link } from '@inertiajs/react';
import { store } from '@/routes/register';
import InputError from '@/components/ui/input-error';
import { login } from '@/routes';

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
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs uppercase tracking-wide text-muted-foreground">
                    Name
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      name="name"
                      placeholder="John"
                      type="text"
                      className="h-12 rounded-xl border-border/50 bg-muted/30 pr-10 transition-all focus:border-primary focus:bg-background"
                    />
                    <IconUser className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                  <InputError message={errors.name} />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-wide text-muted-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    placeholder="john.doe@example.com"
                    type="email"
                    className="h-12 rounded-xl border-border/50 bg-muted/30 pr-10 transition-all focus:border-primary focus:bg-background"
                  />
                  <IconMail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
                <InputError message={errors.email} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs uppercase tracking-wide text-muted-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    placeholder="••••••••"
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

              <div className="space-y-2">
                <Label htmlFor="password_confirmation" className="text-xs uppercase tracking-wide text-muted-foreground">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    placeholder="••••••••"
                    type={showPasswordConfirmation ? "text" : "password"}
                    className="h-12 rounded-xl border-border/50 bg-muted/30 pr-10 transition-all focus:border-primary focus:bg-background"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPasswordConfirmation ? (
                      <IconEyeOff className="h-4 w-4" />
                    ) : (
                      <IconEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <InputError message={errors.password_confirmation} />
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex gap-3">
              <Button
                // onClick={handleSubmit}
                type='submit'
                disabled={processing}
                className="group/btn relative h-12 flex-1 overflow-hidden rounded-full bg-gradient-to-r from-primary to-primary font-semibold shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 cursor-pointer disabled:opacity-50"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {processing ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating Account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </span>
              </Button>

            </div>
            <div className="text-center text-sm text-muted-foreground mt-2">
              Already have an account?{' '}
              <Link href={login()} tabIndex={6}>
                Sign in
              </Link>
            </div>
          </>
        )}
      </Form>
    </AuthLayout>
  );
}