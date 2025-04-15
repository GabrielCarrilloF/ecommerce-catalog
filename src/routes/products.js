// src/routes/products.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const { sendEvent } = require('../services/kafkaProducer');

const FAKE_API_URL = 'https://fakestoreapi.com/products';

router.get('/', async (req, res) => {
  try {
    const response = await axios.get(FAKE_API_URL);
    const products = response.data;
    
    const event = {
      eventId: `evt_${Date.now()}`,
      timestamp: new Date().toISOString(),
      source: 'ProductSeeder',
      topic: 'ProductCreated',
      payload: {
        catalog: products
      },
      snapshot: {
        catalog: products
      }
    };
    await sendEvent('ProductCreated', event);
    
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'No se pudieron obtener los productos.' });
  }
});

router.get('/search/byId/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(FAKE_API_URL);
    const products = response.data;
    const product = products.find(p => p.id == id);
    
    const event = {
      eventId: `evt_${Date.now()}`,
      timestamp: new Date().toISOString(),
      source: 'ProductService',
      topic: 'ProductSearchById',
      payload: { id },
      snapshot: { result: product }
    };
    await sendEvent('ProductSearchById', event);
    
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error buscando producto por ID:', error);
    res.status(500).json({ error: 'Error en la búsqueda de producto.' });
  }
});

router.get('/search/byName', async (req, res) => {
  try {
    const { name } = req.query;
    const response = await axios.get(FAKE_API_URL);
    const products = response.data;
    
    const filtered = products.filter(p => p.title.toLowerCase().includes(name.toLowerCase()));
    
   
    const event = {
      eventId: `evt_${Date.now()}`,
      timestamp: new Date().toISOString(),
      source: 'ProductService',
      topic: 'ProductSearchByName',
      payload: { name },
      snapshot: { result: filtered }
    };
    await sendEvent('ProductSearchByName', event);
    
    res.json(filtered);
  } catch (error) {
    console.error('Error buscando producto por nombre:', error);
    res.status(500).json({ error: 'Error en la búsqueda de producto.' });
  }
});

router.get('/search/byCategory/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const response = await axios.get(FAKE_API_URL);
    const products = response.data;
    const filtered = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    
    
    const event = {
      eventId: `evt_${Date.now()}`,
      timestamp: new Date().toISOString(),
      source: 'ProductService',
      topic: 'ProductSearchByCategory',
      payload: { category },
      snapshot: { result: filtered }
    };
    await sendEvent('ProductSearchByCategory', event);
    
    res.json(filtered);
  } catch (error) {
    console.error('Error buscando productos por categoría:', error);
    res.status(500).json({ error: 'Error en la búsqueda de productos.' });
  }
});

module.exports = router;
