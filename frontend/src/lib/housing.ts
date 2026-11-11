export type HousingInput = {
  MedInc: number
  HouseAge: number
  AveRooms: number
  AveBedrms: number
  Population: number
  AveOccup: number
  Latitude: number
  Longitude: number
}

export type HousingFeature = keyof HousingInput

export type FeatureDefinition = {
  key: HousingFeature
  label: string
  description: string
  shortDescription: string
  step: number
  min?: number
  max?: number
  unit: string
}

export const DEFAULT_FEATURES: HousingInput = {
  MedInc: 3.5,
  HouseAge: 25,
  AveRooms: 5.3,
  AveBedrms: 1.1,
  Population: 1250,
  AveOccup: 3,
  Latitude: 34.05,
  Longitude: -118.25,
}

export const FEATURE_DEFINITIONS: FeatureDefinition[] = [
  {
    key: "MedInc",
    label: "MedInc",
    description:
      "Median household income for the census block group, expressed in tens of thousands of US dollars.",
    shortDescription: "Median income in the block group",
    step: 0.1,
    min: 0,
    unit: "$10k",
  },
  {
    key: "HouseAge",
    label: "HouseAge",
    description: "Median age of homes in the census block group, in years.",
    shortDescription: "Median home age",
    step: 1,
    min: 0,
    unit: "years",
  },
  {
    key: "AveRooms",
    label: "AveRooms",
    description: "Average number of rooms per household in the census block group.",
    shortDescription: "Average rooms per household",
    step: 0.1,
    min: 0.01,
    unit: "rooms",
  },
  {
    key: "AveBedrms",
    label: "AveBedrms",
    description: "Average number of bedrooms per household in the census block group.",
    shortDescription: "Average bedrooms per household",
    step: 0.1,
    min: 0.01,
    unit: "bedrooms",
  },
  {
    key: "Population",
    label: "Population",
    description: "Population recorded for the census block group.",
    shortDescription: "Block-group population",
    step: 1,
    min: 0.01,
    unit: "people",
  },
  {
    key: "AveOccup",
    label: "AveOccup",
    description: "Average number of household members in the census block group.",
    shortDescription: "Average household occupancy",
    step: 0.1,
    min: 0.01,
    unit: "people",
  },
  {
    key: "Latitude",
    label: "Latitude",
    description:
      "Latitude of the historical census block group; it is not a verified individual property location.",
    shortDescription: "Block-group latitude",
    step: 0.0001,
    min: -90,
    max: 90,
    unit: "degrees",
  },
  {
    key: "Longitude",
    label: "Longitude",
    description:
      "Longitude of the historical census block group; it is not a verified individual property location.",
    shortDescription: "Block-group longitude",
    step: 0.0001,
    min: -180,
    max: 180,
    unit: "degrees",
  },
]

export function hasValidCoordinates(values: HousingInput) {
  return (
    Number.isFinite(values.Latitude) &&
    Number.isFinite(values.Longitude) &&
    values.Latitude >= -90 &&
    values.Latitude <= 90 &&
    values.Longitude >= -180 &&
    values.Longitude <= 180
  )
}

export function isWithinTrainingExtent(values: HousingInput) {
  return (
    hasValidCoordinates(values) &&
    values.Latitude >= 32.55 &&
    values.Latitude <= 41.95 &&
    values.Longitude >= -124.35 &&
    values.Longitude <= -114.31
  )
}
