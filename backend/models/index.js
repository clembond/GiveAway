// ---- backend/models/index.js ----
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './giveaway.sqlite'
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./userModel')(sequelize, Sequelize);
db.Campaign = require('./campaignModel')(sequelize, Sequelize);

db.Campaign.belongsTo(db.User, {
    foreignKey: 'userId',
    as: 'giver'
});

module.exports = db;