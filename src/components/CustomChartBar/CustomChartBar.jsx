import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "../../components/CustomChartBar/CustomChartBar.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import CustomIcon from "../CustomIcon";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const CustomChartBar = ({ videoDataBar }) => {
  const [formattedData, setFormattedData] = useState({});
  const [startIndex, setStartIndex] = useState(0);
  const [viewType, setViewType] = useState("day");

  useEffect(() => {
    if (!Array.isArray(videoDataBar)) {
      console.error("videoDataBar is not an array:", videoDataBar);
      return;
    }

    const formatted = videoDataBar.reduce((acc, video) => {
      let date;
      if (viewType === "day") {
        date = new Date(video.uploadTimestamp).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        });
      } else if (viewType === "month") {
        date = new Date(video.uploadTimestamp).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short",
        });
      } else if (viewType === "year") {
        date = new Date(video.uploadTimestamp).getFullYear().toString();
      }
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const sortedFormatted = Object.entries(formatted).sort((a, b) => {
      if (viewType === "day" || viewType === "month") {
        return new Date(a[0]) - new Date(b[0]);
      } else {
        return a[0] - b[0];
      }
    });

    const sortedData = Object.fromEntries(sortedFormatted);

    setFormattedData(sortedData);
    setStartIndex(Math.max(Object.keys(sortedData).length - 14, 0));
  }, [videoDataBar, viewType]);

  const labels = Object.keys(formattedData);
  const dataValues = Object.values(formattedData);
  const endIndex = startIndex + 14;
  const slicedLabels = labels.slice(startIndex, endIndex);
  const slicedDataValues = dataValues.slice(startIndex, endIndex);

  const data = {
    labels: slicedLabels,
    datasets: [
      {
        label: "Jobs Posted",
        data: slicedDataValues,
        backgroundColor: "rgba(153, 102, 255, 0.6)", // Light purple
        borderColor: "rgba(153, 102, 255, 1)",       // Darker purple
        borderWidth: 2,
        hoverBackgroundColor: "rgba(255, 159, 64, 0.6)", // Orange when hovered
        hoverBorderColor: "rgba(255, 159, 64, 1)",       // Darker orange when hovered
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  const handleNext = () => {
    if (endIndex < labels.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const handleViewChange = (type) => {
    setViewType(type);
    setStartIndex(Math.max(labels.length - 14, 0));
  };

  return (
    <div className="chart-bar-set">
      <div className="card" style={{ width: "93%" }}>
        <div className="card-body">
          <div className="container">
            <div className="chart-header">
              <div className="char-bar-upload">Jobs Posted</div>
              <div className="navigation-buttons">
               
              </div>
            </div>
            <div className="containerBody" style={{ height: "350px" }}>
              <Bar data={data} options={options} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomChartBar;
