export const handleCopyLink = async (data: { link?: string }) => {
  const text = data?.link?.trim();
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    console.log("Link copiado");
  } catch {
    // Fallback para navegadores sin permisos de clipboard
    const input = document.createElement("textarea");
    input.value = text;
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    console.log("Link copiado (fallback)");
  }
}; 