# Test AI API

A polished, browser-first playground for testing AI endpoints and inspecting their responses.

## Features

- Custom API endpoint URL in the sidebar
- **Optional model** — leave it empty and the request will not include a `model` field
- API key, temperature and max tokens controls
- OpenAI-compatible chat request when the endpoint supports it
- Endpoint connection test
- Raw JSON/text response fallback
- Chat history for the current tab
- Responsive ChatGPT-inspired UX
- No backend required
- Ready for Vercel, Netlify or GitHub Pages

## Model behavior

The model field is optional.

- Empty model: the app sends the request without `model` and focuses on displaying the endpoint response.
- Filled model: the app includes `model` in the JSON body.
- The response parser accepts common formats such as `choices[0].message.content`, `output_text`, `response`, and `text`.
- If none match, the complete JSON response is displayed instead.

## Request format

With a model:

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

Without a model, the `model` property is omitted.

## Security

This is a frontend tester. API keys are kept only in the current browser tab and are never written to the repository. Do not use a long-lived production secret in a public browser app. For production usage, proxy requests through a server-side function and keep provider keys in environment variables.

Your AI endpoint must allow browser CORS requests.

## Deploy

No build step is required. Deploy the repository root as a static site.

- Vercel: Framework preset **Other**, build command empty, output directory `.\`
- Netlify: publish directory `.\`
