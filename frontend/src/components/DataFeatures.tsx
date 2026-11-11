import { lazy, Suspense } from "react"
import {
  Database,
  Layers3,
  MapPinned,
  ScanSearch,
  Target,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  FEATURE_DEFINITIONS,
  isWithinTrainingExtent,
  type HousingInput,
} from "@/lib/housing"

const CaliforniaMap = lazy(() =>
  import("@/components/CaliforniaMap").then((module) => ({
    default: module.CaliforniaMap,
  })),
)

type DataFeaturesProps = {
  values: HousingInput
  onCoordinatesChange: (latitude: number, longitude: number) => void
}

const DATASET_FACTS = [
  {
    label: "Observations",
    value: "20,640",
    detail: "census block groups",
    icon: Database,
  },
  {
    label: "Model inputs",
    value: "8",
    detail: "numeric features",
    icon: Layers3,
  },
  {
    label: "Reference year",
    value: "1990",
    detail: "U.S. Census data",
    icon: MapPinned,
  },
  {
    label: "Prediction target",
    value: "Median",
    detail: "area housing value",
    icon: Target,
  },
] as const

export function DataFeatures({
  values,
  onCoordinatesChange,
}: DataFeaturesProps) {
  const isInsideExtent = isWithinTrainingExtent(values)

  return (
    <section
      id="data-features"
      className="scroll-mt-24 border-t border-white/[0.06] bg-black py-20 sm:py-24"
      aria-labelledby="data-features-title"
    >
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <div className="mb-3 flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#53e3ac]">
              <span className="h-px w-8 bg-[#53e3ac]/70" />
              Data &amp; features
            </div>
            <h2
              id="data-features-title"
              className="text-balance font-serif text-4xl font-normal leading-none tracking-[-0.025em] text-[#f7f8f8] sm:text-5xl"
            >
              A geographic model of historical census areas
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
              Each observation describes a California census block group—not an
              individual home. The model learns from demographic and housing
              aggregates recorded for the 1990 census.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/[0.025] px-3 py-2 text-xs text-white/55 md:self-auto">
            <ScanSearch aria-hidden="true" className="size-3.5 text-[#53e3ac]" />
            Location inputs are approximate area coordinates
          </div>
        </div>

        <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {DATASET_FACTS.map((fact) => {
            const Icon = fact.icon

            return (
              <Card
                key={fact.label}
                className="gap-0 rounded-[0.9rem] border border-white/[0.08] bg-[#101517] py-0 ring-0"
              >
                <CardContent className="flex items-center gap-4 p-4 sm:p-5">
                  <div className="grid size-10 shrink-0 place-items-center rounded-lg border border-[#53e3ac]/20 bg-[#53e3ac]/[0.06] text-[#53e3ac]">
                    <Icon aria-hidden="true" className="size-[1.05rem]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-white/38">
                      {fact.label}
                    </p>
                    <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
                      <span className="text-xl font-medium tracking-tight text-white">
                        {fact.value}
                      </span>
                      <span className="text-xs text-white/43">{fact.detail}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.38fr)_minmax(23rem,0.62fr)]">
          <Card className="gap-0 rounded-[1rem] border border-white/[0.09] bg-[#101517] py-0 ring-0">
            <CardHeader className="p-5 sm:p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <CardTitle className="flex items-center gap-2.5 font-serif text-xl font-normal text-white">
                    <MapPinned aria-hidden="true" className="size-4 text-[#53e3ac]" />
                    California location context
                  </CardTitle>
                  <CardDescription className="mt-1.5 max-w-2xl text-xs leading-relaxed text-white/45">
                    Select an approximate census-area coordinate. This marker is
                    not a verified street address or individual property location.
                  </CardDescription>
                </div>
                <div
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] ${
                    isInsideExtent
                      ? "border-[#53e3ac]/25 bg-[#53e3ac]/[0.07] text-[#7af0c0]"
                      : "border-amber-300/20 bg-amber-300/[0.06] text-amber-200"
                  }`}
                  aria-live="polite"
                >
                  {isInsideExtent
                    ? "Within training extent"
                    : "Outside training extent"}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4">
              <Suspense
                fallback={
                  <div
                    className="grid min-h-[25rem] place-items-center rounded-[0.9rem] border border-white/[0.08] bg-[#090d0f] text-xs uppercase tracking-[0.16em] text-white/35"
                    role="status"
                  >
                    Loading map…
                  </div>
                }
              >
                <CaliforniaMap
                  latitude={values.Latitude}
                  longitude={values.Longitude}
                  onCoordinatesChange={onCoordinatesChange}
                />
              </Suspense>
              <div className="mt-3 flex flex-col justify-between gap-2 px-1 text-[0.68rem] text-white/40 sm:flex-row sm:items-center">
                <span>
                  Selected input: {values.Latitude.toFixed(4)}°, {values.Longitude.toFixed(4)}°
                </span>
                <span>Basemap © OpenFreeMap · © OpenStreetMap contributors</span>
              </div>
            </CardContent>
          </Card>

          <Card className="gap-0 rounded-[1rem] border border-white/[0.09] bg-[#101517] py-0 ring-0">
            <CardHeader className="p-5 sm:p-6">
              <CardTitle className="flex items-center gap-2.5 font-serif text-xl font-normal text-white">
                <Layers3 aria-hidden="true" className="size-4 text-[#53e3ac]" />
                Feature dictionary
              </CardTitle>
              <CardDescription className="mt-1.5 text-xs leading-relaxed text-white/45">
                The exact eight numeric inputs consumed by the trained model.
              </CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-white/[0.065] px-5 py-0 sm:px-6">
              {FEATURE_DEFINITIONS.map((feature, index) => (
                <div
                  key={feature.key}
                  className="grid grid-cols-[1.75rem_minmax(0,1fr)_auto] gap-3 py-3.5"
                >
                  <span className="pt-0.5 font-mono text-[0.62rem] text-white/25">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white/88">
                      {feature.label}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-white/42">
                      {feature.shortDescription}
                    </p>
                  </div>
                  <span className="mt-0.5 rounded-md border border-white/[0.08] bg-white/[0.025] px-2 py-1 text-[0.62rem] text-white/42">
                    {feature.unit}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="mt-5 rounded-[0.9rem] border border-[#53e3ac]/15 bg-[#53e3ac]/[0.035] px-5 py-4 text-xs leading-6 text-white/50 sm:px-6">
          <span className="font-medium text-white/80">Interpretation boundary.</span>{" "}
          The returned value estimates the historical median housing value for
          an area represented by these aggregate inputs. It is not a current
          appraisal, listing estimate, or sale-price forecast for a specific
          luxury property.
        </div>
      </div>
    </section>
  )
}

