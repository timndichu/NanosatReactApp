import ReactApexChart from "react-apexcharts";
import { merge } from "lodash";
import { BaseOptionChart } from "./chart";

export default function Battery(props) {
  const chartOptions = merge(BaseOptionChart(), {
      series: [75],
      legend: {
        show: false
      },
      options: {
        legend: {
          show: false
        },
        chart: {
          height: 100,
          type: "radialBar",
          toolbar: {
            show: false,
          },
          dataLabels: {
            enabled: false
          },
          legend: {
            show: false
          }
        },
        plotOptions: {
          legend: {
            show: false
          },
          radialBar: {
            startAngle: -135,
            endAngle: 225,
            hollow: {
              margin: 0,
              size: "70%",
              background: "#fff",
              image: undefined,
              imageOffsetX: 0,
              imageOffsetY: 0,
              position: "front",
              dropShadow: {
                enabled: true,
                top: 3,
                left: 0,
                blur: 4,
                opacity: 0.24,
              },
            },
            track: {
              background: "#fff",
              strokeWidth: "67%",
              margin: 0, // margin is in pixels
              dropShadow: {
                enabled: true,
                top: -3,
                left: 0,
                blur: 4,
                opacity: 0.35,
              },
            },

            dataLabels: {
              show: true,
              name: {
                offsetY: -10,
                show: false,
                color: "#888",
                fontSize: "17px",
              },
              value: {
                formatter: function (val) {
                  return parseInt(val);
                },
                color: "#111",
                fontSize: "36px",
                show: true,
              },
            },
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            type: "horizontal",
            shadeIntensity: 0.5,
            gradientToColors: ["#ABE5A1"],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100],
          },
        },
        stroke: {
          lineCap: "round",
        },
        labels: ["Percent"],
      },
    
  });

 
    return (
     
          <ReactApexChart
            options={chartOptions}
            series={[props.charge]}
            type="radialBar"
            height={260}
            width={200}
          />
      
    );

}
