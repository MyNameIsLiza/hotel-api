const Client = require('../models/clientModel');
const {getClientByEmail} = require("./baseController");
const {ObjectId} = require("mongodb");
const {sendError, sendResult, getClientById, getAllClients, filterData} = require('./baseController');

module.exports = {
    loginClient: async (req, res) => {
        console.log("loginClient");
        try {
            let client = await getClientByEmail(req.body.email);
            client.comparePassword(req.body.password, function (err, isMatch) {
                if (err) {
                    sendError(res, 400, `Bad request! ${err}`);
                } else if(isMatch){
                    sendResult(res, 'Success', {...client._doc});
                }else{
                    sendError(res, 400, `Bad request! Wrong password!`);
                }
            })

        } catch (error) {
            sendError(res, 400, `Bad request! ${error}`);
        }
    },
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
                Object.entries(newClient).forEach(([key, value]) => {
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
