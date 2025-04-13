// pages/api/chat.js
import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question } = req.query;

  if (!question) {
    return res.status(400).json({ error: 'Missing question parameter' });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "gemma2-9b-it",
      messages: [
        {
          role: "system",
          content:
            "You are a specialized agriculture chatbot who can answer any question related to agriculture. You politely refuse to answer any question that is not related to agriculture. Answer in simple manner without fancying the language.",
        },
        {
          role: "user",
          content: question,
        },
      ],
      temperature: 1,
      max_tokens: 512,
      top_p: 1,
      stream: false,
    });

    return res.status(200).json({ response: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
}
