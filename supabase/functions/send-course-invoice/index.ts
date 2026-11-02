import { Resend } from 'npm:resend@4.0.0'
import { createClient } from 'npm:@supabase/supabase-js@2.49.8'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function renderInvoiceHtml(payload: any) {
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
    .content { padding: 32px; }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
    .box { border: 1px solid #e5e7eb; border-radius: 16px; padding: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 24px; }
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
        <div class="box"><strong>Invoice ${payload.invoiceNumber}</strong><br />Issued: ${issueDate}<br />Currency: ${payload.currency}</div>
        <div class="box"><strong>${payload.billing.name}</strong><br />${payload.billing.organization || 'Individual participant'}<br />${payload.billing.email}<br />${payload.billing.phone || ''}</div>
      </div>
      <table>
        <thead><tr><th>Description</th><th>Format</th><th>Qty</th><th>Amount</th></tr></thead>
        <tbody>
          <tr>
            <td><strong>${payload.course.title}</strong><br /><span style="color:#6b7280">${payload.course.duration || ''} · ${payload.course.location || 'GSAC venue / virtual delivery'}</span></td>
            <td>${payload.course.format || 'To be confirmed'}</td>
            <td>1</td>
            <td>${payload.formattedAmount}</td>
          </tr>
        </tbody>
      </table>
      <div class="total"><div class="total-box">Total amount due<strong>${payload.formattedAmount}</strong><div style="font-size:12px; color:#1B6F69; margin-top:8px;">Payment method: ${payload.billing.paymentMethod || 'To be confirmed with GSAC'}</div></div></div>
    </div>
    <div class="footer">${payload.site.name} · ${payload.site.address}<br />For payment support contact ${payload.site.email} or ${payload.site.phone}.</div>
  </div>
</body>
</html>`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    if (!payload?.billing?.email || !payload?.course?.title) {
      return new Response(JSON.stringify({ success: false, error: 'Missing required invoice data' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const resendKey = Deno.env.get('RESEND_API_KEY')
    const resendFrom = Deno.env.get('RESEND_FROM_EMAIL') || 'GSAC <noreply@gsac.org>'
    const adminEmail = Deno.env.get('ADMIN_NOTIFICATION_EMAIL')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (supabaseUrl && serviceRole) {
      const admin = createClient(supabaseUrl, serviceRole)
      await admin.from('invoices').insert({
        enrollment_id: payload.enrollmentId || null,
        invoice_number: payload.invoiceNumber,
        recipient_name: payload.billing.name,
        recipient_email: payload.billing.email,
        course_title: payload.course.title,
        currency: payload.currency,
        unit_price: payload.course.unitPriceUsd,
        amount_due: payload.amountDue,
        exchange_rate: payload.exchangeRate,
        status: resendKey ? 'Sent' : 'Generated',
        payload,
      })
    }

    if (!resendKey) {
      return new Response(JSON.stringify({ success: true, emailed: false, reason: 'RESEND_API_KEY not configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const resend = new Resend(resendKey)
    const html = renderInvoiceHtml(payload)
    const recipients = adminEmail ? [payload.billing.email, adminEmail] : [payload.billing.email]

    const { error } = await resend.emails.send({
      from: resendFrom,
      to: recipients,
      subject: `GSAC Invoice ${payload.invoiceNumber} - ${payload.course.title}`,
      html,
    })

    if (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true, emailed: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
