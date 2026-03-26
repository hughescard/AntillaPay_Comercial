import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getLoginRedirectUrl } from "@/shared/auth/loginRedirect";

const LOGIN_REDIRECT_PATH = getLoginRedirectUrl();

export default function SignInRedirect() {
  useEffect(() => {
    window.location.replace(LOGIN_REDIRECT_PATH);
  }, []);

  return (
    <main className="min-h-[70vh] px-6 py-16 flex items-center justify-center bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">
          AntillaPay
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          Redirigiendo al acceso seguro
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Si la redirección no ocurre automáticamente, puedes continuar con el acceso manualmente.
        </p>
        <div className="mt-6">
          <Link
            to={LOGIN_REDIRECT_PATH}
            className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
          >
            Continuar al inicio de sesión
          </Link>
        </div>
      </div>
    </main>
  );
}
