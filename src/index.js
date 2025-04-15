const express = require('express');
const app = express();
const productsRouter = require('./routes/products');

app.use(express.json());
app.use('/api/products', productsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});