import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from "../axiosInstance";

const TrackPackage = (props) => {
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tracking information
  const fetchApi = async () => {
    try {
      const response = await axiosInstance.get(`/auth/track/${props.trackingNumber}`);
      setPackageData(response.data.data.accepted[0]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApi();
  }, [props.trackingNumber]);
console.log(props.trackingNumber)
  // Function to map stage key to colors
  const getStageColor = (keyStage) => {
    switch (keyStage) {
      case "InfoReceived":
        return "bg-info"; // Light blue for "Accepted"
      case "PickedUp":
        return "bg-primary"; // Blue for "Dispatched"
      case "Departure":
        return "bg-warning"; // Yellow for "In Transit"
      case "Out for Delivery":
        return "bg-success"; // Green for "Out for Delivery"
      case "Delivered":
        return "bg-success"; // Dark for "Delivered"
      case "Failed Attempt":
        return "bg-danger"; // Red for "Failed Attempt"
      case "Held at Customs":
        return "bg-secondary"; // Grey for "Held at Customs"
      default:
        return "bg-danger"; // Light grey for unknown or default stages
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <p className="text-danger">Error: {error}</p>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="container mt-5 text-center">
        <p>No tracking information available.</p>
      </div>
    );
  }

  const { number, track_info } = packageData;
  const provider = track_info?.tracking?.providers?.[0]?.provider || {};
  const latest_status = track_info?.latest_status || {};
  const latest_event = track_info?.latest_event || {};
  const milestone = track_info?.milestone || [];

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5>Package Tracking Information</h5>
        </div>
        <div className="card-body">
          <h6>Tracking Number: <strong>{number}</strong></h6>
          <h6>Carrier: <strong>{provider.name || "Unknown"} ({provider.country || "N/A"})</strong></h6>

          <hr />

          <h5>Latest Status</h5>
          <p><strong>Status: </strong>{latest_status.status || "Status not available"}</p>
          <p><strong>Sub-status: </strong>{latest_status.sub_status || "N/A"}</p>
          {latest_event.time_iso ? (
            <>
              <p><strong>Last Update: </strong>{latest_event.description || "No description"}</p>
              <p><strong>Last Updated Time: </strong>{new Date(latest_event.time_iso).toLocaleString()}</p>
            </>
          ) : (
            <p>No recent updates available.</p>
          )}

          <hr />

          <h5 className="mb-3">Tracking Milestones</h5>
          {milestone.length > 0 ? (
            <div className="tracking-steps position-relative">
              {milestone.map((stage, index) => (
                <div key={index} className="tracking-step d-flex align-items-start">
                  <div className="step-circle-container">
                    <div className={`step-circle ${getStageColor(stage.key_stage)} ${index === milestone.length - 1 ? 'active' : ''}`}>
                      {index + 1}
                    </div>
                    {index < milestone.length - 1 && <div className="step-line"></div>}
                  </div>
                  <div className="step-details">
                    <h6>{stage.key_stage || "Unknown Stage"}</h6>
                    <p>{stage.description || "No description"} <small>at {stage.location || "N/A"}</small></p>
                    <p className="text-muted">{stage.time_iso ? new Date(stage.time_iso).toLocaleString() : "Time not available"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No milestones available.</p>
          )}

        </div>
      </div>
    </div>
  );
};

export default TrackPackage;
