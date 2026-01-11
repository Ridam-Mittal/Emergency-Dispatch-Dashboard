import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { getIncidentIcon, getUnitIcon } from "../utils/mapConfig";
import { useEffect, useState } from "react";
import L from "leaflet";
import { getDashboardData } from "../api";

// Fix leaflet default icon bug
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const MapView = ({ selectedIncident }) => {
  const [incidents, setIncidents] = useState([]);
  const [units, setUnits] = useState([]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      // console.log("🔄 Fetching dashboard data...");

      const { incidents, units } = await getDashboardData();

      // console.log("✅ INCIDENTS:", incidents);
      // console.log("✅ UNITS:", units);

      setIncidents(incidents);
      setUnits(units);
    } catch (err) {
      console.error("❌ Map fetch error:", err);
    }
  };

  return (
    <MapContainer
      center={
        incidents.length
          ? [
              incidents[0].location.coordinates[1],
              incidents[0].location.coordinates[0],
            ]
          : [12.9716, 77.5946]
      }
      zoom={12}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* INCIDENTS */}
      {incidents.map((i) => (
        <Marker
          key={i._id}
          position={[
            i.location.coordinates[1],
            i.location.coordinates[0],
          ]}
          icon={getIncidentIcon(i.severity)}
          zIndexOffset={1000}
        >
          <Popup>
            <b>{i.description}</b>
            <br />
            Severity: {i.severity}
          </Popup>
        </Marker>
      ))}

      {/* UNITS */}
      {units.map((u) => (
        <Marker
          key={u._id}
          position={[
            u.location.coordinates[1],
            u.location.coordinates[0],
          ]}
          icon={getUnitIcon(u.unitType)}
        >
          <Popup>
            <b>{u.unitName}</b>
            <br />
            Status: {u.status}
          </Popup>
        </Marker>
      ))}

      {/* CENTER ON SELECTED */}
      {selectedIncident && (
        <CenterMap
          lat={selectedIncident.location.coordinates[1]}
          lng={selectedIncident.location.coordinates[0]}
        />
      )}
    </MapContainer>
  );
};

export default MapView;

/* Helper */

const CenterMap = ({ lat, lng }) => {
  const map = useMap();

  useEffect(() => {
    console.log("🎯 Centering map:", lat, lng);
    map.flyTo([lat, lng], 15, { duration: 1.2 });
  }, [lat, lng]);

  return null;
};
