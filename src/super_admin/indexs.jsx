import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { subMonths, format } from "date-fns";
import { useAuth } from "../auth/AuthContext";
import { useSelector } from "react-redux";
import { theme } from "highcharts";
import VerifiedSales from "../pages/VerifyedSales";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const indexs = () => {
  const { dark } = useAuth();
  const [widgetData, setWidgetData] = useState({
    todaySale: 0,
    totalDelivered: 0,
    chargeBack: 0,
    ordersCanceled: 0,
  });

  const [lineChartData, setLineChartData] = useState(null);
  const [saleAmountData, setSaleAmountData] = useState(null);
  const { theme } = useSelector((state) => state.Theme);
  const [dateRange, setDateRange] = useState({
    from: subMonths(new Date(), 1), // Default: Previous month
    to: new Date(), // Default: Today
  });

  const fetchData = async () => {
    try {
      const payload = {
        from: format(dateRange.from, "yyyy-MM-dd"),
        to: format(dateRange.to, "yyyy-MM-dd"),
      };
      const response = await axiosInstance.post("/invoice/salesChart", payload); // Replace with your API endpoint
      const {
        allCancelled,
        allDelivered,
        allInShipping,
        returned,
        totalAwaiting,
        totalSales,
      } = response.data;

      setWidgetData({
        todaySale: totalSales,
        totalDelivered: allDelivered,
        chargeBack: allCancelled, // Assuming chargeBack is same as allCancelled
        ordersCanceled: returned, // Assuming ordersCanceled is same as returned
      });
    } catch (error) {
      console.error("Error fetching widget data:", error);
    }
  };

  const fetchLineChartData = async () => {
    try {
      const payload = {
        from: format(dateRange.from, "yyyy-MM-dd"),
        to: format(dateRange.to, "yyyy-MM-dd"),
      };
      const response = await axiosInstance.post(
        "/invoice/salesChartData",
        payload
      ); // Replace with your API endpoint
      setLineChartData(response.data); // Assuming the response data contains the necessary chart data
    } catch (error) {
      console.error("Error fetching line chart data:", error);
    }
  };

  const fetchBarChartAmountOfSales = async () => {
    try {
      const payload = {
        from: format(dateRange.from, "yyyy-MM-dd"),
        to: format(dateRange.to, "yyyy-MM-dd"),
      };
      const response = await axiosInstance.post(
        "/invoice/salesAmountChart",
        payload
      ); // Replace with your API endpoint
      setSaleAmountData(response.data); // Assuming the response data contains the necessary chart data
    } catch (error) {
      console.error("Error fetching line chart data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchLineChartData();
    fetchBarChartAmountOfSales();
  }, [dateRange]);

  const handleFromDateChange = (date) => {
    setDateRange((prev) => ({ ...prev, from: date }));
  };

  const handleToDateChange = (date) => {
    setDateRange((prev) => ({ ...prev, to: date }));
  };

  // Recent sale
  const [recentSale, setRecentSale] = useState(null);

  useEffect(() => {
    const fetchLatestSale = async () => {
      try {
        const response = await axiosInstance.get("/invoice/getLatestSale");
        setRecentSale(response.data);
      } catch (error) {
        console.error("Error fetching the latest sale:", error);
      }
    };

    fetchLatestSale();
  }, []);



  return (
    <div
      className={`container-fluid ${dark ? "bg-dark text-light" : "bg-light text-dark"
        }`}
    >
      <div className="p-4">
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <h4>Dashboard</h4>
          <div className="d-flex align-items-between gap-2 ">
            <div className="me-3">
              <label className="fw-bold">From Date:</label>
              <DatePicker
                selected={dateRange.from}
                onChange={handleFromDateChange}
                className={`"form-control bg-light text-dark rounded px-2 mx-1 ${dark ? "bg-secondary text-light rounded px-2 py-1" : ""
                  }`}
                dateFormat="yyyy-MM-dd"
              />
            </div>
            <div>
              <label className="fw-bold">To Date:</label>
              <DatePicker
                selected={dateRange.to}
                onChange={handleToDateChange}
                className={`"form-control bg-light text-dark rounded px-2 mx-1 ${dark ? "bg-secondary text-light rounded px-2 py-1" : ""
                  }`}
                dateFormat="yyyy-MM-dd"
              />
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between pb-2 gap-2">
          <div
            style={{ width: '20rem' }} className={` border rounded ${dark ? "bg-secondary" : ""}`}
          >
            <WidgetCard
              icon="🛍️"
              title="Today Sale"
              value={widgetData.todaySale}
              color="success"
            />
          </div>
          <div
            style={{ width: '20rem' }} className={` border rounded ${dark ? "bg-secondary" : ""}`}
          >
            <WidgetCard
              icon="📦"
              title="Total Delivered"
              value={widgetData.totalDelivered}
              color="success"
            />
          </div>
          <div
            style={{ width: '20rem' }} className={` border rounded ${dark ? "bg-secondary" : ""}`}
          >
            <WidgetCard
              icon="⚠️"
              title="Charge Back"
              value={widgetData.chargeBack}
              color="primary"
            />
          </div>
          <div
            style={{ width: '20rem' }} className={` border rounded ${dark ? "bg-secondary" : ""}`}
          >
            <WidgetCard
              icon="❌"
              title="Orders Canceled"
              value={widgetData.chargeBack}
              color="danger"
            />
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-8 border rounded">
            <div className={`"card p-3 ${dark ? "bg-dark" : ""}`}>
              <h5>Orders Delivered</h5>
              {/* Pass lineChartData to LineChart */}
              {lineChartData && <LineChart data={lineChartData} />}
            </div>
          </div>
          <div className="col-md-4">
            <div className={`"card p-3 ${dark ? "bg-dark" : ""}`}>
              <h5>Daily Orders Overview</h5>
              {saleAmountData && <LineChart data={saleAmountData} />}
            </div>
            {/* New "Recent sale"*/}
            <div
              className="card p-4 mt-4 rounded-lg shadow-sm"
              style={{
                backgroundColor: dark
                  ? "rgba(0, 128, 0, 0.2)"
                  : "rgba(144, 238, 144, 0.2)",
              }}
            >
              <h5
                className="text-center text-success"
                style={{ color: dark ? "#32cd32" : "#006400" }}
              >
                <a href="#" className="badge bg-success">
                  Recent Sale
                </a>
              </h5>
              <div className="card-body text-center">
                {recentSale ? (
                  <>
                    <div className="d-flex justify-content-center align-items-center mb-4">
                      <div
                        className="icon text-warning"
                        style={{ fontSize: "3rem" }}
                      >
                        💰
                      </div>
                      <div className="ms-3">
                        {/* Product Sold */}
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className={`text-muted mb-0 ${dark ? "text-light" : ""}`}>
                            Product Sold:
                          </h6>
                          <h5 className={`fw-bold mb-0 ${dark ? "text-light" : ""}`}>
                            {recentSale.productOrders?.[0]?.product?.[0]?.name || "N/A"}
                          </h5>
                        </div>
                        {/* Price */}
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className={`text-muted mb-0 ${dark ? "text-light" : ""}`}>
                            Price:
                          </h6>
                          <h4 className="text-success fw-bold mb-0">
                            {recentSale.productOrders?.[0]?.currency} {recentSale.productOrders?.[0]?.totalAmount || "0.00"}
                          </h4>
                        </div>
                        {/* Quantity */}
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className={`text-muted mb-0 ${dark ? "text-light" : ""}`}>
                            Quantity:
                          </h6>
                          <h5 className="fw-bold mb-0">
                            {recentSale.productOrders?.[0]?.quantity || "0"}
                          </h5>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <span className={`text-muted ${dark ? "text-light" : ""}`}>
                        Customer Name:
                      </span>
                      <span className={`text-muted fw-bold ${dark ? "text-light" : ""}`}>
                        {recentSale.customerName || "N/A"}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <span className={`text-muted ${dark ? "text-light" : ""}`}>
                        Mobile:
                      </span>
                      <span className={`text-muted fw-bold ${dark ? "text-light" : ""}`}>
                        {recentSale.customerMobile || "N/A"}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <span className={`text-muted ${dark ? "text-light" : ""}`}>
                        Email:
                      </span>
                      <span className={`text-muted fw-bold ${dark ? "text-light" : ""}`}>
                        {recentSale.customerEmail || "N/A"}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <span className={`text-muted ${dark ? "text-light" : ""}`}>
                        Date:
                      </span>
                      <span className={`text-muted fw-bold ${dark ? "text-light" : ""}`}>
                        {recentSale.saleDate
                          ? `${recentSale.saleDate[2]}-${recentSale.saleDate[1]}-${recentSale.saleDate[0]}`
                          : "N/A"}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <span className={`text-muted ${dark ? "text-light" : ""}`}>
                        Closer By:
                      </span>
                      <span className={`text-muted fw-bold ${dark ? "text-light" : ""}`}>
                        {recentSale.closerName || "N/A"}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-muted">Loading...</p>
                )}
              </div>


            </div>
          </div>
        </div>

        <div className={`"card p-3 ${dark ? "bg-dark border boreder-secondary rounded " : ""}`}>
          <OrderTable dark={dark} />
        </div>
      </div>
    </div>
  );
};

// Widget Card Component
const WidgetCard = ({ icon, title, value, color, dark }) => {
  return (
    <div className={`"card text-center p-3 ${dark ? "bg-secondary" : ""} `}>
      <div className={`card-icon text-${color}`} style={{ fontSize: "2.5rem" }}>
        {icon}
      </div>
      <h5 className="mt-2">{title}</h5>
      <h3 className={`text-${color}`}>{value}</h3>
    </div>
  );
};

// Line Chart Component
const LineChart = ({ data }) => {
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
const BarChart = ({ data }) => {
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
const OrderTable = ({ dark }) => {
  return (
    <>
      <VerifiedSales />
    </>
  );
};

export default indexs;

