import type gsap from 'gsap';

export type SizeType            =      'text' | 'button';
export type MoneyStyleType      =      'decimal' | 'percent' | 'unit' | 'currency';
export type AnimationMode       =      'from' | 'to' | 'fromTo';
export type CarouselFormatType  =      'flat'       |
                                       'regular'    |
                                       'unelevated' |
                                       'outline'    |
                                       'push';
export type Colors              =      'primary'    |
                                       'secondary'  |
                                       'accent'     |
                                       'info'       |
                                       'warning'    |
                                       'negative'   |
                                       'positive'   |
                                       'dark'       |
                                       'dark-page'  |
                                       'grey';
export type DirectionType       = 'left' | 'right' | 'center' | 'bottom' | 'top';
export type GsapTarget          = gsap.TweenTarget;

export interface User {
  token?: string;
  email: string;
  nome: string;
  uuid: string;
}

export interface RequestErrors {
  [field: string]: string[];
}

export interface Pagination {
  sortBy?: string | undefined;
  descending?: boolean | undefined;
  page?: number;
  rowsPerPage?: number;
  rowsNumber?: number;
}

export interface Meta {
  current_page: number;
  per_page: number;
  total: number;
}

export interface RadioOptions {
  label: string;
  color: string;
  val: string | number;
}

export interface ButtonGeneric {
  label?: string
}

export interface CardGeneric {
  label?: string;
  icon?: string;
}

export interface Title {
  title?: string;
  caption?: string;
  align?: DirectionType;
}

export interface Separator {
  color?: Colors;
}

export interface MenuItem {
  title: string;
  icon: string;
  link?: string;
  subLinks?: MenuItem[];
  defaultOpen?: boolean;
  badge?: string | number;
  badgeColor?: string;
  badgeTextColor?: string;
}

export interface OptionsSelect {
  value: string;
  label: string;
}

export interface Crumb {
  label: string;
  icon: string;
  path: string | null;
  isLink: boolean | null;
}

export interface SkeletonItem {
  qtd: number;
  class: string;
}

export interface Tab {
  name: string;
  tab: any;
  label: string;
  disable?: boolean;
}

export interface InputDateTime {
  modelValue: string;
  clearable?: boolean;
  readonly?: boolean;
}

export interface InputUpload {
  label: string;
  multiple?: boolean;
  accept?: string;
}

export type StepPreset = {
  steps: gsap.TweenVars[];
  repeat?: number;
  yoyo?: boolean;
  delay?: number;
  defaults?: gsap.TweenVars;
  onComplete?: gsap.Callback;
  overwrite?: boolean;
}

export type TimelineOptions = {
  steps: gsap.TweenVars[];
  repeat?: number;
  yoyo?: boolean;
  delay?: number;
  defaults?: gsap.TweenVars;
  onComplete?: gsap.Callback;
}

export interface LottieInstance {
  play: () => void;
  pause: () => void;
  stop: () => void;
  destroy: () => void;
  setDirection: (direction: 'forward' | 'reverse') => void;
  getDuration: () => number;
}

export interface DefaultCarousel {
  modelValue: number
  arrows?: boolean
  swipeable?: boolean
  autoplay?: boolean
  loop?: boolean
  pauseOnHover?: boolean
  captionPosition?: DirectionType
  type?: CarouselFormatType
  slides: Slide[]
}

export interface Slide{
  img?: string;
  title?: string;
  description?: string;
  component?: any
}

export interface HotkeyOptions {
  keys: string | string[];
  callback: (event: KeyboardEvent) => void;
  preventDefault?: boolean;
}

export interface Stepper {
  title: string
  content?: string
  icon: string
  disable?: boolean
  component?: any
}

export interface DoughnutGraphicData{
  name: string;
  fields: string[];
  data: number[];
  hoverOffset: number;
  cutout: string;
  legendPosition: DirectionType;
}

export interface ColumnGraphicData {
  name: string;
  fields: string[];
  data: number[];
  legendPosition: DirectionType;
  direction: 'x' | 'y';
  stacked: boolean;
  beginAtZero: boolean;
  barThickness: number;
}

export interface ScatterPoint {
  x: number;
  y: number;
}

export interface ScatterGraphicData {
  name: string;
  points: ScatterPoint[];
  showLine: boolean;
  borderColor: string;
  backgroundColor: string;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}
