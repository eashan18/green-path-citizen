import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text, voice = 'alloy' } = await req.json();
    
    if (!text) {
      throw new Error('Text is required');
    }

    console.log('Processing text-to-speech:', text.substring(0, 100));

    // For now, we'll use a simple fallback since Groq doesn't have TTS
    // In a real implementation, you might want to use OpenAI or other TTS services
    // or implement a text-only response for voice chat
    
    // Create a simple audio file (silence) as a placeholder
    // In production, you'd integrate with a proper TTS service
    const placeholderAudio = new Uint8Array(1024).fill(0);
    const base64Audio = btoa(String.fromCharCode(...placeholderAudio));

    console.log('Text-to-speech processed (placeholder)');

    return new Response(
      JSON.stringify({ 
        audioContent: base64Audio,
        message: 'TTS feature requires additional service setup. Text response provided.'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in text-to-speech function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});