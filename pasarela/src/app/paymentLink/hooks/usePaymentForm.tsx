type UsePaymentFormOptions = {
  title?: string;
  amount?: string;
  variant?: "desktop" | "mobile";
};

const buildMockForm = (title: string, amount: string) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Arial, sans-serif;
        background: #ffffff;
        color: #0f172a;
      }
      .card {
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        padding: 18px;
        box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
      }
      .badge {
        display: inline-block;
        background: #0b1220;
        color: #fff;
        font-size: 11px;
        padding: 6px 10px;
        border-radius: 8px;
        font-weight: 600;
      }
      .title {
        margin: 14px 0 6px;
        font-size: 14px;
        font-weight: 600;
      }
      .muted { color: #64748b; font-size: 12px; }
      .amount {
        margin-top: 12px;
        border-radius: 10px;
        padding: 10px 12px;
        background: #f8fafc;
        font-weight: 600;
      }
      .btn {
        margin-top: 16px;
        width: 100%;
        border: 0;
        background: #0b5fff;
        color: #fff;
        padding: 10px 12px;
        border-radius: 10px;
        font-weight: 600;
      }
      .note {
        margin-top: 10px;
        font-size: 11px;
        color: #94a3b8;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <span class="badge">PAYMENT</span>
      <div class="title">${title}</div>
      <div class="muted">Embedded checkout mock</div>
      <div class="amount">${amount}</div>
      <button class="btn" type="button">Pay</button>
      <div class="note">This is a mock iframe preview.</div>
    </div>
  </body>
</html>`;

export const usePaymentForm = (options: UsePaymentFormOptions = {}) => {
  const title = options.title?.trim() || "Payment";
  const amount = options.amount?.trim() || "$0.00";
  const variant = options.variant ?? "desktop";
  const srcDoc = buildMockForm(title, amount);
  const height = variant === "mobile" ? "520px" : "420px";

  const paymentForm = (
    <div
      className="w-full overflow-hidden"
      style={{ height: height }}
    >
  <iframe
    title="Payment form"
    className="w-full h-full rounded-xl"
    srcDoc={srcDoc}
    sandbox="allow-forms allow-scripts allow-same-origin"
  />

    </div>

  );

  return { paymentForm };
};
