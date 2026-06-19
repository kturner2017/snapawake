const Anthropic = require('@anthropic-ai/sdk');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let imageBase64, targetObject;
  try {
    ({ imageBase64, targetObject } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  if (!imageBase64 || !targetObject) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing imageBase64 or targetObject' }) };
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 50,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 },
          },
          {
            type: 'text',
            text: `Look at this photo. Does it clearly show a ${targetObject}? Answer with only the single word "yes" or "no".`,
          },
        ],
      }],
    });

    const answer = response.content[0]?.text?.toLowerCase().trim() ?? '';
    const verified = answer.startsWith('yes');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verified }),
    };
  } catch (err) {
    console.error('Anthropic error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Verification failed', detail: err.message }),
    };
  }
};
