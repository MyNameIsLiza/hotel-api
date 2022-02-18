const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Hotel API',
        description: 'Description',
    },
    host: 'localhost:8080',
    schemes: ['http'],
    definitions: {
        surname: 'Tsapyk',
        firstName: 'Yelyzaveta',
        passportNumber: '789456123',
        telephoneNumber: '097-873-8723',

        roomNumber: 555,
        price: 100,
        roomType: 'Luxury'
    }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/allRouters.js'];

/* NOTE: if you use the express Router, you must pass in the
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc);