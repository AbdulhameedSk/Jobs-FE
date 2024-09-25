import React, { useEffect, useState } from 'react';
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Line, LineChart } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import Header from "../components/Boilers/Header";
import { endpoint } from "../apis/endpoint";
import { apiHandler } from "../apis/index";
import { useSelector } from "react-redux";

const chartConfig = {
  uv: {
    label: "UV",
    color: "hsl(var(--chart-1))",
  },
  pv: {
    label: "PV",
    color: "hsl(var(--chart-2))",
  },
  amt: {
    label: "Amount",
    color: "hsl(var(--chart-3))",
  },
};


export default function Dashboard() {
  const authToken = useSelector((state) => state.auth.authToken);
  const userId = useSelector((state) => state.user.userId);

  const [freeCount, setFreeCount] = useState(0);
  const [paidCount, setPaidCount] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);

  const fetchCategoriesData = async () => {
    try {
      const response = await apiHandler({
        url: endpoint.CATEGORY_DETAILS,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, // Make sure authToken is defined
        },
        data: { userId:userId },
      });
      if (response.status === 200) {
        setFreeCount(response.data.freeCount);
        setPaidCount(response.data.paidCount);
        setEmployeeCount(response.data.employeesCount);
      }
    } catch (error) {
      console.error("Error fetching categories data:", error);
    }
  };

  useEffect(() => {
    console.log(`Free: ${freeCount}, Paid: ${paidCount}, Employees: ${employeeCount}`);
    fetchCategoriesData();
    console.log(`Free: ${freeCount}, Paid: ${paidCount}, Employees: ${employeeCount}`);

  }, [freeCount, paidCount, employeeCount]);
  

  const pieData = [
    { name: 'Free to Public', value: freeCount, fill: '#8884d8' }, // Purple
    { name: 'Enterprise', value: employeeCount, fill: '#82ca9d' }, // Green
    { name: 'Paid', value: paidCount, fill: '#ffc658' }, // Yellow
  ];
  

  const areaData = [
    { name: 'Page A', uv: 40, pv: 24, amt: 24 },
    { name: 'Page B', uv: 30, pv: 14, amt: 22 },
    { name: 'Page C', uv: 20, pv: 10, amt: 23 },
    { name: 'Page D', uv: 28, pv: 39, amt: 20 },
    { name: 'Page E', uv: 19, pv: 48, amt: 22 },
    { name: 'Page F', uv: 24, pv: 38, amt: 25 },
    { name: 'Page G', uv: 35, pv: 43, amt: 21 },
  ];

  const composedData = [
    { name: 'Page A', uv: 590, pv: 800, amt: 1400 },
    { name: 'Page B', uv: 868, pv: 967, amt: 1506 },
    { name: 'Page C', uv: 1397, pv: 1098, amt: 989 },
    { name: 'Page D', uv: 1480, pv: 1200, amt: 1228 },
    { name: 'Page E', uv: 1520, pv: 1108, amt: 1100 },
    { name: 'Page F', uv: 1400, pv: 680, amt: 1700 },
  ];

  return (
    <div className="flex flex-col space-y-4">
      <div className="sticky top-0 z-10 bg-white">
        <Header title={"Dashboard"} />
      </div>
      <div className="flex-grow">
        <Card>
          <CardHeader>
            <CardTitle>Main Chart</CardTitle>
            <CardDescription>Categories Data Overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={areaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 50]} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="uv" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="pv" fill="hsl(var(--chart-2))" />
                  <Bar dataKey="amt" fill="hsl(var(--chart-3))" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Categories Chart</CardTitle>
              <CardDescription>Data Trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={areaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="uv" stackId="1" fill="hsl(var(--chart-1))" />
                    <Bar dataKey="pv" stackId="1" fill="hsl(var(--chart-2))" />
                    <Bar dataKey="amt" stackId="1" fill="hsl(var(--chart-3))" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pie Chart</CardTitle>
              <CardDescription>Data Distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie dataKey="value" data={pieData} cx="50%" cy="50%" outerRadius={80} fill="hsl(var(--chart-1))" label />
                    <Tooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Line Chart</CardTitle>
              <CardDescription>Performance Over Time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={composedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="uv" stroke="hsl(var(--chart-1))" />
                    <Line type="monotone" dataKey="pv" stroke="hsl(var(--chart-2))" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total data
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
