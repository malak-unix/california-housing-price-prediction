import { ArrowDownRight, BarChart3 } from "lucide-react"

import PredictionCard, {
  type PredictionState,
} from "@/components/PredictionCard"
import PredictionForm from "@/components/PredictionForm"
import { buttonVariants } from "@/components/ui/button"
import type { HousingFeature, HousingInput } from "@/lib/housing"
import { cn } from "@/lib/utils"

type HeroSectionProps = {
  values: HousingInput
  prediction: PredictionState
  onValueChange: (feature: HousingFeature, value: number) => void
  onPredict: () => void
}

export default function HeroSection({
  values,
  prediction,
  onValueChange,
  onPredict,
}: HeroSectionProps) {
  const loading = prediction.status === "loading"

  return (
    <section id="predict" className="relative bg-black">
      <div className="hero-stage relative min-h-[600px] w-full overflow-hidden xl:min-h-[650px]">
        <img
          src="/images/modern-villa-hero.jpg"
          alt="Contemporary villa with broad glass walls illuminated at dusk"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="hero-stage-overlay absolute inset-0" />

        <div className="relative z-10 mx-auto grid min-h-[600px] w-full max-w-[1800px] gap-4 p-4 pt-24 sm:p-5 sm:pt-24 md:grid-cols-2 lg:p-6 lg:pt-24 xl:min-h-[650px] xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,0.8fr)] 2xl:grid-cols-[minmax(0,1.5fr)_minmax(0,0.78fr)_minmax(0,0.78fr)]">
          <article className="relative flex min-h-[470px] flex-col justify-center px-3 py-10 sm:px-6 md:col-span-2 xl:col-span-1 xl:min-h-[600px] xl:px-7 xl:py-8">
            <div className="max-w-[760px]">
              <h1 className="max-w-[760px] font-serif text-[clamp(3.55rem,6.4vw,7.25rem)] font-normal leading-[0.82] tracking-[-0.045em] text-[#f7f8f8] xl:text-[clamp(4.5rem,4.7vw,6.6rem)]">
                California Housing
                <span className="block italic text-[#e8f7f1]">
                  Price Prediction
                </span>
              </h1>
              <p className="mt-7 max-w-2xl font-sans text-sm leading-6 text-zinc-100 sm:text-base sm:leading-7">
                Estimate a historical California census area&apos;s median housing
                value with the project&apos;s final CatBoost model, not the current
                sale price of an individual home.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#property-features"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "liquid-light-action h-12 justify-center px-5 text-[#080b0d]",
                  )}
                >
                  Estimate Value
                  <ArrowDownRight aria-hidden="true" />
                </a>
                <a
                  href="#model-insights"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "liquid-glass-action h-12 justify-center px-5 text-white",
                  )}
                >
                  <BarChart3 aria-hidden="true" />
                  View Model Insights
                </a>
              </div>
            </div>
          </article>

          <PredictionCard state={prediction} />
          <PredictionForm
            values={values}
            loading={loading}
            onValueChange={onValueChange}
            onSubmit={onPredict}
          />
        </div>
      </div>
    </section>
  )
}
