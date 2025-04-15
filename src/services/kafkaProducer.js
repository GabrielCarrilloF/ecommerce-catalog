// src/services/kafkaProducer.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'ecommerce-catalog',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

async function sendEvent(topic, event) {
  try {
    await producer.connect();
    await producer.send({
      topic,
      messages: [
        { value: JSON.stringify(event) },
      ],
    });
    console.log(`Evento enviado al tópico ${topic}:`, event);
  } catch (error) {
    console.error('Error al enviar evento a Kafka:', error);
  } finally {
    await producer.disconnect();
  }
}

module.exports = { sendEvent };
