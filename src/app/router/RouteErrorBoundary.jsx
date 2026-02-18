import { Component } from "react";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";

export default class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error?.message || "Error desconocido al cargar la página",
    };
  }

  componentDidCatch(error) {
    // Keep this in dev tools for faster diagnostics when a lazy route fails.
    console.error("Route render error:", error);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.assign(createPageUrl("Home"));
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="max-w-xl w-full rounded-xl border border-rose-200 bg-rose-50 p-6">
          <h2 className="text-xl font-semibold text-rose-900 mb-2">No se pudo cargar esta página</h2>
          <p className="text-sm text-rose-800 mb-4">
            Ocurrió un error al renderizar la ruta. Esto suele pasar por cache antigua del navegador o
            un chunk desactualizado.
          </p>
          <p className="text-xs text-rose-700 bg-white/70 border border-rose-100 rounded-md p-3 mb-4 break-words">
            {this.state.errorMessage}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={this.handleReload} className="bg-rose-600 hover:bg-rose-700 text-white">
              Recargar
            </Button>
            <Button variant="outline" onClick={this.handleGoHome}>
              Ir al inicio
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
