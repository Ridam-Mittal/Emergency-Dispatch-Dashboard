import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const BASE = `${process.env.BACKEND_URL}/api/units`;

const randomShift = () => (Math.random() - 0.5) * 0.001;

async function moveUnits() {
  const { data } = await axios.get(`${BASE}/all`);

  for (let u of data.units) {
    const [lng, lat] = u.location.coordinates;

    await axios.patch(`${BASE}/${u._id}/location`, {
      coordinates: [
        lng + randomShift(),
        lat + randomShift(),
      ],
    });

    console.log("Moved:", u.unitName);
  }
}

setInterval(moveUnits, 4000);
