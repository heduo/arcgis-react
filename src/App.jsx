import React, { useRef, useEffect } from "react";
import MapView from "@arcgis/core/views/MapView";
import ScaleBar from "@arcgis/core/widgets/ScaleBar";
import Legend from "@arcgis/core/widgets/Legend";
import WebMap from "@arcgis/core/WebMap";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

import "./App.css";

function App() {
  const mapDiv = useRef(null);

  useEffect(() => {
    if (mapDiv.current) {
      fetch(
        "https://portal.spatial.nsw.gov.au/geoserver/liveTransport/buses/FeatureServer/0/query?f=geojson"
      )
        .then((response) => response.json())
        .then((data) => {
          const popupTemplate = {
            // autocasts as new PopupTemplate()
            title: "Live Bus",
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
                    label: "Trip Trip ID",
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
          // Define the GeoJSON layer
          const geojsonLayer = new FeatureLayer({
            url: "https://portal.spatial.nsw.gov.au/geoserver/liveTransport/buses/FeatureServer/0/query?f=geojson",
            outFields: [
              "hashId",
              "id",
              "vehicle.congestionLevel",
              "vehicle.occupancyStatus",
              "vehicle.position.bearing",
              "vehicle.position.compass",
              "vehicle.position.latitude",
              "vehicle.position.longitude",
              "vehicle.position.speed",
              "vehicle.timestamp.high",
              "vehicle.timestamp.low",
              "vehicle.trip.routeId",
              "vehicle.trip.scheduleRelationship",
              "vehicle.trip.startDate",
              "vehicle.trip.startTime",
              "vehicle.trip.tripId",
              "vehicle.vehicle.id",
            ],
            popupTemplate: popupTemplate,
          });

          /**
           * Initialize map
           */
          const webmap = new WebMap({
            basemap: "streets-vector",
          });

          const view = new MapView({
            container: mapDiv.current,
            map: webmap,
            center: [151.2099, -33.865143],
            zoom: 10,
          });

          webmap.add(geojsonLayer);

          const scalebar = new ScaleBar({
            view: view,
          });

          view.ui.add(scalebar, "bottom-left");

          const legend = new Legend({
            view: view,
          });
          view.ui.add(legend, "top-left");
        });
    }
  }, []);

  return (
      <div className="mapDiv" ref={mapDiv}></div>
  );
}

export default App;
