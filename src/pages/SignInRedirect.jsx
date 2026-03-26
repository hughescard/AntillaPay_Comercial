import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getConfiguredLoginUrl } from "@/shared/auth/loginRedirect";

const LOCAL_PASARELA_SIGNIN_PATH = "/pasarela/signin";

export default function SignInRedirect() {
  const configuredLoginUrl = getConfiguredLoginUrl();
  const loginUrl = configuredLoginUrl || (import.meta.env.DEV ? LOCAL_PASARELA_SIGNIN_PATH : null);

  useEffect(() => {
    if (loginUrl) {
      window.location.replace(loginUrl);
    }
  }, [loginUrl]);

  if (loginUrl) {
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
            <a
              href={loginUrl}
              className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
            >
              Continuar al inicio de sesión
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] px-6 py-16 flex items-center justify-center bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="w-full max-w-xl rounded-3xl border border-amber-200 bg-amber-50 p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
          Configuración pendiente
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          El acceso no está configurado
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-700">
          Define `VITE_LOGIN_URL` o `VITE_PASARELA_ORIGIN` en Vercel para redirigir al login externo.
          En desarrollo local, `npm run dev` usa la ruta interna `/pasarela/signin` para mantener el flujo de prueba.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl border border-amber-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-amber-100 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
