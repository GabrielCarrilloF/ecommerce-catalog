const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://fakestoreapi.com/products');
    res.json(response.data);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'No se pudieron obtener los productos.' });
  }
});

module.exports = router;
