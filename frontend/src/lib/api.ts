import type { HousingInput } from "@/lib/housing"

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim()

export const API_BASE_URL = (configuredApiUrl || "http://localhost:8000").replace(
  /\/+$/,
  "",
)

export type PredictionResponse = {
  model: string
  predicted_median_value_usd: number
}

export type HealthResponse = {
  status: string
  model: string
}

function formatApiError(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object" || !("detail" in payload)) {
    return fallback
  }

  const detail = payload.detail
  if (typeof detail === "string") return detail

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => {
        if (!item || typeof item !== "object") return null
        const message = "msg" in item ? String(item.msg) : null
        const location =
          "loc" in item && Array.isArray(item.loc)
            ? item.loc.filter((part: unknown) => part !== "body").join(".")
            : ""
        return message ? `${location ? `${location}: ` : ""}${message}` : null
      })
      .filter(Boolean)

    if (messages.length > 0) return messages.join(" · ")
  }

  return fallback
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), 12_000)

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => null)
      throw new Error(
        formatApiError(payload, `The API returned ${response.status}.`),
      )
    }

    return (await response.json()) as T
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("The API did not respond within 12 seconds.", {
        cause: error,
      })
    }
    if (error instanceof TypeError) {
      throw new Error(
        "Unable to reach the prediction API. Confirm that FastAPI is running.",
        { cause: error },
      )
    }
    throw error
  } finally {
    window.clearTimeout(timeoutId)
  }
}

export function predictHousing(input: HousingInput) {
  return apiRequest<PredictionResponse>("/predict", {
    method: "POST",
    body: JSON.stringify(input),
  })
}

export function getHealth() {
  return apiRequest<HealthResponse>("/health")
}
