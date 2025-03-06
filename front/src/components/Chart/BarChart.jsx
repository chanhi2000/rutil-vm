import { useState, useEffect, useRef } from "react";
import ReactApexChart from "react-apexcharts";
import "./BarChart.css";

const BarChart = ({ names, percentages }) => {
  const chartContainerRef = useRef(null);

  const [chartSize, setChartSize] = useState({
    width: "100%", // 부모 div의 100% 사용
    height: "30vh", // 뷰포트 높이의 30% 사용
  });

  const updateChartSize = () => {
    if (chartContainerRef.current) {
      const containerWidth = chartContainerRef.current.clientWidth;

      let width = Math.max(containerWidth * 0.66, 265); // 기본 너비
      let height = Math.max(window.innerHeight * 0.25, 200); // 기본 높이

      if (window.innerWidth >= 2000) {
        width = Math.max(containerWidth *  1.4, 750); // 🔥 2000px 이상일 때 더 크게
        height = Math.max(window.innerHeight * 0.25, 300);
      }

      setChartSize({ width: `${width}px`, height: `${height}px` });
    }
  };

  useEffect(() => {
    updateChartSize();
    window.addEventListener("resize", updateChartSize);

    return () => {
      window.removeEventListener("resize", updateChartSize);
    };
  }, []);

  const [series, setSeries] = useState([{ data: percentages }]);
  const [chartOptions, setChartOptions] = useState({
    chart: {
      offsetY: -15,
      offsetX: -55,
      type: "bar",
  
    },
    grid: {
      show: false,
    },
    plotOptions: {
      bar: {
        barHeight: "100%",
        distributed: true,
        horizontal: true,
        dataLabels: {
          position: "bottom",
        },
      },
    },
    colors: ["#1597E5", "#69DADB", "#7C7DEA"],
    dataLabels: {
      enabled: true,
      textAnchor: "start",
      style: {
        colors: ["#fff"],
        fontSize: "12px",
        fontWeight: "400",
      },
      formatter: function (val, opt) {
        return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
      },
      offsetX: 0,
      dropShadow: {
        enabled: true,
      },
    },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
    xaxis: {
      categories: names,
      min: 0,
      max: 100,
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    tooltip: {
      theme: "dark",
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function () {
            return "";
          },
        },
      },
    },
  });

  useEffect(() => {
    setSeries([{ data: percentages }]);
    setChartOptions((prevOptions) => ({
      ...prevOptions,
      xaxis: {
        ...prevOptions.xaxis,
        categories: names,
      },
    }));
  }, [names, percentages]);

  return (
    <div ref={chartContainerRef} style={{ width: "100%", maxWidth: "900px", minWidth: "100px" }}>
      <div id="bar_chart">
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="bar"
          width={chartSize.width}
          height={chartSize.height}
        />
      </div>
    </div>
  );
};

export default BarChart;
