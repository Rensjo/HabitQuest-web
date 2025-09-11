import { 
  Calendar, 
  Target, 
  TrendingUp, 
  Award, 
  Star, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Minus, 
  X, 
  Settings, 
  BarChart3, 
  PieChart, 
  Activity, 
  Zap, 
  Clock, 
  Trophy, 
  Gift, 
  Heart, 
  Brain, 
  Dumbbell, 
  Book, 
  Coffee, 
  Home, 
  DollarSign,
  Sparkles,
  Flame,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  MoreVertical,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Save,
  ArrowRight,
  ArrowLeft,
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,
  HelpCircle,
  Shield,
  Map,
  Compass,
  Lock,
  Unlock,
  User,
  Crown,
  Gem,
  Sun,
  Moon,
  Monitor,
  CalendarDays,
  CalendarRange,
  CalendarClock,
  Sunrise
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Category icons mapping
export const categoryIcons: Record<string, LucideIcon> = {
  'Health & Fitness': Dumbbell,
  'Learning & Education': Book,
  'Career & Work': Target,
  'Relationships': Heart,
  'Personal Development': Brain,
  'Finance': DollarSign,
  'Hobbies & Fun': Coffee,
  'Home & Environment': Home,
  'Spiritual & Mindfulness': Star,
  'Creative': Sparkles,
  'default': Activity,
};

// Action icons
export const actionIcons = {
  add: Plus,
  remove: Minus,
  delete: Trash2,
  edit: Edit,
  save: Save,
  close: X,
  settings: Settings,
  refresh: RefreshCw,
  download: Download,
  upload: Upload,
  eye: Eye,
  eyeOff: EyeOff,
  info: Info,
  help: HelpCircle,
  filter: Filter,
  more: MoreVertical,
};

// Status icons
export const statusIcons = {
  completed: CheckCircle2,
  incomplete: Circle,
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
  info: Info,
  help: HelpCircle,
};

// Navigation icons
export const navigationIcons = {
  left: ChevronLeft,
  right: ChevronRight,
  up: ChevronUp,
  down: ChevronDown,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
};

// Feature icons
export const featureIcons = {
  calendar: Calendar,
  target: Target,
  trending: TrendingUp,
  award: Award,
  star: Star,
  activity: Activity,
  zap: Zap,
  clock: Clock,
  trophy: Trophy,
  gift: Gift,
  flame: Flame,
  sparkles: Sparkles,
  barChart: BarChart3,
  pieChart: PieChart,
  crown: Crown,
  gem: Gem,
  sun: Sun,
  moon: Moon,
  monitor: Monitor,
  map: Map,
  compass: Compass,
  sunrise: Sunrise,
  calendarDays: CalendarDays,
  calendarRange: CalendarRange,
  calendarClock: CalendarClock,
  checkCircle: CheckCircle,
  plus: Plus,
  x: X,
  chevronUp: ChevronUp,
};

// Frequency icons
export const frequencyIcons = {
  daily: Sunrise,
  weekly: CalendarDays,
  monthly: CalendarRange,
  yearly: Target,
};

// Security icons
export const securityIcons = {
  shield: Shield,
  lock: Lock,
  unlock: Unlock,
  user: User,
};

// All icons combined for easy access
export const icons = {
  ...categoryIcons,
  ...actionIcons,
  ...statusIcons,
  ...navigationIcons,
  ...featureIcons,
  ...frequencyIcons,
  ...securityIcons,
};

// Icon size variants
export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
};

// Icon color variants for Tailwind classes
export const iconColors = {
  primary: "text-blue-400",
  secondary: "text-slate-400",
  success: "text-green-400",
  warning: "text-yellow-400",
  danger: "text-red-400",
  info: "text-cyan-400",
  muted: "text-slate-500",
  white: "text-white",
  accent: "text-purple-400",
};
