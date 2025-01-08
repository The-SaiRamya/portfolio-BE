const fastify = require('fastify')({ logger: true });
const { initDb } = require('./db/db');
const enquiryRoutes = require('./routes/enquiry');

const startApp = async () => {
  try {
    // Initialize the database
    await initDb();

    // Register enquiry routes
    fastify.register(enquiryRoutes);

    // Start the server
    await fastify.listen({ port: 3002 });
    console.log('Server is running at http://localhost:3002');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startApp();
