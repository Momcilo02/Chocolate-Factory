const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./Routes/UserRoutes');
const factoryRoutes = require('./Routes/FactoryRoutes');
const purchaseRoutes = require('./Routes/PurchaseRoutes');
const commentRoutes = require('./Routes/CommentRoutes');

const app = express();
const port = process.env.PORT || 4000;


app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

app.use('/users', userRoutes);
app.use('/factories', factoryRoutes);
app.use('/purchases', purchaseRoutes);
app.use('/comments', commentRoutes);

app.get('/', (req, res) => {
    res.send('Radi server');
});

app.listen(port, () => {
    console.log(`Server je pokrenut na http://localhost:${port}`);
});
