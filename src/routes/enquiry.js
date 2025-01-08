const { getDb } = require('../db/db');

// Validation helpers
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isNotEmpty = (field) => field && field.trim().length > 0;
const isMessageValid = (message) => message.length <= 500;

const enquiryRoutes = async (fastify) => {
  fastify.post('/enquiry', async (request, reply) => {
    const { name, email, message } = request.body;
    const db = getDb();

    // Validate input
    if (!isNotEmpty(name)) {
      return reply.status(400).send({ error: 'Name is required and cannot be empty.' });
    }
    if (!isValidEmail(email)) {
      return reply.status(400).send({ error: 'Invalid email address.' });
    }
    if (!isNotEmpty(message)) {
      return reply.status(400).send({ error: 'Message is required and cannot be empty.' });
    }
    if (!isMessageValid(message)) {
      return reply.status(400).send({ error: 'Message must not exceed 500 characters.' });
    }

    try {
      // Check if the same email has submitted within 24 hours
      const existingEnquiry = await db.get(
        `SELECT * FROM enquiries WHERE email = ? AND created_at >= datetime('now', '-1 day')`,
        [email]
      );

      if (existingEnquiry) {
        return reply
          .status(429)
          .send({ error: 'An enquiry from this email has already been submitted within the last 24 hours.' });
      }

      // Insert the enquiry into the database
      await db.run(
        `INSERT INTO enquiries (name, email, message) VALUES (?, ?, ?)`,
        [name, email, message]
      );

      reply.status(201).send({ message: 'Enquiry submitted successfully.' });
    } catch (err) {
      fastify.log.error(err);
      reply.status(500).send({ error: 'An unexpected error occurred.' });
    }
  });
};

module.exports = enquiryRoutes;
