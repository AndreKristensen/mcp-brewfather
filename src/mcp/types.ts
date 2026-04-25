// Raw API response types for the Brewfather v2 API

export type BatchStatus =
  | "Planning"
  | "Brewing"
  | "Fermenting"
  | "Conditioning"
  | "Completed"
  | "Archived";

export type InventoryType = "fermentables" | "hops" | "miscs" | "yeasts";

export interface BatchSummary {
  _id: string;
  name: string | null;
  batchNo: number | null;
  status: BatchStatus;
  brewer: string | null;
  hidden: boolean;
  brewDate: number | null;
  fermentationStartDate: number | null;
  bottlingDate: number | null;
  estimatedOg: number | null;
  estimatedFg: number | null;
  estimatedIbu: number | null;
  estimatedColor: number | null;
  estimatedAbv: number | null;
  measuredOg: number | null;
  measuredFg: number | null;
  measuredAbv: number | null;
  measuredEfficiency: number | null;
  tasteRating: number | null;
  recipe?: RecipeSummary;
}

export interface BatchDetail extends BatchSummary {
  measuredBatchSize: number | null;
  measuredKettleSize: number | null;
  measuredBoilSize: number | null;
  measuredBoilTime: number | null;
  measuredBottlingSize: number | null;
  measuredBottlingTemp: number | null;
  measuredFermenterTopUp: number | null;
  measuredFirstWortGravity: number | null;
  measuredPreBoilGravity: number | null;
  measuredPostBoilGravity: number | null;
  measuredMashPh: number | null;
  measuredAttenuation: number | null;
  measuredKettleEfficiency: number | null;
  measuredMashEfficiency: number | null;
  measuredConversionEfficiency: number | null;
  estimatedBuGuRatio: number | null;
  estimatedRbRatio: number | null;
  estimatedTotalGravity: number | null;
  carbonationTemp: number | null;
  carbonationType: string | null;
  carbonationForce: number | null;
  primingSugarEquiv: number | null;
  batchNotes: string | null;
  tasteNotes: string | null;
  info: string | null;
  batchFermentables: BatchFermentable[];
  batchHops: BatchHop[];
  batchMiscs: BatchMisc[];
  batchYeasts: BatchYeast[];
  notes: BatchNote[];
  measurements: BatchMeasurement[];
  events: BatchEvent[];
  attachmentCount: number;
  recipe?: RecipeDetail;
}

export interface BatchFermentable {
  _id?: string;
  name: string;
  amount: number;
  percentage: number | null;
  color: number;
  type: string;
  use: string | null;
  supplier: string | null;
  origin: string | null;
  inventory?: number | null;
}

export interface BatchHop {
  _id?: string;
  name: string;
  amount: number;
  alpha: number;
  use: string;
  time: number | null;
  timeUnit: string | null;
  type: string;
  ibu: number;
  origin: string | null;
  inventory?: number | null;
}

export interface BatchMisc {
  _id?: string;
  name: string;
  amount: number;
  unit: string;
  type: string;
  use: string;
  time: number;
  timeUnit: string | null;
}

export interface BatchYeast {
  _id?: string;
  name: string;
  amount: number | null;
  unit: string;
  laboratory: string | null;
  productId: string | null;
  type: string;
  form: string;
  attenuation: number | null;
  minTemp: number | null;
  maxTemp: number | null;
  inventory?: number | null;
}

export interface BatchNote {
  _id?: string;
  note: string;
  timestamp: number;
  status: string | null;
}

export interface BatchMeasurement {
  _id?: string;
  sg: number | null;
  ph: number | null;
  temp: number | null;
  pressure: number | null;
  comment: string | null;
  time: number;
  type: string | null;
}

export interface BatchEvent {
  _id?: string;
  date: number;
  message: string;
}

export interface RecipeSummary {
  _id: string;
  name: string;
  author: string | null;
  type: string;
  batchSize: number;
  boilTime: number;
  efficiency: number;
  og: number | null;
  fg: number | null;
  abv: number | null;
  ibu: number | null;
  color: number | null;
  hidden: boolean;
  style?: StyleInfo;
  teaser?: string;
}

export interface RecipeDetail extends RecipeSummary {
  boilSize: number;
  mashEfficiency: number | null;
  fgEstimated: number | null;
  attenuation: number | null;
  preBoilGravity: number | null;
  postBoilGravity: number | null;
  firstWortGravity: number | null;
  ibuFormula: string | null;
  buGuRatio: number | null;
  rbRatio: number | null;
  carbonation: number | null;
  carbonationTemp: number | null;
  primingSugarEquiv: number | null;
  diastaticPower: number | null;
  notes: string | null;
  fermentables: Fermentable[];
  hops: Hop[];
  miscs: Misc[];
  yeasts: Yeast[];
  fermentablesTotalAmount: number | null;
  hopsTotalAmount: number | null;
  equipment: EquipmentProfile | null;
  mash: MashProfile | null;
  fermentation: FermentationProfile | null;
  water: WaterProfile | null;
  tags: Tag[];
  styleConformity: boolean | null;
}

