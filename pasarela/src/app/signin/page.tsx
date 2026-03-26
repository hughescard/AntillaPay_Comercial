'use client';

import { useState } from 'react';
import { LoginForm } from './_components/LoginForm';
import { TwoStepVerifyPage } from '@/common/components/ui/TwoStepVerify';


export default function LoginPage(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [step, setStep] = useState<'form' | 'verifyCode'>('form')
  const [expires_in,setExpiresIn] = useState(900)

  return (
    <div className="min-h-screen w-full absolute top-0  flex items-center justify-center  overflow-hidden bg-background">
      
      {/* FONDO DEGRADADO SUAVE */}
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

      { step == 'form' &&
        <LoginForm
          email={email}
          setEmail={(email)=>setEmail(email)}
          setStep={(step)=>setStep(step)}
          password={password}
          setPassword={(value)=>setPassword(value)}
          setExpiresIn={(time)=>setExpiresIn(time)}
        />
      }

      {
        step == 'verifyCode' && 
        <TwoStepVerifyPage
          expires_in={Number(expires_in)}
          userEmail={email}
          password={password}
          setStep={(step)=>setStep(step)}
        />
      }
      
    </div>
  );
};
