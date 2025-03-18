import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Medicion } from "lib";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale
);

interface SondeoGraphProps {
  mediciones: Medicion[];
}

const SondeoGraph = ({ mediciones }: SondeoGraphProps) => {
  if (!mediciones.length) return null;

  const chartData = {
    labels: mediciones.map((m) => m.getA_B_Sobre2()),
    datasets: [
      {
        label: "Resistividad Aparente (Ω⋅m)",
        data: mediciones.map((m) => m.getResistividadAparente()),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgb(75, 192, 192)",
        pointRadius: 2,
        pointHoverRadius: 8,
        tension: 0.1,
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "logarithmic",
        title: {
          display: true,
          text: "AB/2 (m)",
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          callback: (value) => value.toString(),
        }
      },
      y: {
        type: "logarithmic",
        title: {
          display: true,
          text: "Resistividad Aparente (Ω⋅m)",
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: "Curva de Sondeo Eléctrico Vertical",
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      legend: {
        position: 'top',
        labels: {
          boxWidth: 20,
          padding: 15,
          font: {
            size: 12
          }
        }
      }
    }
  };

  return (
    <div style={{ height: "500px", padding: "20px" }}>
      <Line options={chartOptions} data={chartData} />
    </div>
  );
};

export { SondeoGraph };
