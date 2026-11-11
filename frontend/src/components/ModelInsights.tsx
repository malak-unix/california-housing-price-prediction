import {
  Activity,
  ArrowDownRight,
  BrainCircuit,
  Gauge,
  GitBranch,
  Layers3,
  ShieldCheck,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const testMetrics = [
  {
    label: "Mean absolute error",
    shortLabel: "MAE",
    value: "$28,644.52",
    detail: "Average absolute error",
    icon: Activity,
  },
  {
    label: "Root mean squared error",
    shortLabel: "RMSE",
    value: "$43,615.67",
    detail: "Penalizes larger errors",
    icon: Gauge,
  },
  {
    label: "Coefficient of determination",
    shortLabel: "R²",
    value: "0.8548",
    detail: "Variance explained on test data",
    icon: BrainCircuit,
  },
] as const

const validationResults = [
  { model: "CatBoost", mae: 28470.7038, selected: true },
  { model: "LightGBM", mae: 29292.5908, selected: false },
  { model: "HistGradientBoosting", mae: 29452.3098, selected: false },
  { model: "XGBoost", mae: 29631.9583, selected: false },
] as const

const chartConfig = {
  mae: {
    label: "Validation MAE",
    color: "#53E3AC",
  },
} satisfies ChartConfig

const modelConcepts = [
  {
    title: "Gradient boosting",
    description: "Each new tree corrects errors left by the previous ensemble.",
    icon: Layers3,
  },
  {
    title: "Symmetric trees",
    description: "Every level shares one split rule for consistent, fast inference.",
    icon: GitBranch,
  },
  {
    title: "Regularized regression",
    description: "RMSE learning with an L2 leaf penalty limits excessive fitting.",
    icon: ShieldCheck,
  },
] as const

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
})

function ModelInsights() {
  return (
    <section
      id="model-insights"
      className="scroll-mt-20 border-t border-white/[0.07] bg-black py-20 sm:py-24 lg:py-28"
      aria-labelledby="model-insights-title"
    >
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2
            id="model-insights-title"
            className="font-serif text-4xl font-normal leading-none tracking-[-0.025em] text-white sm:text-5xl lg:text-[3.25rem]"
          >
            Model Insights
          </h2>
        </div>

        <Card className="mb-4 gap-0 py-0 ring-0">
          <CardContent className="grid gap-7 px-5 py-6 sm:px-6 sm:py-7 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-center">
            <div className="max-w-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#53E3AC]">
                Selected model
              </p>
              <h3 className="mt-2 font-serif text-3xl font-normal tracking-[-0.025em] text-white sm:text-4xl">
                CatBoost Regressor
              </h3>
              <p className="mt-3 max-w-lg text-sm leading-6 text-[#A1A1AA]">
                A gradient-boosted decision-tree ensemble trained to estimate a
                census area's median housing value from eight numeric features.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-400">
                <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5">
                  800 trees
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5">
                  Depth 8
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5">
                  Learning rate 0.0964
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {modelConcepts.map((concept) => {
                const Icon = concept.icon

                return (
                  <div
                    key={concept.title}
                    className="rounded-xl border border-white/[0.08] bg-black/20 p-4 sm:min-h-36"
                  >
                    <span className="grid size-8 place-items-center rounded-lg border border-[#53E3AC]/20 bg-[#53E3AC]/[0.055] text-[#53E3AC]">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <h4 className="mt-4 font-serif text-lg font-normal text-white">
                      {concept.title}
                    </h4>
                    <p className="mt-1.5 text-xs leading-5 text-zinc-400">
                      {concept.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div
          className="grid gap-4 md:grid-cols-3"
          aria-label="Final held-out test metrics"
        >
          {testMetrics.map((metric) => {
            const Icon = metric.icon

            return (
              <Card
                key={metric.shortLabel}
                className="gap-0 py-0 ring-0"
                aria-label={`Final test ${metric.shortLabel}`}
              >
                <CardHeader className="px-5 py-4 sm:px-6">
                  <CardTitle className="flex items-center gap-2 text-xl text-white">
                    <Icon className="size-3.5 text-[#53E3AC]" aria-hidden="true" />
                    {metric.shortLabel}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 py-5 sm:px-6 sm:py-6">
                  <p className="font-serif text-[2rem] leading-none tracking-[-0.035em] text-[#F7F8F8] sm:text-[2.35rem]">
                    {metric.value}
                  </p>
                  <p className="mt-3 text-sm text-[#F7F8F8]">{metric.label}</p>
                  <p className="mt-1 text-xs text-[#777E81]">{metric.detail}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="mt-4 gap-0 py-0 ring-0">
          <CardHeader className="px-5 py-5 sm:px-6">
            <CardTitle className="text-xl text-[#F7F8F8] sm:text-2xl">
              Optimized model comparison
            </CardTitle>
            <CardDescription className="text-xs leading-5 text-[#8B9295] sm:text-sm">
              Validation MAE in USD · lower is better
            </CardDescription>
            <CardAction>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#53E3AC]/20 bg-white/[0.035] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7CF0C3]">
                <ArrowDownRight className="size-3" aria-hidden="true" />
                Lower error
              </span>
            </CardAction>
          </CardHeader>

          <CardContent className="px-2 py-5 sm:px-5 sm:py-6">
            <ChartContainer
              config={chartConfig}
              className="h-[300px] w-full sm:h-[330px]"
              role="img"
              aria-label="Bar chart comparing optimized validation mean absolute error for CatBoost, LightGBM, HistGradientBoosting, and XGBoost. CatBoost has the lowest error."
            >
              <BarChart
                accessibilityLayer
                data={validationResults}
                layout="vertical"
                margin={{ top: 4, right: 72, bottom: 8, left: 8 }}
              >
                <CartesianGrid
                  horizontal={false}
                  stroke="rgba(255,255,255,0.07)"
                />
                <XAxis
                  type="number"
                  domain={[0, 32000]}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tickFormatter={(value: number) => `$${value / 1000}k`}
                />
                <YAxis
                  dataKey="model"
                  type="category"
                  width={128}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tick={{ fill: "#D9DDDE", fontSize: 12 }}
                />
                <ChartTooltip
                  cursor={{ fill: "rgba(255,255,255,0.025)" }}
                  content={
                    <ChartTooltipContent
                      hideLabel
                      formatter={(value) => (
                        <div className="flex min-w-40 items-center justify-between gap-5">
                          <span className="text-[#8B9295]">Validation MAE</span>
                          <span className="font-mono font-medium tabular-nums text-[#F7F8F8]">
                            {moneyFormatter.format(Number(value))}
                          </span>
                        </div>
                      )}
                    />
                  }
                />
                <Bar dataKey="mae" radius={[0, 5, 5, 0]} barSize={26}>
                  {validationResults.map((entry) => (
                    <Cell
                      key={entry.model}
                      fill={entry.selected ? "#53E3AC" : "#30383A"}
                      fillOpacity={entry.selected ? 0.92 : 0.9}
                    />
                  ))}
                  <LabelList
                    dataKey="mae"
                    position="right"
                    formatter={(value) =>
                      `$${(Number(value) / 1000).toFixed(1)}k`
                    }
                    fill="#D9DDDE"
                    fontSize={11}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default ModelInsights
