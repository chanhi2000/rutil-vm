import { useState, useEffect, useRef } from "react";
import ReactApexChart from "react-apexcharts";
import "./AreaChart.css";

const AreaChart = ({ series, datetimes }) => {
  const chartContainerRef = useRef(null);

  const [options, setOptions] = useState({
    chart: {
      type: "area",
      offsetX: 0, // 🔸 그래프 자체의 x축 위치 조정 최소화
      zoom: {
        enabled: false, // ✅ 줌 비활성화
      },
    },
    colors: ["#1597E5", "#69DADB", "rgb(177, 143, 216)"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "String",
      categories: datetimes,
      labels: {
        style: {
          fontSize: '11px',
        }
      }
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 4, // 🔹 눈금 수 제한 (선택)
      labels: {
        show: true,
        style: {
          fontSize: '11px',
        },
        offsetX: -6, // 🔸 숫자 왼쪽으로 살짝 붙이기
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    grid: {
      padding: {
        left: -14,  // ✅ 여백 최소로
        right: 0,
      },
    },
    tooltip: {
      x: {
        format: "yy/MM/dd HH:mm",
      },
    },
  });
  
  

  // 반응형 차트 크기 조정
  const [chartSize, setChartSize] = useState({
    width: "100%", // 부모 div의 100% 사용
    height: "30vh", // 뷰포트 높이의 30% 사용
  });

  // 부모 div 크기에 맞춰 차트 크기 조정
  const updateChartSize = () => {
    if (chartContainerRef.current) {
      const containerWidth = chartContainerRef.current.clientWidth;

      let width = Math.max(containerWidth * 0.9, 210); // 기본 너비
      let height = Math.max(window.innerHeight * 0.14, 100); // 기본 높이

      if (window.innerWidth >= 2200) {
        width = Math.max(containerWidth * 1, 570); // 🔥 2000px 이상일 때 더 크게
        height = Math.max(window.innerHeight * 0.21, 230);
      }

      setChartSize({ width: `${width}px`, height: `${height}px` });
    }
  };

  // side바에따라 그래프 겹치는 것 방지
  useEffect(() => {
    updateChartSize();
  }, [datetimes, series]);
  useEffect(() => {
    updateChartSize();
  
    const resizeTimer = setTimeout(() => {
      updateChartSize();
    }, 200); // DOM 렌더 후 0.2초 뒤에 한 번 더
  
    return () => clearTimeout(resizeTimer);
  }, [datetimes, series]);
  useEffect(() => {
    if (!chartContainerRef.current) return;
  
    const observer = new ResizeObserver(() => {
      updateChartSize();
    });
  
    observer.observe(chartContainerRef.current);
  
    return () => {
      observer.disconnect();
    };
  }, []);
  
  
  // 창 크기 변경 시 차트 크기 업데이트
  useEffect(() => {
    updateChartSize();
    window.addEventListener("resize", updateChartSize);

    return () => {
      window.removeEventListener("resize", updateChartSize);
    };
  }, []);

  return (
    <div ref={chartContainerRef} style={{ width: "100%", maxWidth: "900px", minWidth: "300px" }}>
      <div id="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          width={chartSize.width}
          height={chartSize.height}
        />
      </div>
    </div>
  );
};

export default AreaChart;
