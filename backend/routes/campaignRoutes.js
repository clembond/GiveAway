// ---- backend/routes/campaignRoutes.js ----
const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const authMiddleware = require('../middleware/authMiddleware');
router.post('/', authMiddleware, campaignController.createCampaign);
router.get('/', authMiddleware, campaignController.getUserCampaigns);
module.exports = router;