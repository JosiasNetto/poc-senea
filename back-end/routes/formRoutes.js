import express from 'express';
import FormController from '../controllers/FormController.js';

const router = express.Router();
const formController = new FormController();

// POST /forms - Create a new form
router.post('/', formController.createForm);

export default router;
