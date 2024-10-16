import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';

//components
import Cardinfo from '../components/cardinfo';
import FloatingButton from '../components/FloatingButton';



function indexss() {
  const [workTimeData, setWorkTimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchWorkTimeData = async () => {
      try {
        const response = await axiosInstance.get('/attendance/totalWorkTimeBreakOfCloser');
        setWorkTimeData(response.data); // Adjust this based on your API response structure
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkTimeData();
  }, []);

  if (loading) {
    return <div className='text-center'>Loading...</div>;
  }

  if (error) {
    return <div className='text-center'>Error: {error}</div>;
  }


  return (
    <>
      <div className="container-fluid mt-3">
        <Cardinfo />
      </div>

      <div>
        <FloatingButton />
      </div>

      {/* <!-- Tabbed Ticket Table --> */}
      <section className="followup-table-section py-3">
        <div className="container-fluid">
          <div className="table-wrapper tabbed-table">
            <h3 className="title">
              Closer Work and Time
              <span className="d-flex justify-content-end"></span>
            </h3>
            <ul
              className="nav recent-transactions-tab-header nav-tabs"
              id="followUp"
              role="tablist"
            >
            </ul>
            <div className="tab-content recent-transactions-tab-body" id="followUpContent">
              <div className="followups-table table-responsive table-height">
                <table className="table">
                  <thead className="sticky-header">
                    <tr>
                      <th className="text-center" tabIndex="0">User Name</th>
                      <th className="text-center" tabIndex="0">Month</th>
                      <th className="text-center" tabIndex="0">Total Break Time</th>
                      <th className="text-center" tabIndex="0">Total Work Time</th>
                      <th className="text-center" tabIndex="0">Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workTimeData.map((item) => (
                      <tr key={item.id}>
                        <td className="text-center"><span className="text">{item.userName}</span></td>
                        <td className="text-center"><span className="text">{item.month}</span></td>
                        <td className="text-center"><span className="text">{item.totalBreakTime}</span></td>
                        <td className="text-center"><span className="text">{item.totalWorkTime}</span></td>
                        <td className="text-center"><span className="text">{item.year}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>


    </>
  );
}


export default indexss