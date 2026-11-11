import { useCallback, useEffect, useState } from "react"
import {
  Activity,
  Check,
  Clipboard,
  Copy,
  ExternalLink,
  RefreshCw,
  Server,
  WifiOff,
  Zap,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { API_BASE_URL, getHealth, type HealthResponse } from "@/lib/api"

const exampleRequest = `{
  "MedInc": 3.5,
  "HouseAge": 25,
  "AveRooms": 5.3,
  "AveBedrms": 1.1,
  "Population": 1250,
  "AveOccup": 3.0,
  "Latitude": 34.05,
  "Longitude": -118.25
}`

type HealthState =
  | { state: "checking"; data: null; message: null }
  | { state: "ready"; data: HealthResponse; message: null }
  | { state: "error"; data: null; message: string }

type CopyState = {
  key: string
  status: "copied" | "failed"
} | null

async function writeToClipboard(value: string) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(value)
      return
    } catch {
      // Fall through to the legacy path for browsers that deny Clipboard API access.
    }
  }

  const textArea = document.createElement("textarea")
  textArea.value = value
  textArea.setAttribute("readonly", "")
  textArea.style.position = "fixed"
  textArea.style.left = "-9999px"
  textArea.style.opacity = "0"
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  const copied = document.execCommand("copy")
  document.body.removeChild(textArea)

  if (!copied) {
    throw new Error("Clipboard access is unavailable.")
  }
}

