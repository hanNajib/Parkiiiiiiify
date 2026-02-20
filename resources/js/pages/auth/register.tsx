import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  IconEye,
  IconEyeOff,
  IconMail,
  IconUser,
  IconLock,
  IconCheck,
} from "@tabler/icons-react";
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layout/AuthLayout';
import { Form, Link } from '@inertiajs/react';
import InputError from '@/components/ui/input-error';
import { login } from '@/routes';
import { motion } from 'motion/react';
import { ArrowRight, ArrowLeft, Building2, MapPin, Globe } from 'lucide-react';

interface RegisterProps {
  status?: string;
}

const STEPS = [
  { id: 1, title: 'Profil Anda', icon: IconUser },
  { id: 2, title: 'Data Instansi', icon: Building2 },
  { id: 3, title: 'Keamanan Akun', icon: IconLock },
];

const inputClass =
  "h-13 rounded-xl border-2 border-border/50 bg-background/50 pl-12 pr-4 text-base backdrop-blur-sm transition-all duration-200 focus:border-primary focus:bg-background focus:shadow-lg focus:shadow-primary/10 w-full";

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((step, idx) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;
        return (
          <div key={step.id} className="flex items-center">
            <motion.div
              className={`relative flex items-center justify-center w-9 h-9 rounded-full border-2 text-sm font-bold transition-all duration-300 ${
                isCompleted
                  ? 'bg-primary border-primary text-primary-foreground'
                  : isActive
                  ? 'border-primary text-primary bg-primary/10'
                  : 'border-border/50 text-muted-foreground bg-background/50'
              }`}
              animate={{ scale: isActive ? 1.1 : 1 }}
            >
              {isCompleted ? <IconCheck className="w-4 h-4" /> : <span>{step.id}</span>}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
            {idx < STEPS.length - 1 && (
              <div className="w-12 mx-1 h-0.5 rounded-full overflow-hidden bg-border/30">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  animate={{ width: currentStep > step.id ? '100%' : '0%' }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Register({ status }: RegisterProps) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const isLastStep = step === STEPS.length;

  const goNext = () => setStep((s) => Math.min(s + 1, STEPS.length));
  const goPrev = () => setStep((s) => Math.max(s - 1, 1));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !isLastStep) {
      e.preventDefault();
      goNext();
    }
  };

  const currentStepInfo = STEPS[step - 1];
  const StepIcon = currentStepInfo.icon;

  return (
    <AuthLayout title="Sign Up">
      <Form
        method="POST"
        action="/register"
        resetOnSuccess={['password', 'password_confirmation']}
      >
        {({ processing, errors }) => (
          <>
            <StepIndicator currentStep={step} />

            {/* Step Header */}
            <motion.div
              key={`header-${step}`}
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
                <StepIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                  Langkah {step} dari {STEPS.length}
                </p>
                <h2 className="text-lg font-bold text-foreground leading-tight">
                  {currentStepInfo.title}
                </h2>
              </div>
            </motion.div>

            {/*
              Semua field SELALU ada di DOM supaya value ga hilang pas ganti step.
              Pakai `hidden` buat nyembunyiin, bukan conditional render.
              tabIndex={-1} biar field yg tersembunyi ga bisa di-tab.
            */}
            <div onKeyDown={handleKeyDown}>

              {/* ── STEP 1 ── */}
              <div className={step === 1 ? 'space-y-5' : 'hidden'}>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Nama Lengkap</Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <IconUser className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      type="text"
                      tabIndex={step === 1 ? 0 : -1}
                      className={inputClass}
                    />
                  </div>
                  <InputError message={errors.name} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <IconMail className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                      id="email"
                      name="email"
                      placeholder="nama@email.com"
                      type="email"
                      tabIndex={step === 1 ? 0 : -1}
                      className={inputClass}
                    />
                  </div>
                  <InputError message={errors.email} />
                </div>
              </div>

              {/* ── STEP 2 ── */}
              <div className={step === 2 ? 'space-y-5' : 'hidden'}>
                <div className="space-y-2">
                  <Label htmlFor="institution_name" className="text-sm font-medium">Nama Instansi</Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <Building2 className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                      id="institution_name"
                      name="institution_name"
                      placeholder="SMKN 8 Jember"
                      type="text"
                      tabIndex={step === 2 ? 0 : -1}
                      className={inputClass}
                    />
                  </div>
                  <InputError message={errors.institution_name} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institution_address" className="text-sm font-medium">Alamat Instansi</Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <MapPin className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                      id="institution_address"
                      name="institution_address"
                      placeholder="Jl. Mastrip No. 5, Jember"
                      type="text"
                      tabIndex={step === 2 ? 0 : -1}
                      className={inputClass}
                    />
                  </div>
                  <InputError message={errors.institution_address} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domain_prefix" className="text-sm font-medium">Subdomain</Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <Globe className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <div className="flex items-center">
                      <Input
                        id="domain_prefix"
                        name="domain_prefix"
                        placeholder="nama-instansi"
                        type="text"
                        pattern="[a-z0-9-]+"
                        tabIndex={step === 2 ? 0 : -1}
                        className="h-13 rounded-l-xl border-2 border-r-0 border-border/50 bg-background/50 pl-12 pr-4 text-base backdrop-blur-sm transition-all duration-200 focus:border-primary focus:bg-background focus:shadow-lg focus:shadow-primary/10 flex-1"
                      />
                      <span className="h-13 rounded-r-xl border-2 border-border/50 bg-muted/50 px-3 flex items-center text-xs text-muted-foreground backdrop-blur-sm whitespace-nowrap font-mono">
                        .parkify.test
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Gunakan huruf kecil, angka, dan tanda hubung (-)</p>
                  <InputError message={errors.domain_prefix} />
                </div>
              </div>

              {/* ── STEP 3 ── */}
              <div className={step === 3 ? 'space-y-5' : 'hidden'}>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <IconLock className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      type={showPassword ? 'text' : 'password'}
                      tabIndex={step === 3 ? 0 : -1}
                      className={`${inputClass} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-muted-foreground transition-all hover:text-foreground hover:scale-110"
                    >
                      {showPassword ? <IconEyeOff className="h-5 w-5" /> : <IconEye className="h-5 w-5" />}
                    </button>
                  </div>
                  <InputError message={errors.password} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password_confirmation" className="text-sm font-medium">Konfirmasi Password</Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <IconLock className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                      id="password_confirmation"
                      name="password_confirmation"
                      placeholder="••••••••"
                      type={showPasswordConfirmation ? 'text' : 'password'}
                      tabIndex={step === 3 ? 0 : -1}
                      className={`${inputClass} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                      className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-muted-foreground transition-all hover:text-foreground hover:scale-110"
                    >
                      {showPasswordConfirmation ? <IconEyeOff className="h-5 w-5" /> : <IconEye className="h-5 w-5" />}
                    </button>
                  </div>
                  <InputError message={errors.password_confirmation} />
                </div>
              </div>

            </div>

            {/* Navigation Buttons */}
            <div className={`mt-8 flex gap-3 ${step > 1 ? 'justify-between' : 'justify-end'}`}>
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={goPrev}
                  disabled={processing}
                  className="h-13 px-6 rounded-xl border-2 font-semibold gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Kembali
                </Button>
              )}

              {!isLastStep ? (
                <Button
                  type="button"
                  onClick={goNext}
                  className="group h-13 flex-1 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-base font-semibold shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] gap-2"
                >
                  Lanjut
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={processing}
                  className="group relative h-13 flex-1 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-purple-600 text-base font-semibold shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
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
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity group-hover:opacity-100" />
                </Button>
              )}
            </div>

            {/* Login Link */}
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Sudah punya akun?</span>{' '}
              <Link
                href={login()}
                className="font-semibold text-primary hover:text-purple-600 transition-colors hover:underline"
              >
                Masuk di sini
              </Link>
            </div>
          </>
        )}
      </Form>
    </AuthLayout>
  );
}