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
    const fromEmail = Deno.env.get('THANK_YOU_FROM_EMAIL');

    if (!resendApiKey || !fromEmail) {
      return new Response(
        JSON.stringify({ error: 'Missing RESEND_API_KEY or THANK_YOU_FROM_EMAIL.' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { email, firstName, positionApplied } = await request.json();

    if (!email || !firstName || !positionApplied) {
      return new Response(JSON.stringify({ error: 'Missing required email payload.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [email],
        subject: 'Thank you for your interest in Lifewood',
        html: `
          <div style="font-family: Manrope, Arial, sans-serif; color: #133020; line-height: 1.6;">
            <h2 style="margin-bottom: 12px;">Thank you for your application, ${firstName}.</h2>
            <p>We have received your application for the <strong>${positionApplied}</strong> role at Lifewood.</p>
            <p>Our team will review your submission and contact you if your profile matches the next stage of the process.</p>
            <p style="margin-top: 24px;">Lifewood Recruitment Team</p>
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
        error: error instanceof Error ? error.message : 'Unknown email dispatch error.',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
