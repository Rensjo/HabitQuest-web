import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { Card } from './Card';
import { useTheme } from '../../hooks/useTheme';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

export function StatCard({ title, value, subtitle, icon, trend, color = '#3b82f6' }: StatCardProps) {
  const trendColors = {
    up: 'text-emerald-500',
    down: 'text-red-500',
    neutral: 'text-gray-500'
  };
  
  return (
    <Card variant="elevated" padding="lg" className="text-center">
      {icon && (
        <div className="flex justify-center mb-3">
          <div 
            className="p-3 rounded-full"
            style={{ backgroundColor: `${color}20` }}
          >
            {icon}
          </div>
        </div>
      )}
      
      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
        {value}
      </div>
      
      <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {title}
      </div>
      
      {subtitle && (
        <div className={`text-xs mt-1 ${trend ? trendColors[trend] : 'text-gray-500 dark:text-gray-400'}`}>
          {subtitle}
        </div>
      )}
    </Card>
  );
}

interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface HabitProgressChartProps {
  data: ChartData[];
  height?: number;
  showGrid?: boolean;
}

export function HabitProgressChart({ data, height = 300, showGrid = true }: HabitProgressChartProps) {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#f1f5f9' : '#1e293b';
  const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';
  
  return (
    <Card variant="elevated" padding="lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Progress Over Time
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />}
          <XAxis 
            dataKey="name" 
            tick={{ fill: textColor, fontSize: 12 }}
            axisLine={{ stroke: gridColor }}
          />
          <YAxis 
            tick={{ fill: textColor, fontSize: 12 }}
            axisLine={{ stroke: gridColor }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
              border: `1px solid ${gridColor}`,
              borderRadius: '8px',
              color: textColor
            }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#3b82f6" 
            fill="url(#colorGradient)" 
            strokeWidth={2}
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

interface CategoryDistributionProps {
  data: { name: string; value: number; color: string }[];
  height?: number;
}

export function CategoryDistribution({ data, height = 300 }: CategoryDistributionProps) {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#f1f5f9' : '#1e293b';
  
  return (
    <Card variant="elevated" padding="lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        XP by Category
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
              border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
              borderRadius: '8px',
              color: textColor
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

interface WeeklyComparisonProps {
  data: ChartData[];
  height?: number;
}

export function WeeklyComparison({ data, height = 300 }: WeeklyComparisonProps) {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#f1f5f9' : '#1e293b';
  const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';
  
  return (
    <Card variant="elevated" padding="lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Weekly Comparison
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: textColor, fontSize: 12 }}
            axisLine={{ stroke: gridColor }}
          />
          <YAxis 
            tick={{ fill: textColor, fontSize: 12 }}
            axisLine={{ stroke: gridColor }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
              border: `1px solid ${gridColor}`,
              borderRadius: '8px',
              color: textColor
            }}
          />
          <Bar 
            dataKey="value" 
            fill="#10b981"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

interface StreakAnalyticsProps {
  data: ChartData[];
  height?: number;
}

export function StreakAnalytics({ data, height = 250 }: StreakAnalyticsProps) {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#f1f5f9' : '#1e293b';
  const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';
  
  return (
    <Card variant="elevated" padding="lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Streak Analytics
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: textColor, fontSize: 12 }}
            axisLine={{ stroke: gridColor }}
          />
          <YAxis 
            tick={{ fill: textColor, fontSize: 12 }}
            axisLine={{ stroke: gridColor }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
              border: `1px solid ${gridColor}`,
              borderRadius: '8px',
              color: textColor
            }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#f59e0b" 
            strokeWidth={3}
            dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#f59e0b' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

// Main Charts component that combines all chart types
interface ChartsProps {
  habits: any[];
  selectedDate: Date;
}

export function Charts({ habits, selectedDate }: ChartsProps) {
  // Generate sample data for demonstration
  const progressData = [
    { date: '2024-01-01', completed: 3, total: 5 },
    { date: '2024-01-02', completed: 4, total: 5 },
    { date: '2024-01-03', completed: 5, total: 5 },
    { date: '2024-01-04', completed: 2, total: 5 },
    { date: '2024-01-05', completed: 4, total: 5 },
    { date: '2024-01-06', completed: 3, total: 5 },
    { date: '2024-01-07', completed: 5, total: 5 },
  ];

  const categoryData = habits.reduce((acc: any[], habit) => {
    const existing = acc.find(item => item.name === habit.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: habit.category, value: 1 });
    }
    return acc;
  }, []);

  const streakData = habits.map(habit => ({
    name: habit.title || 'Habit',
    current: Math.floor(Math.random() * 20),
    longest: Math.floor(Math.random() * 50) + 20
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <HabitProgressChart data={progressData} />
      {categoryData.length > 0 && <CategoryDistribution data={categoryData} />}
      <WeeklyComparison data={progressData} />
      <StreakAnalytics data={streakData} />
    </div>
  );
}
