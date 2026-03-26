'use client';

import { useTranslation } from "react-i18next";
import { RegisterForm } from "./_components/RegisterForm";
import { RegisterInfo } from "./_components/RegisterInfo";
import { useState } from "react";
import { TwoStepVerifyPage } from "@/common/components/ui/TwoStepVerify";


export default function RegisterPage() {
    const {t} = useTranslation();
    const [expiresIn,setExpiresIn] = useState(900);
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [step,setStep] = useState<'form' | 'verifyCode'>('form')
  return (
    <div className="min-h-screen w-full absolute top-0 z-20 bg-background  overflow-x-hidden">
      
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div 
                className="absolute inset-0 bg-linear-to-br from-grad-start via-grad-mid2 to-grad-end"
                style={{
                background: `linear-gradient(135deg, 
                    var(--grad-start) 0%, 
                    var(--grad-mid1) 10%, 
                    var(--grad-mid2) 25%, 
                    var(--grad-mid3) 40%, 
                    var(--grad-mid4) 70%, 
                    var(--grad-mid5) 85%, 
                    var(--grad-end) 100%
                )`
                }}
            />
            <div 
                className="absolute top-0 right-0 w-[60%] h-[70%]"
                style={{
                background: `radial-gradient(at 70% 30%, var(--grad-blob-purple) 0%, transparent 50%)`
                }}
            />
            <div 
                className="absolute bottom-0 left-0 w-[50%] h-[60%]"
                style={{
                background: `radial-gradient(at 20% 80%, var(--grad-blob-yellow) 0%, transparent 50%)`
                }}
            />
        </div>

        <div className="relative  flex flex-col lg:flex-row z-10 lg:w-[70%] xl:w-[60%] mx-auto items-center gap-10 justify-between py-8 lg:py-0 my-auto lg:h-[93vh]">
            
            <RegisterInfo />

            {step == 'form' &&
            <>
                

                <RegisterForm 
                    password={password}
                    email={email}
                    setStep={(step)=>setStep(step)}
                    setPassword={(password)=>setPassword(password)}
                    setEmail={(email)=>setEmail(email)}
                    setExpiresIn={(value)=>setExpiresIn(value)}
                />
            </>
            }

            {
                step == 'verifyCode' &&
                <div className="lg:order-2 order-1 w-full">
                    <TwoStepVerifyPage
                        expires_in={Number(expiresIn)}
                        userEmail={email}
                        password={password}
                        setStep={(step)=>setStep(step)}
                    />
                </div>
            }

        </div>

        <div className="w-[90%] mx-auto font-bold flex p-5 justify-start text-sm text-muted-foreground">
        © {t('nav.brand')}.  <a href="#" className="ml-4 hover:text-foreground">{t('register.info.copyrigth')}</a>
        </div>
    </div>
  );
}