import { LinkIcon } from "lucide-react";

export const createItems = [
    { icon: LinkIcon, label: 'Enlace de pago', href: '/paymentLink/create', permission: 'create_payment_link' },
] as const;
