import { useEffect } from "react";
import { getDocumentationUrl } from "@/shared/docs/documentationRedirect";

export default function Developers() {
  const docsUrl = getDocumentationUrl();

  useEffect(() => {
    window.location.assign(docsUrl);
  }, [docsUrl]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <p className="text-sm text-slate-600">
        Redirigiendo a la documentación oficial. Si no ocurre automáticamente,
        {" "}
        <a href={docsUrl} className="text-violet-600 hover:underline">
          haz clic aquí
        </a>
        .
      </p>
    </div>
  );
}
