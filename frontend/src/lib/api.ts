const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export function createWebSocket(token: string): WebSocket {
  const wsUrl =
    (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(
      /^http/,
      "ws"
    ) + "/ws";

  const ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    ws.send(JSON.stringify({ type: "auth", token }));
  };

  return ws;
}
