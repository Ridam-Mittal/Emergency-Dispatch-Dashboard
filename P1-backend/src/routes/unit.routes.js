import { Router } from 'express';
import { createUnitController, getAllUnitsController, updateUnitLocationController } from '../controllers/unit.controller.js';

const router = Router();

// a route to register a unit into the system
router.post('/register', createUnitController);

router.get('/all', getAllUnitsController);

router.patch('/:id/location', updateUnitLocationController);


export default router;