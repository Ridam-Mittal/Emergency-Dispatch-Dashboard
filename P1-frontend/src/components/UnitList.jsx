import { useEffect, useState } from "react";
import { getUnits } from "../api";
import UnitItem from "./UnitItem";

const UnitList = () => {
  const [units, setUnits] = useState([]);

  useEffect(() => {
    fetchUnits();
    const i = setInterval(fetchUnits, 5000);
    return () => clearInterval(i);
  }, []);

  const fetchUnits = async () => {
    const res = await getUnits();
    setUnits(res || []);
  };

  return (
    <div className="list-wrapper">
      {!units.length && (
        <p className="empty-text">No units found</p>
      )}

      {units.map((u) => (
        <UnitItem key={u._id} unit={u} />
      ))}
    </div>
  );
};

export default UnitList;