export function APISection() {
  const [health, setHealth] = useState<HealthState>({
    state: "checking",
    data: null,
    message: null,
  })
  const [copyState, setCopyState] = useState<CopyState>(null)

  const checkHealth = useCallback(async () => {
    setHealth({ state: "checking", data: null, message: null })

    try {
      const response = await getHealth()
      setHealth({ state: "ready", data: response, message: null })
    } catch (error) {
      setHealth({
        state: "error",
        data: null,
        message:
          error instanceof Error
            ? error.message
            : "The API health check could not be completed.",
      })
    }
  }, [])

  useEffect(() => {
    let active = true

    void getHealth()
      .then((response) => {
        if (active) {
          setHealth({ state: "ready", data: response, message: null })
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setHealth({
            state: "error",
            data: null,
            message:
              error instanceof Error
                ? error.message
                : "The API health check could not be completed.",
          })
        }
      })

    return () => {
      active = false
    }
  }, [])

  const copy = async (key: string, value: string) => {
    try {
      await writeToClipboard(value)
      setCopyState({ key, status: "copied" })
    } catch {
      setCopyState({ key, status: "failed" })
    }

    window.setTimeout(() => {
      setCopyState((current) => (current?.key === key ? null : current))
    }, 1_800)
  }

  const healthIsOk =
    health.state === "ready" && health.data.status.toLowerCase() === "ok"

  return (
    <section
      id="api"
      aria-labelledby="api-heading"
      className="scroll-mt-20 border-t border-white/8 bg-black py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#53E3AC]">
              <span className="flex size-8 items-center justify-center rounded-lg border border-[#53E3AC]/25 bg-[#53E3AC]/8">
                <Server className="size-4" aria-hidden="true" />
              </span>
              API &amp; deployment
            </div>
            <h2
              id="api-heading"
              className="font-serif text-4xl font-normal leading-none tracking-[-0.025em] text-[#F7F8F8] sm:text-5xl"
            >
              Built for real predictions.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#A1A1AA] sm:text-base">
              A FastAPI service validates the eight census-area features and
              returns the CatBoost model&apos;s estimated median housing value.
            </p>
          </div>

          <div
            className="flex flex-wrap items-center gap-2"
            aria-live="polite"
            aria-label="Backend health status"
          >
            <Badge
              variant="outline"
              className={
                health.state === "checking"
                  ? "h-7 border-white/12 bg-white/[0.03] px-2.5 text-[#A1A1AA]"
                  : healthIsOk
                    ? "h-7 border-[#53E3AC]/30 bg-[#53E3AC]/10 px-2.5 text-[#82f1c5]"
                    : "h-7 border-rose-400/25 bg-rose-400/8 px-2.5 text-rose-300"
              }
            >
              {health.state === "checking" ? (
                <RefreshCw className="animate-spin" aria-hidden="true" />
              ) : healthIsOk ? (
                <span className="size-1.5 rounded-full bg-[#53E3AC] shadow-[0_0_9px_#53E3AC]" />
              ) : (
                <WifiOff aria-hidden="true" />
              )}
              {health.state === "checking"
                ? "Checking API"
                : healthIsOk
                  ? "Health: OK"
                  : health.state === "ready"
                    ? `Health: ${health.data.status}`
                    : "API unavailable"}
            </Badge>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => void checkHealth()}
              disabled={health.state === "checking"}
              aria-label="Refresh backend health status"
              title="Refresh health status"
              className="border-white/12 bg-white/[0.03] text-[#F7F8F8] hover:bg-white/[0.07]"
            >
              <RefreshCw
                className={health.state === "checking" ? "animate-spin" : ""}
                aria-hidden="true"
              />
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="grid gap-4">
            <Card className="border border-[#2C3436] bg-[#121719]/90 shadow-[0_24px_70px_rgba(0,0,0,0.22)] ring-0">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 font-serif text-xl font-normal text-[#F7F8F8]">
                      <Zap className="size-4 text-[#53E3AC]" aria-hidden="true" />
                      FastAPI backend
                    </CardTitle>
                    <CardDescription className="mt-1.5 leading-5 text-[#A1A1AA]">
                      Typed validation, CatBoost inference, and machine-readable
                      OpenAPI documentation.
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-[#53E3AC]/20 bg-[#53E3AC]/8 text-[#82f1c5]"
                  >
                    v1.0.0
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3 pt-1">
                <EndpointRow
                  method="POST"
                  path="/predict"
                  description="Return a median-value estimate in USD."
                  copyState={copyState}
                  onCopy={copy}
                />
                <EndpointRow
                  method="GET"
                  path="/health"
                  description="Report API and loaded-model status."
                  copyState={copyState}
                  onCopy={copy}
                />
              </CardContent>
            </Card>

            <Card className="border border-[#2C3436] bg-[#121719]/90 ring-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 font-serif text-xl font-normal text-[#F7F8F8]">
                  <Activity className="size-4 text-[#53E3AC]" aria-hidden="true" />
                  Runtime status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-1">
                <div className="rounded-lg border border-white/8 bg-black/15 p-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#71717A]">
                    API base URL
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <code className="min-w-0 truncate text-xs text-[#D4D4D8] sm:text-sm">
                      {API_BASE_URL}
                    </code>
                    <CopyButton
                      copyKey="base-url"
                      value={API_BASE_URL}
                      label="Copy API base URL"
                      copyState={copyState}
                      onCopy={copy}
                    />
                  </div>
                </div>

                {health.state === "ready" ? (
                  <div className="grid grid-cols-2 gap-3">
                    <StatusDatum label="Service" value={health.data.status} />
                    <StatusDatum label="Loaded model" value={health.data.model} />
                  </div>
                ) : health.state === "error" ? (
                  <p className="rounded-lg border border-rose-400/15 bg-rose-400/[0.04] p-3 text-xs leading-5 text-rose-200/80">
                    {health.message}
                  </p>
                ) : (
                  <p className="text-xs text-[#A1A1AA]">
                    Contacting the configured backend…
                  </p>
                )}

                <a
                  href={`${API_BASE_URL}/docs`}
                  target="_blank"
                  rel="noreferrer"
                  className="button-glow inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-[#53E3AC]/25 bg-[#53E3AC]/8 px-3 text-sm font-medium text-[#82f1c5] transition-colors hover:bg-[#53E3AC]/13 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53E3AC]/50"
                >
                  Open Swagger documentation
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              </CardContent>
            </Card>
          </div>

          <Card className="min-w-0 border border-[#2C3436] bg-[#0e1314] shadow-[0_30px_90px_rgba(0,0,0,0.28)] ring-0">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 font-serif text-xl font-normal text-[#F7F8F8]">
                    <Clipboard className="size-4 text-[#53E3AC]" aria-hidden="true" />
                    Prediction request
                  </CardTitle>
                  <CardDescription className="mt-1.5 text-[#A1A1AA]">
                    JSON body · all eight fields are required numeric values
                  </CardDescription>
                </div>
                <CopyButton
                  copyKey="request-json"
                  value={exampleRequest}
                  label="Copy example JSON request"
                  copyState={copyState}
                  onCopy={copy}
                  withText
                />
              </div>
            </CardHeader>
            <CardContent className="pt-1">
              <div className="overflow-hidden rounded-xl border border-white/8 bg-[#080B0D]">
                <div className="flex items-center justify-between border-b border-white/7 px-4 py-2.5">
                  <div className="flex gap-1.5" aria-hidden="true">
                    <span className="size-2 rounded-full bg-white/12" />
                    <span className="size-2 rounded-full bg-white/12" />
                    <span className="size-2 rounded-full bg-[#53E3AC]/55" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#71717A]">
                    application/json
                  </span>
                </div>
                <pre className="overflow-x-auto p-4 text-[12px] leading-6 text-[#D4D4D8] sm:p-5 sm:text-[13px]">
                  <code>{exampleRequest}</code>
                </pre>
              </div>
              <div className="mt-4 flex items-start gap-3 rounded-lg border border-white/7 bg-white/[0.025] p-3.5 text-xs leading-5 text-[#A1A1AA]">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#53E3AC]/10 text-[#53E3AC]">
                  <Check className="size-3" aria-hidden="true" />
                </span>
                The response field <code className="text-[#D4D4D8]">predicted_median_value_usd</code>{" "}
                represents a historical census area&apos;s estimated median value,
                not an individual property&apos;s present-day sale price.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

type EndpointRowProps = {
  method: "GET" | "POST"
  path: string
  description: string
  copyState: CopyState
  onCopy: (key: string, value: string) => Promise<void>
}

function EndpointRow({
  method,
  path,
  description,
  copyState,
  onCopy,
}: EndpointRowProps) {
  const copyKey = `endpoint-${path}`
  const value = `${API_BASE_URL}${path}`

  return (
    <div className="group flex items-center gap-3 rounded-lg border border-white/8 bg-black/15 p-3 transition-colors hover:border-white/13">
      <Badge
        variant="outline"
        className={
          method === "POST"
            ? "w-12 border-[#53E3AC]/25 bg-[#53E3AC]/8 text-[#82f1c5]"
            : "w-12 border-sky-400/20 bg-sky-400/8 text-sky-300"
        }
      >
        {method}
      </Badge>
      <div className="min-w-0 flex-1">
        <code className="text-sm font-medium text-[#F7F8F8]">{path}</code>
        <p className="mt-0.5 truncate text-xs text-[#71717A]">{description}</p>
      </div>
      <CopyButton
        copyKey={copyKey}
        value={value}
        label={`Copy ${path} URL`}
        copyState={copyState}
        onCopy={onCopy}
      />
    </div>
  )
}

type CopyButtonProps = {
  copyKey: string
  value: string
  label: string
  copyState: CopyState
  onCopy: (key: string, value: string) => Promise<void>
  withText?: boolean
}

function CopyButton({
  copyKey,
  value,
  label,
  copyState,
  onCopy,
  withText = false,
}: CopyButtonProps) {
  const state = copyState?.key === copyKey ? copyState.status : null

  return (
    <Button
      type="button"
      variant="ghost"
      size={withText ? "sm" : "icon-sm"}
      onClick={() => void onCopy(copyKey, value)}
      aria-label={label}
      title={label}
      className="shrink-0 text-[#A1A1AA] hover:bg-white/[0.06] hover:text-[#F7F8F8]"
    >
      {state === "copied" ? (
        <Check className="text-[#53E3AC]" aria-hidden="true" />
      ) : (
        <Copy className={state === "failed" ? "text-rose-300" : ""} aria-hidden="true" />
      )}
      {withText && (
        <span>{state === "copied" ? "Copied" : state === "failed" ? "Failed" : "Copy"}</span>
      )}
    </Button>
  )
}

function StatusDatum({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg border border-white/7 bg-white/[0.025] p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#71717A]">
        {label}
      </p>
      <p className="mt-1.5 truncate text-sm font-medium capitalize text-[#F7F8F8]" title={value}>
        {value}
      </p>
    </div>
  )
}
