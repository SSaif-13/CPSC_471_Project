import express from 'express';
import {
  getAllEmissions,
  getEmissionsByYear,
  getEmissionsByCountry,
  compareYears,
  compareCountries,
  getByCountryAndYear
} from '../controllers/emissions.js';
import {
  createUser,
  setPassword,
  verifySignIn,
  deleteUser,
  getUserType
} from '../controllers/users.js';
import {
  recordDonation,
  getDonationHistory,
  recordFootprint,
  getFootprint
} from '../controllers/activities.js';

const router = express.Router();

// Emissions data routes
router.get('/emissions', getAllEmissions);
router.get('/emissions/year/:year', getEmissionsByYear);
router.get('/emissions/country/:country', getEmissionsByCountry);
router.get('/emissions/compare/years', compareYears);
router.get('/emissions/compare/countries', compareCountries);
router.get('/emissions/:country/:year', getByCountryAndYear);

// User routes
router.post('/users', createUser);
router.post('/users/password', setPassword);
router.post('/users/signin', verifySignIn);
router.delete('/users/:userId', deleteUser);
router.get('/users/:userId/type', getUserType);

// Activity routes
router.post('/donations', recordDonation);
router.get('/donations/:userId', getDonationHistory);
router.post('/footprint', recordFootprint);
router.get('/footprint/:userId', getFootprint);




export default router;