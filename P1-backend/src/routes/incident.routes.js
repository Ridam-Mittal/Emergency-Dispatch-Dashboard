import { Router } from 'express';
import { createIncidentController, getIncidentNearestUnitsController, getIncidentsController, resolveIncidentController
, dispatchNearestUnitController
 } from '../controllers/incident.controller.js';

const router = Router();

router.post('/',  createIncidentController);

router.get('/', getIncidentsController);

router.get('/:id/nearest-units', getIncidentNearestUnitsController);

router.patch('/:id/dispatch', dispatchNearestUnitController);


router.patch("/:id/resolve", resolveIncidentController);

export default router;