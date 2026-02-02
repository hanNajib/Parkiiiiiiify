import { FlashMessage } from '@/components/flash-message';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconMail } from "@tabler/icons-react";
import { PropsWithChildren, ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="relative flex justify-center items-center w-full flex-col bg-background p-8 lg:w-1/2 lg:p-16">

        {/* Form Content */}
        <div className="flex flex-1 flex-col min-w-2xl items-center justify-center">
          <div className="mx-auto w-full max-w-md">
            {/* Header */}
            <div className="mb-8">
              <h1 className="mb-3 text-4xl text-center font-bold text-foreground">
                {title} <span className="text-primary">.</span>
              </h1>

            </div>

            {children}


          </div>
        </div>


      </div>


      <FlashMessage />
    </div>
  )
}