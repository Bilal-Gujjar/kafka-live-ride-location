// kafka/producer.js
const kafka = require('kafka-node');

const kafkaClient = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const producer = new kafka.Producer(kafkaClient);

producer.on('ready', () => console.log('Kafka Producer is ready.'));
producer.on('error', (err) => console.error('Producer error:', err));

/**
 * Sends location updates to the Kafka topic.
 * @param {string} topic - Kafka topic name
 * @param {Object} data - { userId, latitude, longitude }
 */
const sendLocationUpdate = (topic, data) => {
  const payloads = [{ topic, messages: JSON.stringify(data) }];
  producer.send(payloads, (err, data) => {
    if (err) console.error('Failed to send location update:', err);
    else console.log('Location update sent:', data);
  });
};

module.exports = sendLocationUpdate;
