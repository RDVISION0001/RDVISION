import React from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const indexs = () => {
  return (
    <div className="container-fluid">
      <div className="p-4">
        {/* Widgets Section */}
        <div className="row mb-4">
          <div className="col-md-3">
            <WidgetCard icon="🛍️" title="Today Sale" value="78" color="success" />
          </div>
          <div className="col-md-3">
            <WidgetCard icon="📦" title="Total Delivered" value="459" color="success" />
          </div>
          <div className="col-md-3">
            <WidgetCard icon="⚠️" title="Charge Back" value="78" color="primary" />
          </div>
          <div className="col-md-3">
            <WidgetCard icon="❌" title="Orders Canceled" value="21" color="danger" />
          </div>
        </div>

        {/* Charts Section */}
        <div className="row mb-4">
          <div className="col-md-8">
            <div className="card p-3">
              <h5>Orders Delivered</h5>
              <LineChart />
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3">
              <h5>Daily Orders Overview</h5>
              <BarChart />
            </div>
            {/* New "Recent sale"*/}
            <div className="card p-4 mt-4 rounded-lg shadow-sm" style={{ backgroundColor: "rgba(144, 238, 144, 0.2)" }}>
              <h5 className="text-center text-success" style={{ color: "#006400" }}>
                <a href="#" className="badge bg-success">
                  Recent Sale
                </a>
              </h5>
              <div className="card-body text-center">
                <div className="d-flex justify-content-center align-items-center mb-4">
                  <div className="icon text-warning" style={{ fontSize: "3rem" }}>
                    💰
                  </div>
                  <div className="ms-3">
                    <h6 className="text-muted">Product Sold:</h6>
                    <h5 className="text-dark fw-bold">Viagra 100mg Tablet</h5>
                    <h6 className="text-muted">Price:</h6>
                    <h4 className="text-success fw-bold">$15</h4>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <span className="text-muted">Date:</span>
                  <span className="text-muted fw-bold">Jan 08, 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recently Placed Orders */}
        <div className="card p-3">
          <h5>Recently Placed Orders</h5>
          <OrderTable />
        </div>
      </div>
    </div>
  );
};

// Widget Card Component
const WidgetCard = ({ icon, title, value, color }) => {
  return (
    <div className="card text-center p-3">
      <div className={`card-icon text-${color}`} style={{ fontSize: "2.5rem" }}>
        {icon}
      </div>
      <h5 className="mt-2">{title}</h5>
      <h3 className={`text-${color}`}>{value}</h3>
    </div>
  );
};

// Line Chart Component
const LineChart = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Orders Delivered",
        data: [1000, 2000, 1500, 3000, 4000, 2500, 3500, 4500, 5000, 3000, 4000, 5000],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
      {
        label: "Total Sales",
        data: [1500, 2500, 2000, 3500, 4500, 3000, 4000, 5000, 5500, 4000, 5000, 6000],
        borderColor: "rgba(0, 255, 0, 1)",  // Green color
        backgroundColor: "rgba(0, 255, 0, 0.2)",
        tension: 0.4,
      },
      {
        label: "Canceled Orders",
        data: [50, 100, 75, 150, 200, 100, 150, 175, 200, 100, 150, 175],
        borderColor: "rgba(255, 99, 132, 1)",  // Red color
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
      },
      {
        label: "Pending Orders",
        data: [200, 300, 250, 400, 450, 350, 500, 600, 700, 500, 600, 700],
        borderColor: "rgba(255, 165, 0, 1)",  // Orange color
        backgroundColor: "rgba(255, 165, 0, 0.2)",
        tension: 0.4,
      },
      {
        label: "Returned Orders",
        data: [20, 30, 25, 40, 50, 30, 45, 55, 60, 40, 50, 60],
        borderColor: "rgba(255, 255, 0, 1)",  // Yellow color
        backgroundColor: "rgba(255, 255, 0, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
  };

  return <Line data={data} options={options} />;
};

// Bar Chart Component
const BarChart = () => {
  const data = {
    labels: ["Sep 01", "Sep 02", "Sep 03", "Sep 04", "Sep 05", "Sep 06", "Sep 07"],
    datasets: [
      {
        label: "Total Orders",
        data: [50, 60, 70, 80, 90, 75, 85],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Canceled Orders",
        data: [10, 15, 8, 12, 10, 5, 7],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
  };

  return <Bar data={data} options={options} />;
};

// Order Table Component
const OrderTable = () => {
  return (
    <table className="table table-bordered mt-3">
      <thead className="table-primary">
        <tr>
          <th scope="col">Revenue</th>
          <th scope="col">COGS</th>
          <th scope="col">Gross Profit</th>
          <th scope="col">Operating Expenses</th>
          <th scope="col">Operating Profit</th>
          <th scope="col">Taxes & Other Expenses</th>
          <th scope="col">Net Profit</th>
          <th scope="col">Profit Margin</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>French Fries</td>
          <td>John Leo</td>
          <td>New Town</td>
          <td><span className="badge bg-warning">Pending</span></td>
          <td>10:05</td>
          <td>$10</td>
          <td>$10</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Mango Pie</td>
          <td>Kristen</td>
          <td>Old Town</td>
          <td><span className="badge bg-danger">Canceled</span></td>
          <td>14:05</td>
          <td>$9</td>
          <td>$9</td>
        </tr>
        <tr>
          <td>3</td>
          <td>Fried Egg Sandwich</td>
          <td>Jack Suit</td>
          <td>Oxford Street</td>
          <td><span className="badge bg-success">Delivered</span></td>
          <td>12:05</td>
          <td>$12</td>
          <td>$12</td>
        </tr>
      </tbody>
    </table>
  );
};

export default indexs;
