import React, { useEffect, useState } from 'react';
import axiosInstance from "../axiosInstance";
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaFileInvoice, FaMoneyBillWave, FaClock, FaDollarSign, FaBox, FaBalanceScale, FaChartLine } from 'react-icons/fa'; // Icons for cards

Chart.register(...registerables);

function ReportSA() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1)); // Start of current month
  const [toDate, setToDate] = useState(new Date()); // Current date
  const [metrics, setMetrics] = useState({
    totalGeneratedInvoices: 0,
    totalPaidInvoices: 0,
    totalAmountPaid: 0,
    totalAmountPending: 0,
    totalGoodsCost: 0,
    totalPendingInvoices: 0,
    netIncome: 0,
  });

  useEffect(() => {
    fetchChartData();
  }, [fromDate, toDate]); // Re-fetch data whenever fromDate or toDate changes

  const fetchChartData = () => {
    setLoading(true);

    // Prepare payload for POST API
    const payload = {
      fromDate: fromDate.toISOString().split('T')[0], // Format as "YYYY-MM-DD"
      toDate: toDate.toISOString().split('T')[0], // Format as "YYYY-MM-DD"
    };

    // Always use POST API
    axiosInstance.post('/invoice/getDailyInvoiceSummery', payload)
      .then((response) => {
        console.log('API Response:', response.data);
        const dtoList = response.data.dtoList;

        if (!dtoList || dtoList.length === 0) {
          console.warn('No data found for the selected date range.');
          setChartData(null); // Set chartData to null if no data is found
          setLoading(false);
          return;
        }

        // Map the dates into "YYYY-MM-DD" format
        const labels = dtoList.map(item => {
          const [year, month, day] = item.date;
          return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        });

        // Define colors for cards and graph
        const colors = {
          totalGeneratedInvoices: { card: 'linear-gradient(135deg, #3e95cd, #4aa3d6)', graph: '#3e95cd' },
          totalPaidInvoices: { card: 'linear-gradient(135deg, #8e5ea2, #9a6aad)', graph: '#8e5ea2' },
          totalAmountPaid: { card: 'linear-gradient(135deg, #3cba9f, #48c7ad)', graph: '#3cba9f' },
          totalAmountPending: { card: 'linear-gradient(135deg, #e8c3b9, #f0d1c8)', graph: '#e8c3b9' },
          netIncome: { card: 'linear-gradient(135deg, #c45850, #d0665e)', graph: '#c45850' },
          totalGoodsCost: { card: 'linear-gradient(135deg, #FFD700, #FFDF00)', graph: '#FFD700' },
          totalPendingInvoices: { card: 'linear-gradient(135deg, #6c757d, #7a8289)', graph: '#6c757d' },
        };

        // Build datasets for each metric using dtoList
        const newData = {
          labels,
          datasets: [
            {
              label: 'Total Generated Invoices',
              data: dtoList.map(item => item.totalGeneratedInvoices),
              borderColor: colors.totalGeneratedInvoices.graph,
              fill: false,
            },
            {
              label: 'Total Paid Invoices',
              data: dtoList.map(item => item.totalPaidInvoices),
              borderColor: colors.totalPaidInvoices.graph,
              fill: false,
            },
            {
              label: 'Total Amount Paid',
              data: dtoList.map(item => item.totalAmountPaid),
              borderColor: colors.totalAmountPaid.graph,
              fill: false,
            },
            {
              label: 'Total Amount Pending',
              data: dtoList.map(item => item.totalAmountPending),
              borderColor: colors.totalAmountPending.graph,
              fill: false,
            },
            {
              label: 'Total Goods Cost',
              data: dtoList.map(item => item.totalGoodsCost),
              borderColor: colors.totalGoodsCost.graph,
              fill: false,
            },
            {
              label: 'Total Pending Invoices',
              data: dtoList.map(item => item.totalPendingInvoices),
              borderColor: colors.totalPendingInvoices.graph,
              fill: false,
            },
            {
              label: 'Net Income',
              data: dtoList.map(item => item.netIncome),
              borderColor: colors.netIncome.graph,
              fill: false,
            },
          ]
        };

        // Calculate totals for metrics
        const totals = dtoList.reduce((acc, item) => {
          acc.totalGeneratedInvoices += item.totalGeneratedInvoices;
          acc.totalPaidInvoices += item.totalPaidInvoices;
          acc.totalAmountPaid += item.totalAmountPaid;
          acc.totalAmountPending += item.totalAmountPending;
          acc.totalGoodsCost += item.totalGoodsCost;
          acc.totalPendingInvoices += item.totalPendingInvoices;
          acc.netIncome += item.netIncome;
          return acc;
        }, {
          totalGeneratedInvoices: 0,
          totalPaidInvoices: 0,
          totalAmountPaid: 0,
          totalAmountPending: 0,
          totalGoodsCost: 0,
          totalPendingInvoices: 0,
          netIncome: 0,
        });

        setMetrics(totals);
        setChartData(newData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching report:', error);
        setChartData(null); // Set chartData to null in case of an error
        setLoading(false);
      });
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Sales CRM Report' }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          parser: 'yyyy-MM-dd',
          unit: 'day',
          displayFormats: { day: 'yyyy-MM-dd' }
        },
        title: { display: true, text: 'Date' }
      },
      y: {
        title: { display: true, text: 'Value' }
      }
    }
  };

  return (
    <section className="followup-table-section py-3">
      <div className="container-fluid">
        <div className="row">
          {/* Cards Section */}
          <div className="col-md-10 mb-1">
            <div className="card">
              <div className="card-body">
                <div className="d-flex flex-row flex-nowrap overflow-auto">
                  {/* Card 1: Total Generated Invoices */}
                  <div className="card text-white me-2" style={{ minWidth: '210px', background: 'linear-gradient(135deg, #3e95cd, #4aa3d6)' }}>
                    <div className="card-body p-2 d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="card-title mb-1">Generated Invoices</h6>
                        <p className="card-text mb-0">{metrics.totalGeneratedInvoices}</p>
                      </div>
                      <FaFileInvoice size={24} />
                    </div>
                  </div>

                  {/* Card 2: Total Paid Invoices */}
                  <div className="card text-white me-2" style={{ minWidth: '210px', background: 'linear-gradient(135deg, #8e5ea2, #9a6aad)' }}>
                    <div className="card-body p-2 d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="card-title mb-1">Paid Invoices</h6>
                        <p className="card-text mb-0">{metrics.totalPaidInvoices}</p>
                      </div>
                      <FaMoneyBillWave size={24} />
                    </div>
                  </div>

                  {/* Card 3: Total Amount Paid */}
                  <div className="card text-white me-2" style={{ minWidth: '210px', background: 'linear-gradient(135deg, #3cba9f, #48c7ad)' }}>
                    <div className="card-body p-2 d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="card-title mb-1">Amount Paid</h6>
                        <p className="card-text mb-0">${metrics.totalAmountPaid.toFixed(2)}</p>
                      </div>
                      <FaDollarSign size={24} />
                    </div>
                  </div>

                  {/* Card 4: Total Amount Pending */}
                  <div className="card text-white me-2" style={{ minWidth: '210px', background: 'linear-gradient(135deg, #e8c3b9, #f0d1c8)' }}>
                    <div className="card-body p-2 d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="card-title mb-1">Amount Pending</h6>
                        <p className="card-text mb-0">${metrics.totalAmountPending.toFixed(2)}</p>
                      </div>
                      <FaClock size={24} />
                    </div>
                  </div>

                  {/* Card 5: Total Goods Cost */}
                  <div className="card text-white me-2" style={{ minWidth: '210px', background: 'linear-gradient(135deg, #FFD700, #FFDF00)' }}>
                    <div className="card-body p-2 d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="card-title mb-1">Goods Cost</h6>
                        <p className="card-text mb-0">${metrics.totalGoodsCost.toFixed(2)}</p>
                      </div>
                      <FaBox size={24} />
                    </div>
                  </div>

                  {/* Card 6: Total Pending Invoices */}
                  <div className="card text-white me-2" style={{ minWidth: '210px', background: 'linear-gradient(135deg, #6c757d, #7a8289)' }}>
                    <div className="card-body p-2 d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="card-title mb-1">Pending Invoices</h6>
                        <p className="card-text mb-0">{metrics.totalPendingInvoices}</p>
                      </div>
                      <FaBalanceScale size={24} />
                    </div>
                  </div>

                  {/* Card 7: Net Income */}
                  <div className="card text-white me-2" style={{ minWidth: '210px', background: 'linear-gradient(135deg, #c45850, #d0665e)' }}>
                    <div className="card-body p-2 d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="card-title mb-1">Net Income</h6>
                        <p className="card-text mb-0">${metrics.netIncome.toFixed(2)}</p>
                      </div>
                      <FaChartLine size={24} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Graph Section */}
          <div className="col-md-10">
            <div className="card">
              <div className="card-body">
                {/* Date Pickers */}
                <div className="row mb-3">
                  <div className="col-md-3">
                    <label>From Date</label>
                    <DatePicker
                      selected={fromDate}
                      onChange={(date) => setFromDate(date)}
                      dateFormat="yyyy-MM-dd"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-3">
                    <label>To Date</label>
                    <DatePicker
                      selected={toDate}
                      onChange={(date) => setToDate(date)}
                      dateFormat="yyyy-MM-dd"
                      className="form-control"
                    />
                  </div>
                </div>

                {/* Chart */}
                {loading ? (
                  <p className='text-center'>Loading...</p>
                ) : chartData ? (
                  <Line data={chartData} options={options} />
                ) : (
                  <p className='text-center'>No data available for the selected date range.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReportSA;