import { useEffect } from "react";
import { getCompanyRedirectUrl } from "@/shared/company/companyRedirect";

export default function Company() {
  const companyUrl = getCompanyRedirectUrl();

  useEffect(() => {
    window.location.assign(companyUrl);
  }, [companyUrl]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <p className="text-sm text-slate-600">
        Redirigiendo al sitio comercial de Antilla Capital. Si no ocurre automáticamente,
        {" "}
        <a href={companyUrl} className="text-violet-600 hover:underline">
          haz clic aquí
        </a>
        .
      </p>
    </div>
  );
}
