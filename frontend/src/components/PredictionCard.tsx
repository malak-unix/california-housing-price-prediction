import { AlertCircle, Home } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type PredictionState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; value: number; model: string }
  | { status: "error"; message: string }

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

export default function PredictionCard({ state }: { state: PredictionState }) {
  return (
    <Card className="liquid-glass-panel prediction-surface relative min-h-[390px] self-center gap-0 overflow-hidden py-0 ring-0 md:h-[440px] xl:h-[460px]">
      <CardHeader className="relative z-10 flex flex-row items-center px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg border border-white/14 bg-white/[0.07] text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <Home className="size-4" aria-hidden="true" />
          </span>
          <CardTitle className="font-serif text-xl font-normal tracking-[-0.015em] text-zinc-100">
            Prediction Result
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 flex flex-1 flex-col px-5 py-5">
        <p className="font-serif text-xl font-normal tracking-[-0.02em] text-zinc-100">
          Estimated Housing Value
        </p>
        <p className="mt-1 text-xs leading-relaxed text-zinc-400">
          Historical census-area median, in USD
        </p>

        <div className="flex min-h-28 flex-1 flex-col justify-center py-5">
          {state.status === "success" ? (
            <>
              <p
                className="font-serif text-[clamp(3.1rem,5vw,5.4rem)] leading-[0.9] tracking-[-0.045em] text-[#f7f8f8]"
                aria-live="polite"
              >
                {currencyFormatter.format(state.value)}
              </p>
              <p className="mt-5 flex items-center gap-2 text-xs text-[#72edbd]">
                <span className="size-1.5 rounded-full bg-[#53e3ac] shadow-[0_0_12px_#53e3ac]" />
                Returned by {state.model}
              </p>
            </>
          ) : state.status === "loading" ? (
            <div className="space-y-4" aria-live="polite" aria-busy="true">
              <div className="h-14 w-4/5 animate-pulse rounded-md bg-white/8" />
              <div className="h-3 w-2/5 animate-pulse rounded bg-white/6" />
              <span className="sr-only">Calculating prediction</span>
            </div>
          ) : state.status === "error" ? (
            <div className="rounded-xl border border-red-400/15 bg-red-400/[0.045] p-4" aria-live="assertive">
              <AlertCircle className="size-5 text-red-300" aria-hidden="true" />
              <p className="mt-3 text-sm font-medium text-red-100">Prediction failed</p>
              <p className="mt-1.5 text-xs leading-relaxed text-red-200/65">
                {state.message}
              </p>
            </div>
          ) : (
            <div aria-live="polite">
              <p className="font-serif text-7xl leading-none text-zinc-600">—</p>
              <p className="mt-4 max-w-60 text-xs leading-relaxed text-zinc-300">
                Submit the eight census-area features to request a genuine model estimate.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
