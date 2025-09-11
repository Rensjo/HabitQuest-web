import { 
  Target, 
  Dumbbell, 
  Book, 
  DollarSign, 
  Heart, 
  Briefcase, 
  Palette, 
  Brain,
  Trophy,
  Star,
  Calendar,
  Settings,
  Plus,
  Trash2,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Gift,
  Award,
  Zap,
  Moon,
  Sun,
  Smartphone,
  Timer,
  TrendingUp,
  Users,
  Home,
  type LucideIcon
} from 'lucide-react';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
}

const iconMap: Record<string, LucideIcon> = {
  target: Target,
  dumbbell: Dumbbell,
  book: Book,
  dollar: DollarSign,
  heart: Heart,
  briefcase: Briefcase,
  palette: Palette,
  brain: Brain,
  trophy: Trophy,
  star: Star,
  calendar: Calendar,
  settings: Settings,
  plus: Plus,
  trash: Trash2,
  check: Check,
  x: X,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  chart: BarChart3,
  gift: Gift,
  award: Award,
  zap: Zap,
  moon: Moon,
  sun: Sun,
  smartphone: Smartphone,
  timer: Timer,
  trending: TrendingUp,
  users: Users,
  home: Home,
};

export function Icon({ name, size = 20, className = '', color }: IconProps) {
  const IconComponent = iconMap[name] || Target;
  
  return (
    <IconComponent 
      size={size} 
      className={className}
      color={color}
    />
  );
}

export { iconMap };
