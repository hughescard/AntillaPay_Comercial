const buildDetailHref = (pathname: string, id: string) =>
  `${pathname}?${new URLSearchParams({ id }).toString()}`;

export const clientDetailsHref = (id: string) => buildDetailHref("/clients/detail", id);

export const productDetailsHref = (id: string) => buildDetailHref("/products/detail", id);

export const paymentDetailsHref = (id: string) => buildDetailHref("/payments/detail", id);

export const paymentLinkDetailsHref = (id: string) => buildDetailHref("/paymentLink/detail", id);

export const invoiceDetailsHref = (id: string) => buildDetailHref("/invoice/detail", id);
