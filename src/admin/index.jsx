import React, { useState } from "react";
import { Tabs, Tab, Table, Button, InputGroup, FormControl } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
// import "./CandidateTable.css"; 

const index = () => {
  const [activeTab, setActiveTab] = useState("totalticket");
  const [search, setSearch] = useState("");

  const candidates = [
    { name: "Alberta Flores", status: "Completed", daysInStage: 1 },
    { name: "Brooklyn Simmons", status: "Completed", daysInStage: 1 },
    { name: "Bessie Cooper", status: "In-Progress", daysInStage: 4 },
    { name: "Arlene McCoy", status: "In-Progress", daysInStage: 4 },
    { name: "Floyd Miles", status: "In-Progress", daysInStage: 5 },
    { name: "Kristin Watson", status: "In-Progress", daysInStage: 6 },
    { name: "Esther Howard", status: "In-Progress", daysInStage: 6 },
    { name: "Jerome Bell", status: "In-Progress", daysInStage: 7 },
  ];

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredCandidates = candidates.filter((candidate) =>
    candidate.name.toLowerCase().includes(search.toLowerCase())
  );

  // Inline style for active tab
  const activeTabStyle = {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Shadow effect for active tab
    transition: 'box-shadow 0.3s ease', // Smooth transition for shadow
  };

  return (

    <section className="followup-table-section">
      <div className="container-fluid">

        <div className="container">
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            <Tab
              eventKey="totalticket"
              title="Total Ticket"
              style={activeTab === "totalticket" ? activeTabStyle : {}}
            />
            <Tab
              eventKey="todaytickets"
              title="Today's Ticket"
              style={activeTab === "todaytickets" ? activeTabStyle : {}}
            />
            <Tab
              eventKey="totalsales"
              title="Total Sales"
              style={activeTab === "totalsales" ? activeTabStyle : {}}
            />
            <Tab
              eventKey="preparingforshipment"
              title="Preparing for Shipment"
              style={activeTab === "preparingforshipment" ? activeTabStyle : {}}
            />
            <Tab
              eventKey="awaitingtracking"
              title="Awaiting Tracking"
              style={activeTab === "awaitingtracking" ? activeTabStyle : {}}
            />
            <Tab
              eventKey="newcustomer"
              title="New Customer"
              style={activeTab === "newcustomer" ? activeTabStyle : {}}
            />
            <Tab
              eventKey="existingcustomer"
              title="Existing Customer"
              style={activeTab === "existingcustomer" ? activeTabStyle : {}}
            />
          </Tabs>



          <div className="d-flex justify-content-between align-items-center mb-3">
            <InputGroup className="search-input">
              <FormControl
                placeholder="Search candidate by name or email"
                value={search}
                onChange={handleSearch}
              />
            </InputGroup>
          </div>

          <Table responsive bordered className="candidate-table">
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Name</th>
                <th>Status</th>
                <th>In Stage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((candidate, index) => (
                <tr key={index}>
                  <td><input type="checkbox" /></td>
                  <td>{candidate.name}</td>
                  <td>
                    <span
                      className={`badge status-badge ${candidate.status === "Completed" ? "completed" : "in-progress"
                        }`}
                    >
                      {candidate.status}
                    </span>
                  </td>
                  <td>{candidate.daysInStage} day(s)</td>
                  <td>
                    <Button variant="outline-danger" size="sm" className="action-btn me-2">Reject</Button>
                    <Button variant="outline-primary" size="sm" className="action-btn">Next stage</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </section>
  );
};


export default index
