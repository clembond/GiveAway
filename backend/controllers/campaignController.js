// ---- backend/controllers/campaignController.js ----
const db = require('../models');
const Campaign = db.Campaign;

exports.createCampaign = async (req, res) => {
    try {
        const { totalAmount, amountPerWinner, mode, duration, title } = req.body;
        const numberOfWinners = Math.floor(totalAmount / amountPerWinner);
        const campaign = await Campaign.create({
            title, totalAmount, amountPerWinner, numberOfWinners, mode,
            duration: mode === 'Random' ? duration : null,
            userId: req.userId
        });
        res.status(201).send(campaign);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.getUserCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.findAll({ where: { userId: req.userId } });
        res.status(200).send(campaigns);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};