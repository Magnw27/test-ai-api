# Test AI API

A polished, browser-first playground for testing AI chat endpoints.

## Features

- Custom API endpoint URL in the sidebar
- Custom model, API key, temperature and max tokens
- OpenAI-compatible request format
- Endpoint connection test
- Chat history for the current tab
- Responsive ChatGPT-inspired UX
- No backend required
- Ready for Vercel, Netlify or GitHub Pages

## Request format

The app sends:

```json
{
  "model": "your-model",
  "messages": [
    { "role": "user", "content": "Hello" }
  ],
  "temperature": 0.7,
  "max_tokens": 1024
}
```

It reads the assistant response from `choices[0].message.content` first, with fallbacks for common endpoint formats.

## Security

This is a frontend tester. API keys are kept only in the current browser tab and are never written to the repository. Do not use a long-lived production secret in a public browser app. For production usage, proxy requests through a server-side function and keep provider keys in environment variables.

Your AI endpoint must allow browser CORS requests.

## Deploy

No build step is required. Deploy the repository root as a static site.

- Vercel: Framework preset **Other**, build command empty, output directory `.`
- Netlify: publish directory `.`
