import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import MapView from "./components/MapView";
import parseKML from "./utils/parseKML";
import * as turf from "@turf/turf";
import "./App.css";

const App = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [details, setDetails] = useState(null);

  const handleFileUpload = async (file) => {
    try {
      const geoJson = await parseKML(file);
      setGeoJsonData(geoJson);
      generateSummary(geoJson);
    } catch (error) {
      console.error("Error parsing KML file:", error);
    }
  };

  const generateSummary = (geoJson) => {
    const elementCounts = {};
    geoJson.features.forEach((feature) => {
      const type = feature.geometry.type;
      elementCounts[type] = (elementCounts[type] || 0) + 1;
    });
    setSummary(elementCounts);
  };

  const handleShowDetails = () => {
    if (!geoJsonData) return;
    const lengths = {};
    geoJsonData.features.forEach((feature) => {
      const type = feature.geometry.type;
      if (type === "LineString" || type === "MultiLineString") {
        lengths[type] = (lengths[type] || 0) + turf.length(feature, { units: "kilometers" });
      }
    });
    setDetails(lengths);
  };

  return (
    <div className="App">
      <h1>KML File Parser</h1>
      <FileUpload onFileUpload={handleFileUpload} />
      {summary && (
        <div>
          <h2>Summary</h2>
          <table>
            <thead>
              <tr>
                <th>Element Type</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(summary).map(([type, count]) => (
                <tr key={type}>
                  <td>{type}</td>
                  <td>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button onClick={handleShowDetails}>Show Detailed Information</button>
      {details && (
        <div>
          <h2>Detailed Information</h2>
          <table>
            <thead>
              <tr>
                <th>Element Type</th>
                <th>Total Length (km)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(details).map(([type, length]) => (
                <tr key={type}>
                  <td>{type}</td>
                  <td>{length.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <MapView geoJsonData={geoJsonData} />
    </div>
  );
};

export default App;