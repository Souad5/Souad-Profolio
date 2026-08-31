const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const REQUEST_TIMEOUT_MS = 15000;

let token = null;

export function setAuthToken(t) {
  token = t;
}

export function getAuthToken() {
  return token;
}

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    if (err && err.name === "AbortError") {
      throw new ApiError(0, `Request timed out (${method} ${path})`);
    }
    // Network-level failure: backend down, unreachable, or blocked before response.
    throw new ApiError(
      0,
      `Cannot reach the API server (${API_URL}) — check that the backend is running.`
    );
  }
  clearTimeout(timer);

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      res.status,
      data?.message || `Request failed with status ${res.status}`
    );
  }

  return data;
}

export const api = {
  get: (path, opts = {}) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts = {}) => request(path, { ...opts, body, method: "POST" }),
  put: (path, body, opts = {}) => request(path, { ...opts, body, method: "PUT" }),
  patch: (path, body, opts = {}) => request(path, { ...opts, body, method: "PATCH" }),
  delete: (path, opts = {}) => request(path, { ...opts, method: "DELETE" }),
};

export { API_URL };