
import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, BarChart2, PieChart as PieChartIcon } from 'lucide-react';

interface WeightData {
  date: string;
  value: number;
}

interface CaloriesData {
  labels: string[];
  data: number[];
}

interface ChartData {
  name: string;
  value: number;
}

interface FitnessChartProps {
  weightData: WeightData[];
  caloriesByWeek: CaloriesData;
  durationByType: ChartData[];
  workoutsByDay: ChartData[];
}

const FitnessChart: React.FC<FitnessChartProps> = ({ 
  weightData, 
  caloriesByWeek, 
  durationByType,
  workoutsByDay
}) => {
  const [activeTab, setActiveTab] = useState('weight');
  
  // Format date for tooltips
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Create formatted weight data
  const formattedWeightData = weightData.map(item => ({
    date: formatDate(item.date),
    value: item.value,
    fullDate: item.date
  }));
  
  // Create formatted calories data
  const formattedCaloriesData = caloriesByWeek.labels.map((label, index) => ({
    name: label,
    calories: caloriesByWeek.data[index]
  }));
  
  // Colors for charts
  const COLORS = ['#0071ff', '#00a3ff', '#39c4ff', '#5fd4ff', '#7ee1ff', '#9aebff'];
  
  // Custom tooltip for weight chart
  const WeightTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow rounded-md border border-gray-100">
          <p className="font-medium text-sm">{label}</p>
          <p className="text-sm text-fitness-primary font-bold">
            {payload[0].value.toFixed(1)} kg
          </p>
        </div>
      );
    }
    return null;
  };
  
  // Custom tooltip for calories chart
  const CaloriesTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow rounded-md border border-gray-100">
          <p className="font-medium text-sm">{label}</p>
          <p className="text-sm text-fitness-primary font-bold">
            {payload[0].value.toLocaleString()} calories
          </p>
        </div>
      );
    }
    return null;
  };
  
  // Custom tooltip for pie charts
  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow rounded-md border border-gray-100">
          <p className="font-medium text-sm">{payload[0].name}</p>
          <p className="text-sm text-fitness-primary font-bold">
            {payload[0].value} {activeTab === 'duration' ? 'minutes' : 'workouts'}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Fitness Analytics</CardTitle>
        <CardDescription>
          Track your progress over time with detailed charts and analytics
        </CardDescription>
      </CardHeader>
      <CardContent className="p-1">
        <Tabs defaultValue="weight" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-2">
            <TabsTrigger value="weight" className="flex items-center justify-center gap-1">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Weight Trend</span>
            </TabsTrigger>
            <TabsTrigger value="calories" className="flex items-center justify-center gap-1">
              <BarChart2 className="h-4 w-4" />
              <span className="hidden sm:inline">Calories</span>
            </TabsTrigger>
            <TabsTrigger value="duration" className="flex items-center justify-center gap-1">
              <PieChartIcon className="h-4 w-4" />
              <span className="hidden sm:inline">By Type</span>
            </TabsTrigger>
            <TabsTrigger value="frequency" className="flex items-center justify-center gap-1">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="hidden sm:inline">By Day</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="weight" className="mt-0">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedWeightData}>
                  <defs>
                    <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0071ff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0071ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={false}
                    domain={['dataMin - 1', 'dataMax + 1']}
                  />
                  <Tooltip content={<WeightTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#0071ff" 
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#weightGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="calories" className="mt-0">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedCaloriesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={false}
                  />
                  <Tooltip content={<CaloriesTooltip />} />
                  <Bar 
                    dataKey="calories" 
                    fill="#0071ff" 
                    radius={[4, 4, 0, 0]}
                    maxBarSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="duration" className="mt-0">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={durationByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {durationByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-sm text-gray-700">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="frequency" className="mt-0">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workoutsByDay} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f5f5f5" />
                  <XAxis 
                    type="number"
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={false}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category"
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={false}
                    width={80}
                  />
                  <Tooltip />
                  <Bar 
                    dataKey="value" 
                    fill="#0071ff" 
                    radius={[0, 4, 4, 0]}
                    maxBarSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FitnessChart;
