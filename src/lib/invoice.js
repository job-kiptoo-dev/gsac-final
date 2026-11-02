export function createInvoiceNumber() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `GSAC-${datePart}-${randomPart}`
}

export function buildInvoicePayload({ course, visitor, site, form }) {
  const invoiceNumber = createInvoiceNumber()
  const quantity = 1
  const unitPrice = Number(course?.price || 0)
  const amountDue = visitor.convertPrice(unitPrice) * quantity

  return {
    invoiceNumber,
    issuedAt: new Date().toISOString(),
    course: {
      id: course?.id,
      title: course?.title,
      duration: course?.duration,
      format: form?.format || course?.format,
      location: course?.location,
      nextDate: course?.nextDate,
      unitPriceUsd: unitPrice,
    },
    billing: {
      name: `${form?.firstName || ''} ${form?.lastName || ''}`.trim(),
      email: form?.email,
      phone: form?.phone,
      organization: form?.organization,
      paymentMethod: form?.paymentMethod,
    },
    currency: visitor.currency,
    exchangeRate: visitor.exchangeRate,
    amountDue,
    formattedAmount: visitor.formatPrice(unitPrice),
    site: {
      name: site?.name,
      email: site?.email,
      phone: site?.phone,
      address: site?.address,
      whatsapp: site?.whatsapp,
    },
  }
}

export function renderInvoiceHtml(payload) {
  const issueDate = new Date(payload.issuedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${payload.invoiceNumber} - GSAC Invoice</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f7f8fa; color: #1f2937; margin: 0; padding: 32px; }
    .wrap { max-width: 820px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08); }
    .header { background: #0B1F3A; color: white; padding: 32px; }
    .header h1 { margin: 0 0 8px; font-size: 30px; }
    .header p { margin: 0; color: rgba(255,255,255,0.75); }
    .content { padding: 32px; }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
    .box { border: 1px solid #e5e7eb; border-radius: 16px; padding: 20px; }
    .muted { color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
    .value { font-size: 14px; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; margin-top: 28px; }
    th, td { border-bottom: 1px solid #e5e7eb; text-align: left; padding: 14px 0; font-size: 14px; }
    th { color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; font-size: 12px; }
    .total { margin-top: 20px; display: flex; justify-content: flex-end; }
    .total-box { width: 280px; background: #EAF8F6; border: 1px solid #7ED6CE; border-radius: 16px; padding: 18px 20px; }
    .total-box strong { display: block; color: #0B1F3A; font-size: 22px; margin-top: 8px; }
    .footer { padding: 0 32px 32px; color: #6b7280; font-size: 13px; }
    @media (max-width: 700px) { body { padding: 12px; } .grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>${payload.site.name}</h1>
      <p>Course invoice for registration confirmation and payment processing.</p>
    </div>
    <div class="content">
      <div class="grid">
        <div class="box">
          <div class="muted">Invoice</div>
          <div class="value">
            <strong>${payload.invoiceNumber}</strong><br />
            Issue date: ${issueDate}<br />
            Currency: ${payload.currency}
          </div>
        </div>
        <div class="box">
          <div class="muted">Billed to</div>
          <div class="value">
            <strong>${payload.billing.name}</strong><br />
            ${payload.billing.organization || 'Individual participant'}<br />
            ${payload.billing.email}<br />
            ${payload.billing.phone || ''}
          </div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Format</th>
            <th>Qty</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>${payload.course.title}</strong><br />
              <span style="color:#6b7280">${payload.course.duration || ''} · ${payload.course.location || 'GSAC venue / virtual delivery'}</span>
            </td>
            <td>${payload.course.format || 'To be confirmed'}</td>
            <td>1</td>
            <td>${payload.formattedAmount}</td>
          </tr>
        </tbody>
      </table>

      <div class="total">
        <div class="total-box">
          Total amount due
          <strong>${payload.formattedAmount}</strong>
          <div style="font-size:12px; color:#1B6F69; margin-top:8px;">Payment method: ${payload.billing.paymentMethod || 'To be confirmed with GSAC'}</div>
        </div>
      </div>
    </div>
    <div class="footer">
      ${payload.site.name} · ${payload.site.address}<br />
      For payment support contact ${payload.site.email} or ${payload.site.phone}.
    </div>
  </div>
</body>
</html>`
}

export function downloadInvoiceHtml(payload) {
  const html = renderInvoiceHtml(payload)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${payload.invoiceNumber}.html`
  anchor.click()
  URL.revokeObjectURL(url)
}
