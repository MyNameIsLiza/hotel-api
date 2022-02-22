const Client = require('../models/clientModel');
const {ObjectId} = require("mongodb");
const {sendError, sendResult, getClientById, getAllClients, filterData} = require('./baseController');

module.exports = {
    addClient: async (req, res) => {
        console.log("addClient");
        try {
            const client = new Client(req.body);
            await client.save();
            sendResult(res, 'Success', {...client._doc});
        } catch (error) {
            sendError(res, 400, `Bad request! ${error}`)
        }
    },
    editClient: async (req, res) => {
        console.log("editClient");
        try {
            let newClient = {...req.body};
            newClient._id = new ObjectId(req.body._id);
            let client = await getClientById(req.body._id);
            if (client) {
                Object.entries(client._doc).forEach(([key, value]) => {
                    client[key] = newClient[key] ?? value;
                })
                await Client.replaceOne({_id: new ObjectId(req.body._id)}, client);
                sendResult(res, 'Success', {
                    ...client._doc
                });
            } else {
                sendError(res, 400, 'Client is missing')
            }
        } catch (error) {
            sendError(res, 400, `Bad request! ${error}`)
        }
    },
    getClients: async (req, res) => {
        console.log("getClients");
        try {
            const clients = await getAllClients();
            console.log(clients);
            if (clients.length) {
                sendResult(res, 'Success', clients.map((client) => {
                    return {
                        ...client._doc
                    }
                }));
            } else {
                sendError(res, 400, 'Clients are missing')
            }
        } catch (error) {
            sendError(res, 400, `Bad request! ${error}`)
        }
    },
    getClient: async (req, res) => {
        console.log("getClient");
        try {
            const client = await getClientById(req.params.id);
            if (client) {
                sendResult(res, 'Success', {
                    ...client._doc
                });
            } else {
                sendError(res, 400, 'Client is missing')
            }
        } catch (error) {
            sendError(res, 400, `Bad request! ${error}`)
        }
    },
    deleteClient: async (req, res) => {
        console.log("deleteClient");
        try {
            const client = await getClientById(req.params.id);
            if (client) {
                await client.remove();
                sendResult(res, 'Success', {
                    ...client._doc
                });
            } else {
                sendError(res, 400, 'Client is missing')
            }
        } catch (error) {
            sendError(res, 400, `Bad request! ${error}`)
        }
    },
    searchClients: async (req, res) => {
        console.log("searchClients");
        try {
            let clients = await getAllClients();
            clients = filterData(clients, req.body)
            console.log(clients);
            if (clients.length) {
                sendResult(res, 'Success', clients.map((client) => {
                    return {
                        ...client._doc
                    }
                }));
            } else {
                sendError(res, 400, 'Clients are missing')
            }
        } catch (error) {
            sendError(res, 400, `Bad request! ${error}`)
        }
    },
}