export interface StyleInfo {
  name: string;
  category: string | null;
  styleGuide: string | null;
  ogMin: number | null;
  ogMax: number | null;
  fgMin: number | null;
  fgMax: number | null;
  ibuMin: number | null;
  ibuMax: number | null;
  colorMin: number | null;
  colorMax: number | null;
  abvMin: number | null;
  abvMax: number | null;
}

export interface Fermentable {
  _id?: string;
  name: string;
  type: string;
  grainCategory: string | null;
  amount: number;
  percentage: number;
  color: number;
  lovibond: number;
  use: string | null;
  time: number;
  timeUnit: string | null;
  origin: string;
  supplier: string | null;
  potential: number | null;
  moisture: number | null;
  diastaticPower: number | null;
  protein: number | null;
  attenuation: number | null;
  notFermentable: boolean | null;
  inventory: number | null;
  costPerAmount: number | null;
  notes: string;
  hidden: boolean;
}

export interface Hop {
  _id?: string;
  name: string;
  alpha: number;
  amount: number;
  use: string;
  time: number | null;
  timeUnit: string | null;
  type: string;
  ibu: number;
  beta: number | null;
  hsi: number | null;
  origin: string | null;
  usage: string | null;
  temp: number | null;
  year: number | null;
  oil: number | null;
  myrcene: number | null;
  humulene: number | null;
  caryophyllene: number | null;
  farnesene: number | null;
  geraniol: number | null;
  linalool: number | null;
  aroma?: HopAroma;
  inventory: number | null;
  costPerAmount: number | null;
  notes: string;
  hidden: boolean;
}

export interface HopAroma {
  floral: number | null;
  fruity: number | null;
  citrus: number | null;
  herbal: number | null;
  woody: number | null;
  earthy: number | null;
  spicy: number | null;
  resinous: number | null;
  tropical: number | null;
  stone_fruit: number | null;
}

export interface Yeast {
  _id?: string;
  name: string;
  type: string;
  form: string;
  amount: number | null;
  unit: string;
  laboratory: string | null;
  productId: string | null;
  flocculation: string | null;
  attenuation: number | null;
  minAttenuation: number | null;
  maxAttenuation: number | null;
  minTemp: number | null;
  maxTemp: number | null;
  maxAbv: number | null;
  notes: string | null;
  bestFor: string;
  starter: boolean | null;
  starterSize: number | null;
  inventory: number | null;
  costPerAmount: number | null;
  hidden: boolean;
}

export interface Misc {
  _id?: string;
  name: string;
  type: string;
  use: string;
  time: number;
  timeUnit: string | null;
  amount: number;
  unit: string;
  amountPerL: number | null;
  concentration: number | null;
  waterAdjustment: boolean;
  inventory: number | null;
  costPerAmount: number | null;
  notes: string;
  hidden: boolean;
}

export interface EquipmentProfile {
  name: string;
  batchSize: number;
  boilSize: number;
  boilTime: number;
  efficiency: number;
}

export interface MashProfile {
  name: string;
  steps: MashStep[];
}

export interface MashStep {
  name: string;
  stepTemp: number;
  stepTime: number;
  type: string;
}

export interface FermentationProfile {
  name: string;
  steps: FermentationStep[];
}

export interface FermentationStep {
  name: string;
  stepTemp: number;
  stepTime: number;
  type: string;
  rampTime: number | null;
}

export interface WaterProfile {
  name: string;
  calcium: number | null;
  magnesium: number | null;
  sodium: number | null;
  chloride: number | null;
  sulfate: number | null;
  bicarbonate: number | null;
  ph: number | null;
}

export interface Tag {
  _id?: string;
  name: string;
}

export interface SensorReading {
  time: number;
  sg: number | null;
  temp: number | null;
  comment: string | null;
  type: string;
  pressure: number | null;
  ph: number | null;
  battery: number | null;
  rssi: number | null;
  angle: number | null;
  id: string | null;
}

export interface BrewTrackerStage {
  name: string;
  duration: number;
  completed: boolean;
}

export interface BrewTrackerState {
  _id?: string;
  enabled?: boolean;
  completed?: boolean;
  stage?: number;
  stages?: BrewTrackerStage[];
}
