// kafka/consumer.js
const kafka = require('kafka-node');
const kafkaClient = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });

const consumer = new kafka.Consumer(
  kafkaClient,
  [{ topic: 'location-updates', partition: 0 }],
  { autoCommit: true }
);

consumer.on('error', (err) => console.error('Consumer error:', err));

module.exports = consumer;
