import { useRef, useEffect, useState } from "react";
import MapView from "@arcgis/core/views/MapView";
import ScaleBar from "@arcgis/core/widgets/ScaleBar";
import Legend from "@arcgis/core/widgets/Legend";
import Map from "@arcgis/core/Map";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

import "./MapComponent.css";

function MapComponent() {
  const url =
    "https://portal.spatial.nsw.gov.au/geoserver/liveTransport/buses/FeatureServer/0/query?f=geojson";
  const mapRef = useRef(null);
  const [layerRendered, setLayerRendered] = useState(false);
  const [layerView, setLayerView] = useState(null);
  const [filter, setFilter] = useState({
    compass: null,
    congestion: null,
    occupancy: null,
  });
  const fields = {
    congestion: "vehicle.congestionLevel",
    compass: "vehicle.position.compass",
    occupancy: "vehicle.occupancyStatus",
  };

  function getPopupTemplate() {
    return {
      title: "Live Busses",
      content: [
        {
          type: "fields",
          fieldInfos: [
            {
              fieldName: "hashId",
              label: "Hash ID",
              visible: true,
              format: null,
            },
            {
              fieldName: "id",
              label: "ID",
              visible: true,
              format: null,
            },
            {
              fieldName: "vehicle.congestionLevel",
              label: "Congestion Level",
              visible: true,
              format: null,
            },
            {
              fieldName: "vehicle.occupancyStatus",
              label: "Occupancy Status",
              visible: true,
              format: null,
            },
            {
              fieldName: "vehicle.position.bearing",
              label: "Position Bearing",
              visible: true,
              format: null,
            },
            {
              fieldName: "vehicle.position.compass",
              label: "Position Compass",
              visible: true,
              format: null,
            },
            {
              fieldName: "vehicle.position.latitude",
              label: "Latitude",
              visible: true,
              format: null,
            },
            {
              fieldName: "vehicle.position.longitude",
              label: "Longitude",
              visible: true,
              format: null,
            },
            {
              fieldName: "vehicle.position.speed",
              label: "Speed",
              visible: true,
              format: null,
            },
            {
              fieldName: "vehicle.timestamp.high",
              label: "Timestamp High",
              visible: true,
              format: null,
            },
            {
              fieldName: "vehicle.timestamp.low",
              label: "Timestamp Low",
              visible: true,
              format: null,
            },
            {
              fieldName: "vehicle.trip.routeId",
              label: "Trip Route ID",
              visible: true,
              format: null,
            },
            {
              fieldName: "vehicle.trip.scheduleRelationship",
              label: "Trip Schedule Relationship",
              visible: true,
              format: null,
            },
            {
              fieldName: "vehicle.trip.tripId",
              label: "Trip ID",
              visible: true,
              format: null,
            },
            {
              fieldName: "vehicle.trip.startDate",
              label: "Trip Start Date",
              visible: true,
              format: null,
            },
            {
              fieldName: "vehicle.trip.startTime",
              label: "Trip Start Time",
              visible: true,
              format: null,
            },
            {
              fieldName: "vehicle.vehicle.id",
              label: "Vehicle ID",
              visible: true,
              format: null,
            },
          ],
        },
      ],
    };
  }

  function handleFilterChange(key, e) {
    setFilter((prevFilter) => {
      let filter = { ...prevFilter };
      filter[key] = e.target.value;
      return filter;
    });
  }

  function clearFilter(key) {
    setFilter((prevFilter) => {
      let filter = { ...prevFilter };
      filter[key] = null;
      return filter;
    });
    let input = document.getElementsByName(key)[0];
    input ? (input.value = null) : null;
  }

  function applyFilters() {
    if (layerView && filter) {
      let query = "";
      // create query
      for (const key in filter) {
        const invalids = ["", null, undefined];
        if (!invalids.includes(filter[key])) {
          let fieldVal = isNaN(Number(filter[key]))
            ? `'${filter[key]}'`
            : Number(filter[key]);
          query += `${fields[key]} = ${fieldVal} and `;
        }
      }
      // remove trailing 'and ' in query
      if (query.length >= 4 && query.slice(-4) === "and ") {
        query = query.slice(0, -4);
      }
      // apply query
      layerView.filter = {
        where: query,
      };
    }
  }

  function clearFilters() {
    for (const key in filter) {
      clearFilter(key);
      filter[key] = null;
      layerView.filter = {
        where: "",
      };
    }
  }

  useEffect(() => {
    if (mapRef.current) {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const popupTemplate = getPopupTemplate();
          // Define the GeoJSON layer
          const geojsonLayer = new FeatureLayer({
            url,
            outFields: "*",
            popupTemplate: popupTemplate,
          });

          const map = new Map({
            basemap: "streets-vector",
            layers: [geojsonLayer],
          });

          const view = new MapView({
            container: mapRef.current,
            map: map,
            center: [151.2099, -33.865143],
            zoom: 10,
          });

          const scalebar = new ScaleBar({
            view: view,
          });

          view.ui.add(scalebar, "bottom-left");

          const legend = new Legend({
            view: view,
          });
          view.ui.add(legend, "top-left");

          view.whenLayerView(geojsonLayer).then((layerView) => {
            layerView.watch("updating", function (value) {
              if (!value) {
                // Once updating property is false, then the layerView is rendered
                setLayerRendered(true);
                setLayerView(layerView);
                // Perform your operations here.
              }
            });
          });
        });
    }
  }, []);
  return (
    <>
      <div className="mapDiv" ref={mapRef}></div>
      {layerRendered && (
        <div className="filterDiv container card">
          <div className="card-body">
            <div className="filters">
              <div className="filter">
                <label className="form-label h6">
                  Congestion level: {filter.congestion}
                </label>
                <div className="row">
                  <input
                    type="range"
                    className="form-range"
                    name="congestion"
                    min="0"
                    max="5"
                    value={filter.congestion || ""}
                    onChange={(e) => handleFilterChange("congestion", e)}
                  />
                </div>
              </div>
              <div className="filter">
                <label className="form-label h6">Position Compass:</label>
                <div className="row">
                  <select
                    name="compass"
                    className="form-select"
                    onChange={(e) => handleFilterChange("compass", e)}
                    value={filter.compass || ""}
                  >
                    <option value="">Select</option>
                    <option value="n">N</option>
                    <option value="ne">NE</option>
                    <option value="e">E</option>
                    <option value="se">SE</option>
                    <option value="s">S</option>
                    <option value="sw">SW</option>
                    <option value="w">W</option>
                    <option value="nw">NW</option>
                  </select>
                </div>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={(e) => applyFilters()}
                >
                  Apply Filters
                </button>
              </div>
              <div className="col">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={(e) => clearFilters()}
                >
                  Clear filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MapComponent;
