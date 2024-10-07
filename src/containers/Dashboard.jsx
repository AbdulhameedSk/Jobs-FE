import React, { useEffect, useState } from 'react';
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Line, LineChart } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import Header from "../components/Boilers/Header";
import { endpoint } from "../apis/endpoint";
import { apiHandler } from "../apis/index";
import { useSelector } from "react-redux";
import CustomChartBar from "../components/CustomChartBar/CustomChartBar";

const chartConfig = {
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-1))",
  },
  shortlisted: {
    label: "Shortlisted",
    color: "hsl(var(--chart-2))",
  },
  declined: {
    label: "Declined",
    color: "hsl(var(--chart-3))",
  },
  accepted: {
    label: "Accepted",
    color: "hsl(var(--chart-4))",
  },
};

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobChartData, setJobChartData] = useState([]);
  const [uploadChartData, setUploadChartData] = useState([]);
  const [chartJobData, setChartJobData] = useState([]);
  const authToken = useSelector((state) => state.auth.authToken);
  const userId = useSelector((state) => state.user.userId);


  

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const result = await apiHandler({
        url: endpoint.SEVEN_JOBS,
        method: "POST",
        authToken: authToken,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        data: { Eid: userId },
      });
      // setJobs(result.data);
      processJobData(result.data);
    } catch (error) {
      console.error("Error fetching job metrics:", error);
      setError("Failed to load job data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const processJobData = (jobsData) => {
    const processedData = jobsData.map((job, index) => {
      const pendingCount = job.applicants.filter(applicant => applicant.status === "pending").length;
      const shortlistedCount = job.applicants.filter(applicant => applicant.status === "shortlisted").length;
      const declinedCount = job.applicants.filter(applicant => applicant.status === "declined").length;
      const acceptedCount = job.applicants.filter(applicant => applicant.status === "accepted").length;

      return {
        name: `Job ${job.role }`,
        pending: pendingCount,
        shortlisted: shortlistedCount,
        declined: declinedCount,
        accepted: acceptedCount,
      };
    });

    setJobChartData(processedData);

    const totalCounts = processedData.reduce((acc, job) => {
      acc.pending += job.pending;
      acc.shortlisted += job.shortlisted;
      acc.declined += job.declined;
      acc.accepted += job.accepted;
      return acc;
    }, { pending: 0, shortlisted: 0, declined: 0, accepted: 0 });


  };

  const fetchUploadData = async () => {
    try {
      setIsLoading(true);
      const response = await apiHandler({
        url: endpoint.MONTHLY_COUNT,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      if (response.status === 200) {
        const { monthlyUploadCounts } = response.data;
        const formattedData = formatChartData(monthlyUploadCounts);
        setUploadChartData(formattedData);
      }
    } catch (err) {
      console.error('Error fetching upload data:', err);
      setError('Failed to load upload data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
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
  const [freeCount, setFreeCount] = useState(0);
  const [paidCount, setPaidCount] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);
  useEffect(() => {
    console.log(`Free: ${freeCount}, Paid: ${paidCount}, Employees: ${employeeCount}`);
    fetchCategoriesData();
    console.log(`Free: ${freeCount}, Paid: ${paidCount}, Employees: ${employeeCount}`);

  }, [freeCount, paidCount, employeeCount]);
  
  const handleJobsList = async () => {
    setIsLoading(true);
    try {
      const result = await apiHandler({
        url: endpoint.JOB_METRICS,
        method: "GET",
        authToken: authToken,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (result.status === 200) {
        setJobs(result.data.data.last1yearjobs);
        console.log(result.data.data.last1yearjobs);
      }
    } catch (error) {
      console.error("Error fetching job metrics:", error);
      setError("Failed to load job metrics. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchUploadData();
    handleJobsList();
  }, []);

  const formatChartData = (monthlyUploadCounts) => {
    if (!monthlyUploadCounts || monthlyUploadCounts.length === 0) {
      return [];
    }
    return monthlyUploadCounts.map(({ _id: { year, month }, count }) => {
      const formattedMonth = new Date(year, month - 1).toLocaleString('default', { month: 'short' }); 
      return { name: `${formattedMonth} ${year}`, uploads: count };
    });
  };

  const ChartTooltipContent = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 border border-border rounded shadow-md">
          <p className="font-semibold">{payload[0].name}</p>
          <p>{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };
  const pieData = [
    { name: 'Free to Public', value: freeCount ?? 0, fill: '#8884d8' }, // Purple
    { name: 'Enterprise', value: employeeCount ?? 0, fill: '#82ca9d' }, // Green
    { name: 'Paid', value: paidCount ?? 0, fill: '#ffc658' }, // Yellow
  ];
  const BarChartTooltipContent = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 border border-border rounded shadow-md">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index}>{`${entry.name}: ${entry.value}`}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="sticky top-0 z-10 bg-white">
        <Header title={"Dashboard"} />
      </div>
      <div className="flex-grow">
       <CustomChartBar videoDataBar={jobs} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Jobs Applicants Chart</CardTitle>
              <CardDescription>Applicant Status by Job</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={jobChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<BarChartTooltipContent />} />
                    <Bar dataKey="pending" stackId="1" fill={chartConfig.pending.color} />
                    <Bar dataKey="shortlisted" stackId="1" fill={chartConfig.shortlisted.color} />
                    <Bar dataKey="declined" stackId="1" fill={chartConfig.declined.color} />
                    <Bar dataKey="accepted" stackId="1" fill={chartConfig.accepted.color} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cate</CardTitle>
              <CardDescription>Overall distribution of applicant statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie dataKey="value" data={pieData} cx="50%" cy="50%" outerRadius={80} label />
                    <Tooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="p-4 shadow-lg">
            <CardHeader>
              <CardTitle>Video Upload Trend</CardTitle>
              <CardDescription>Monthly upload counts over the past year</CardDescription>
            </CardHeader>
            <CardContent>
              {uploadChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={uploadChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="uploads" stroke={chartConfig.pending.color} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-gray-500">
                  No upload data available for the past year.
                </div>
              )}
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


// import React, { useEffect, useState } from 'react';
// import { TrendingUp } from "lucide-react";
// import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Line, LineChart } from 'recharts';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
// import Header from "../components/Boilers/Header";
// import { endpoint } from "../apis/endpoint";
// import { apiHandler } from "../apis/index";
// import { useSelector } from "react-redux";
// import CustomChartBar from "../components/CustomChartBar/CustomChartBar";

// const chartConfig = {
//   pending: {
//     label: "Pending",
//     color: "hsl(var(--chart-1))",
//   },
//   shortlisted: {
//     label: "Shortlisted",
//     color: "hsl(var(--chart-2))",
//   },
//   declined: {
//     label: "Declined",
//     color: "hsl(var(--chart-3))",
//   },
//   accepted: {
//     label: "Accepted",
//     color: "hsl(var(--chart-4))",
//   },
// };

// export default function Dashboard() {
//   const [jobs, setJobs] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [chartData, setChartData] = useState([]);
//   const [pieData, setPieData] = useState([]);
//   const authToken = useSelector((state) => state.auth.authToken);
//   const userId = useSelector((state) => state.user.userId);

//   const fetchJobs = async () => {
//     setIsLoading(true);
//     try {
//       const result = await apiHandler({
//         url: endpoint.SEVEN_JOBS,
//         method: "POST",
//         authToken: authToken,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authToken}`,
//         },
//         data: { Eid: userId },
//       });
//       setJobs(result.data);
//       processJobData(result.data);
//     } catch (error) {
//       console.error("Error fetching job metrics:", error);
//       setError("Failed to load job data. Please try again later.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const processJobData = (jobsData) => {
//     const processedData = jobsData.map((job, index) => {
//       const pendingCount = job.applicants.filter(applicant => applicant.status === "pending").length;
//       const shortlistedCount = job.applicants.filter(applicant => applicant.status === "shortlisted").length;
//       const declinedCount = job.applicants.filter(applicant => applicant.status === "declined").length;
//       const acceptedCount = job.applicants.filter(applicant => applicant.status === "accepted").length;

//       return {
//         name: `Job ${index + 1}`,
//         pending: pendingCount,
//         shortlisted: shortlistedCount,
//         declined: declinedCount,
//         accepted: acceptedCount,
//       };
//     });

//     setChartData(processedData);

//     // Calculate total counts for pie chart
//     const totalCounts = processedData.reduce((acc, job) => {
//       acc.pending += job.pending;
//       acc.shortlisted += job.shortlisted;
//       acc.declined += job.declined;
//       acc.accepted += job.accepted;
//       return acc;
//     }, { pending: 0, shortlisted: 0, declined: 0, accepted: 0 });

//     setPieData([
//       { name: 'Pending', value: totalCounts.pending, fill: chartConfig.pending.color },
//       { name: 'Shortlisted', value: totalCounts.shortlisted, fill: chartConfig.shortlisted.color },
//       { name: 'Declined', value: totalCounts.declined, fill: chartConfig.declined.color },
//       { name: 'Accepted', value: totalCounts.accepted, fill: chartConfig.accepted.color },
//     ]);
//   };

//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   const ChartTooltipContent = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-background p-2 border border-border rounded shadow-md">
//           <p className="font-semibold">{payload[0].name}</p>
//           <p>{`${payload[0].name}: ${payload[0].value}`}</p>
//         </div>
//       );
//     }
//     return null;
//   };

//   const BarChartTooltipContent = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-background p-2 border border-border rounded shadow-md">
//           <p className="font-semibold">{label}</p>
//           {payload.map((entry, index) => (
//             <p key={index}>{`${entry.name}: ${entry.value}`}</p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className="flex flex-col space-y-4">
//       <div className="sticky top-0 z-10 bg-white">
//         <Header title={"Dashboard"} />
//       </div>
//       <div className="flex-grow">
//         <CustomChartBar videoDataBar={jobs} />

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Jobs Applicants Chart</CardTitle>
//               <CardDescription>Applicant Status by Job</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <ChartContainer config={chartConfig}>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={chartData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip content={<BarChartTooltipContent />} />
//                     <Bar dataKey="pending" stackId="1" fill={chartConfig.pending.color} />
//                     <Bar dataKey="shortlisted" stackId="1" fill={chartConfig.shortlisted.color} />
//                     <Bar dataKey="declined" stackId="1" fill={chartConfig.declined.color} />
//                     <Bar dataKey="accepted" stackId="1" fill={chartConfig.accepted.color} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </ChartContainer>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Applicant Status Distribution</CardTitle>
//               <CardDescription>Overall distribution of applicant statuses</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <ChartContainer config={chartConfig}>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart>
//                     <Pie dataKey="value" data={pieData} cx="50%" cy="50%" outerRadius={80} label />
//                     <Tooltip content={<ChartTooltipContent />} />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </ChartContainer>
//             </CardContent>
//           </Card>
//         </div>

//         <Card>
//           <CardFooter className="flex-col gap-2 text-sm">
//             <div className="flex items-center gap-2 font-medium leading-none">
//               Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
//             </div>
//             <div className="leading-none text-muted-foreground">
//               Showing total data
//             </div>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   );
// }