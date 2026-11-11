import { lazy, Suspense, useState } from "react"

import HeroSection from "@/components/HeroSection"
import Navbar from "@/components/Navbar"
import type { PredictionState } from "@/components/PredictionCard"
import { predictHousing } from "@/lib/api"
import {
  DEFAULT_FEATURES,
  type HousingFeature,
  type HousingInput,
} from "@/lib/housing"

const ModelInsights = lazy(() => import("@/components/ModelInsights"))

function SectionFallback({ label }: { label: string }) {
  return (
    <div
      className="mx-auto flex min-h-64 max-w-[1560px] items-center justify-center px-6 text-xs uppercase tracking-[0.18em] text-zinc-600"
      role="status"
    >
      Loading {label}…
    </div>
  )
}

function App() {
  const [features, setFeatures] = useState<HousingInput>(DEFAULT_FEATURES)
  const [prediction, setPrediction] = useState<PredictionState>({
    status: "idle",
  })

  const updateFeature = (feature: HousingFeature, value: number) => {
    setFeatures((current) => ({ ...current, [feature]: value }))
  }

  const requestPrediction = async () => {
    const hasInvalidValue = Object.values(features).some(
      (value) => !Number.isFinite(value),
    )

    if (hasInvalidValue) {
      setPrediction({
        status: "error",
        message: "Complete every field with a valid numeric value.",
      })
      return
    }

    setPrediction({ status: "loading" })

    try {
      const response = await predictHousing(features)
      setPrediction({
        status: "success",
        value: response.predicted_median_value_usd,
        model: response.model,
      })
    } catch (error) {
      setPrediction({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "The prediction request could not be completed.",
      })
    }
  }

  return (
    <div className="site-shell min-h-screen bg-black text-[#f7f8f8]">
      <a
        href="#predict"
        className="fixed left-3 top-3 z-[100] -translate-y-20 rounded-md bg-[#53e3ac] px-4 py-2 text-sm font-semibold text-[#080b0d] transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>

      <Navbar />

      <main>
        <HeroSection
          values={features}
          prediction={prediction}
          onValueChange={updateFeature}
          onPredict={() => void requestPrediction()}
        />
        <Suspense fallback={<SectionFallback label="model insights" />}>
          <ModelInsights />
        </Suspense>
      </main>

      <footer className="border-t border-white/8 bg-black px-4 py-7 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1560px] flex-col gap-3 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="font-medium text-zinc-300">PropValue AI</span> · California Housing ML project
          </p>
          <p>1990 census-area context · Not an individual property appraisal</p>
        </div>
      </footer>
    </div>
  )
}

export default App
