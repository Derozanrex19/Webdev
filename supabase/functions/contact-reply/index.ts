import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const fromEmail = Deno.env.get('CONTACT_REPLY_FROM_EMAIL');

    if (!resendApiKey || !fromEmail) {
      return new Response(
        JSON.stringify({ error: 'Missing RESEND_API_KEY or CONTACT_REPLY_FROM_EMAIL.' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { email, name, replyBody } = await request.json();

    if (!email || !replyBody) {
      return new Response(JSON.stringify({ error: 'Missing email or replyBody.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const safeName = name || 'there';

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [email],
        subject: 'Reply from Lifewood',
        html: `
          <div style="font-family: Manrope, Arial, sans-serif; color: #133020; line-height: 1.6;">
            <p>Hi ${safeName},</p>
            <p>${replyBody.replace(/\n/g, '<br />')}</p>
            <p style="margin-top: 24px;">Lifewood Team</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ error: errorText }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown contact reply email error.',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

