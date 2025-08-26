// ---- backend/server.js ----
const express = require('express');
const cors = require('cors');
const db = require('./models');
const userRoutes = require('./routes/userRoutes');
const campaignRoutes = require('./routes/campaignRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/campaigns', campaignRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the GiveAway API.' });
});

db.sequelize.sync().then(() => {
    console.log('Database synced successfully.');
}).catch(err => {
    console.error('Failed to sync database:', err.message);
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
