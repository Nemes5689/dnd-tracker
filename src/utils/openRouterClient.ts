// OpenRouter API client for AI integration.
// Sends chat completion requests to OpenRouter, returns the AI response.

const OPENROUTER_API = 'https://openrouter.ai/api/v1/chat/completions';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface CompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
}

export interface CompletionResponse {
  text: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Send a chat completion request to OpenRouter.
 * Throws on error (network, auth, rate limit, etc.)
 */
export async function chatCompletion(
  api_key: string,
  request: CompletionRequest
): Promise<CompletionResponse> {
  if (!api_key) {
    throw new Error('OpenRouter API key not set. Add it in Settings.');
  }

  const response = await fetch(OPENROUTER_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${api_key}`,
      // OpenRouter encourages adding referer/title for analytics
      'HTTP-Referer': window.location.origin,
      'X-Title': 'D&D Combat Tracker',
    },
    body: JSON.stringify({
      model: request.model,
      messages: request.messages,
      temperature: request.temperature ?? 0.8,
      max_tokens: request.max_tokens ?? 500,
    }),
  });

  if (!response.ok) {
    let error_msg = `OpenRouter API error (${response.status})`;
    try {
      const error_body = await response.json();
      if (error_body.error?.message) {
        error_msg = error_body.error.message;
      } else if (error_body.message) {
        error_msg = error_body.message;
      }
    } catch {
      // ignore JSON parse errors
    }

    if (response.status === 401) {
      error_msg = 'Invalid API key. Check Settings.';
    } else if (response.status === 402) {
      error_msg = 'Out of credits. Add credits or switch to a free model.';
    } else if (response.status === 429) {
      error_msg = 'Rate limited. Wait a moment and try again.';
    } else if (response.status === 503) {
      error_msg = 'Model temporarily unavailable. Try again or switch models.';
    }

    throw new Error(error_msg);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? '';
  return {
    text,
    usage: data.usage,
  };
}

/**
 * Make several chat completion requests in parallel.
 * Returns an array of results in the same order as requests.
 */
export async function chatCompletionBatch(
  api_key: string,
  requests: CompletionRequest[]
): Promise<CompletionResponse[]> {
  return Promise.all(requests.map((req) => chatCompletion(api_key, req)));
}
