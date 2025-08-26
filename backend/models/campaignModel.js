// ---- backend/models/campaignModel.js ----
module.exports = (sequelize, DataTypes) => {
    const Campaign = sequelize.define('Campaign', {
        title: { type: DataTypes.STRING, allowNull: false },
        totalAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
        amountPerWinner: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        numberOfWinners: { type: DataTypes.INTEGER, allowNull: false },
        status: { type: DataTypes.ENUM('Draft', 'Live', 'Completed'), defaultValue: 'Draft' },
        mode: { type: DataTypes.ENUM('Random', 'FCFS'), allowNull: false },
        duration: { type: DataTypes.INTEGER, allowNull: true }
    });
    return Campaign;
};