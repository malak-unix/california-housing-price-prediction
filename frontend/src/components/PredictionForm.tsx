import { Info, LoaderCircle, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  FEATURE_DEFINITIONS,
  type HousingFeature,
  type HousingInput,
} from "@/lib/housing"

type PredictionFormProps = {
  values: HousingInput
  loading: boolean
  onValueChange: (feature: HousingFeature, value: number) => void
  onSubmit: () => void
}

export default function PredictionForm({
  values,
  loading,
  onValueChange,
  onSubmit,
}: PredictionFormProps) {
  return (
    <Card
      id="property-features"
      className="liquid-glass-panel self-center gap-0 overflow-hidden py-0 ring-0 md:h-[440px] xl:h-[460px]"
    >
      <CardHeader className="px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg border border-white/14 bg-white/[0.07] text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <SlidersHorizontal className="size-4" aria-hidden="true" />
          </span>
          <CardTitle className="font-serif text-xl font-normal tracking-[-0.015em] text-zinc-100">
            Property Features
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 px-4 py-4">
        <form
          className="flex w-full flex-col"
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit()
          }}
        >
          <div className="grid grid-cols-1 gap-x-3 gap-y-2.5 sm:grid-cols-2">
            {FEATURE_DEFINITIONS.map((feature) => {
              const value = values[feature.key]
              const inputId = `feature-${feature.key}`

              return (
                <div key={feature.key} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor={inputId} className="text-[11px] text-zinc-300">
                      {feature.label}
                    </Label>
                    <Tooltip>
                      <TooltipTrigger
                        className="button-glow rounded-sm text-zinc-600 transition-colors hover:text-[#72edbd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53e3ac]"
                        aria-label={`About ${feature.label}`}
                      >
                        <Info className="size-3.5" aria-hidden="true" />
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="max-w-64 border border-white/10 bg-[#171d1f] text-zinc-200 shadow-2xl"
                      >
                        {feature.description}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="relative">
                    <Input
                      id={inputId}
                      name={feature.key}
                      type="number"
                      inputMode="decimal"
                      required
                      min={feature.min}
                      max={feature.max}
                      step="any"
                      value={Number.isFinite(value) ? value : ""}
                      onChange={(event) => {
                        const nextValue = event.target.value
                        onValueChange(
                          feature.key,
                          nextValue === "" ? Number.NaN : Number(nextValue),
                        )
                      }}
                      aria-describedby={`${inputId}-unit`}
                      className="h-9 border-white/14 bg-white/[0.035] pr-12 text-sm tabular-nums text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)] backdrop-blur-md placeholder:text-zinc-600 focus-visible:border-[#53e3ac]/55 focus-visible:ring-[#53e3ac]/12 dark:bg-white/[0.035]"
                    />
                    <span
                      id={`${inputId}-unit`}
                      className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-[9px] uppercase tracking-wide text-zinc-600"
                    >
                      {feature.unit}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="liquid-light-action mt-4 h-10 w-full text-[#080b0d]"
          >
            {loading ? (
              <LoaderCircle className="animate-spin" aria-hidden="true" />
            ) : null}
            {loading ? "Estimating value…" : "Estimate Value"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
