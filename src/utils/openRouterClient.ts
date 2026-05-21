// AI client for tactics integration.
// Supports OpenRouter, Google AI Studio (Gemini API), and OpenAI-compatible endpoints.

export type AIProvider = 'openrouter' | 'google-ai-studio' | 'openai-compatible';

const OPENROUTER_API = 'https://openrouter.ai/api/v1/chat/completions';
const GOOGLE_AI_API = 'https://generativelanguage.googleapis.com/v1beta/models';

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

export interface AIClientConfig {
  provider: AIProvider;
  api_key: string;
  model: string;
  custom_base_url?: string;
}

export interface CompletionResponse {
  text: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

function providerLabel(provider: AIProvider): string {
  if (provider === 'google-ai-studio') return 'Google AI Studio';
  if (provider === 'openai-compatible') return 'custom OpenAI-compatible provider';
  return 'OpenRouter';
}

function cleanBaseUrl(base_url: string): string {
  return base_url.trim().replace(/\/+$/, '');
}

function chatCompletionsUrl(base_url: string): string {
  const cleaned = cleanBaseUrl(base_url);
  if (!cleaned) return '';
  if (cleaned.endsWith('/chat/completions')) return cleaned;
  return `${cleaned}/chat/completions`;
}

async function parseOpenAIStyleResponse(response: Response, provider: AIProvider): Promise<CompletionResponse> {
  if (!response.ok) {
    let error_msg = `${providerLabel(provider)} API error (${response.status})`;
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

    if (response.status === 401 || response.status === 403) {
      error_msg = `Invalid or unauthorized API key for ${providerLabel(provider)}. Check Settings.`;
    } else if (response.status === 402) {
      error_msg = 'Out of credits. Add credits or switch model/provider.';
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

async function chatCompletionOpenAIStyle(
  config: AIClientConfig,
  request: CompletionRequest,
  url: string
): Promise<CompletionResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${config.api_key}`,
  };

  if (config.provider === 'openrouter') {
    headers['HTTP-Referer'] = window.location.origin;
    headers['X-Title'] = 'D&D Combat Tracker';
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: request.model || config.model,
      messages: request.messages,
      temperature: request.temperature ?? 0.8,
      max_tokens: request.max_tokens ?? 500,
    }),
  });

  return parseOpenAIStyleResponse(response, config.provider);
}

async function chatCompletionGoogleAI(
  config: AIClientConfig,
  request: CompletionRequest
): Promise<CompletionResponse> {
  const model = encodeURIComponent(request.model || config.model || 'gemini-1.5-flash');
  const url = `${GOOGLE_AI_API}/${model}:generateContent?key=${encodeURIComponent(config.api_key)}`;
  const system_text = request.messages
    .filter((m) => m.role === 'system')
    .map((m) => m.content)
    .join('\n\n');
  const contents = request.messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: system_text ? { parts: [{ text: system_text }] } : undefined,
      contents,
      generationConfig: {
        temperature: request.temperature ?? 0.8,
        maxOutputTokens: request.max_tokens ?? 500,
      },
    }),
  });

  if (!response.ok) {
    let error_msg = `Google AI Studio API error (${response.status})`;
    try {
      const error_body = await response.json();
      if (error_body.error?.message) error_msg = error_body.error.message;
    } catch {
      // ignore JSON parse errors
    }
    if (response.status === 400) {
      error_msg = `${error_msg}. Check the Gemini model name and API key.`;
    } else if (response.status === 401 || response.status === 403) {
      error_msg = 'Invalid or unauthorized Google AI Studio API key. Check Settings.';
    } else if (response.status === 429) {
      error_msg = 'Google AI Studio rate limit reached. Wait a moment or switch model.';
    }
    throw new Error(error_msg);
  }

  const data = await response.json();
  const text =
    data.candidates?.[0]?.content?.parts
      ?.map((p: any) => p.text ?? '')
      .join('') ?? '';

  const usage = data.usageMetadata
    ? {
        prompt_tokens: data.usageMetadata.promptTokenCount,
        completion_tokens: data.usageMetadata.candidatesTokenCount,
        total_tokens: data.usageMetadata.totalTokenCount,
      }
    : undefined;

  return { text, usage };
}

/**
 * Send a chat completion request using the selected provider.
 */
export async function chatCompletionWithProvider(
  config: AIClientConfig,
  request: CompletionRequest
): Promise<CompletionResponse> {
  if (!config.api_key?.trim()) {
    throw new Error(`${providerLabel(config.provider)} API key not set. Add it in Settings.`);
  }

  if (config.provider === 'google-ai-studio') {
    return chatCompletionGoogleAI(config, request);
  }

  if (config.provider === 'openai-compatible') {
    const url = chatCompletionsUrl(config.custom_base_url ?? '');
    if (!url) {
      throw new Error('Custom provider base URL not set. Add it in Settings. Example: https://api.openai.com/v1');
    }
    return chatCompletionOpenAIStyle(config, request, url);
  }

  return chatCompletionOpenAIStyle(config, request, OPENROUTER_API);
}

/**
 * Backwards-compatible OpenRouter-only helper.
 */
export async function chatCompletion(
  api_key: string,
  request: CompletionRequest
): Promise<CompletionResponse> {
  return chatCompletionWithProvider(
    { provider: 'openrouter', api_key, model: request.model },
    request
  );
}

export async function chatCompletionBatchWithProvider(
  config: AIClientConfig,
  requests: CompletionRequest[]
): Promise<CompletionResponse[]> {
  return Promise.all(
    requests.map((req) =>
      chatCompletionWithProvider(
        { ...config, model: req.model || config.model },
        req
      )
    )
  );
}

/**
 * Backwards-compatible OpenRouter-only batch helper.
 */
export async function chatCompletionBatch(
  api_key: string,
  requests: CompletionRequest[]
): Promise<CompletionResponse[]> {
  return Promise.all(requests.map((req) => chatCompletion(api_key, req)));
}
