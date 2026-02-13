import { FlashMessage } from '@/components/flash-message';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo-icon";
import { IconMail } from "@tabler/icons-react";
import { Link } from "@inertiajs/react";
import { PropsWithChildren, ReactNode } from "react";
import { motion } from "framer-motion";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="relative flex justify-center items-center w-full flex-col p-8 lg:w-1/2">

        {/* Form Content */}
        <div className="flex flex-1 flex-col min-w-2xl items-center justify-center w-full">
          <motion.div 
            className="mx-auto w-full max-w-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Card */}
            <div className="relative rounded-2xl bg-card border border-border shadow-lg p-8">
              {/* Header */}
              <div className="mb-8 text-center">
                <h1 className="mb-3 text-3xl md:text-4xl font-bold">
                  {title}<span className="bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">.</span>
                </h1>
                <p className="text-sm text-muted-foreground">
                  {title === 'Sign In' ? 'Selamat datang kembali!' : 'Mulai kelola parkir Anda'}
                </p>
              </div>

              {children}
            </div>
          </motion.div>
        </div>
      </div>

      <FlashMessage />
    </div>
  )
}