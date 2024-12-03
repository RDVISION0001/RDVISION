import React, { useState, useEffect } from "react";
import { Tabs, Tab, Table, InputGroup, FormControl } from "react-bootstrap";
import axiosInstance from "../axiosInstance"; // Assuming axiosInstance is configured

const Index = () => {
  const [activeTab, setActiveTab] = useState("totalticket");
  const [search, setSearch] = useState("");
  const [tickets, setTickets] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Fetch data when the tab changes
  useEffect(() => {
    if (activeTab === "totalticket") {
      axiosInstance.get(`/third_party_api/ticket/getAllNewTickets`)
        .then((response) => {
          setTickets(response.data);
        })
        .catch((error) => {
          console.error("Error fetching tickets:", error);
        });
    } else if (activeTab === "existingcustomer") {
      axiosInstance.get(`/customers/getAll`)
        .then((response) => {
          setCustomers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching customers:", error);
        });
    }
  }, [activeTab]);

  // Search logic
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Filtered data for tickets
  const filteredTickets = tickets.filter((ticket) =>
    ticket.senderName?.toLowerCase().includes(search.toLowerCase()) ||
    ticket.senderEmail?.toLowerCase().includes(search.toLowerCase())
  );

  // Filtered data for customers
  const filteredCustomers = customers.filter((customer) =>
    customer.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    customer.customerEmail?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="followup-table-section">
      <div className="container-fluid">
        <div className="container">
          {/* Tabs */}
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            <Tab eventKey="totalticket" title="Total Ticket" />
            <Tab eventKey="todaytickets" title="Today Tickets" />
            <Tab eventKey="totalsales" title="Total Sales" />
            <Tab eventKey="todaysales" title="Today Sales" />
            <Tab eventKey="preparingforshipment" title="Preparing for Shipment" />
            <Tab eventKey="awaitingtracking" title="Awaiting Tracking" />
            <Tab eventKey="existingcustomer" title="Existing Customer" />

          </Tabs>



          <div className="d-flex justify-content-between align-items-center mb-3">
            <InputGroup className="search-input">
              <FormControl
                placeholder={`Search ${activeTab === "existingcustomer" ? "customers" : "tickets"} by name or email`}
                value={search}
                onChange={handleSearch}
              />
            </InputGroup>
          </div>

          {/* Table Rendering */}
          {activeTab === "totalticket" && (
            <Table responsive bordered className="candidate-table">
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>Date</th>
                  <th>Customer Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Product Name</th>
                  <th>Query Type</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket, index) => (
                  <tr key={ticket.uniqueQueryId || index}>
                    <td><input type="checkbox" /></td>
                    <td>{ticket.queryTime}</td>
                    <td>{ticket.senderName}</td>
                    <td>{ticket.senderEmail}</td>
                    <td>{ticket.senderMobile}</td>
                    <td>{ticket.queryProductName}</td>
                    <td>{ticket.queryType}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {activeTab === "existingcustomer" && (
            <Table responsive bordered className="candidate-table">
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>Customer ID</th>
                  <th>Customer Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Country</th>
                  <th>Customer Type</th>
                  <th>Ticket ID</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.customerId}>
                    <td><input type="checkbox" /></td>
                    <td>{customer.customerId}</td>
                    <td>{customer.customerName}</td>
                    <td>{customer.customerEmail}</td>
                    <td>{customer.customerMobile}</td>
                    <td>{customer.country}</td>
                    <td>{customer.customerType}</td>
                    <td>{customer.ticketId}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </div>
    </section>
  );
};

export default Index;
