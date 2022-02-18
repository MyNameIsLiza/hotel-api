const Order = require('../models/orderModel');
const {getRoomById} = require("./baseController");
const {getClientById} = require("./baseController");
const {ObjectId} = require("mongodb");
const {sendError, sendResult, getOrderById, getAllOrders} = require('./baseController');

module.exports = {
    addOrder: async (req, res) => {
        console.log("addOrder");
        try {
            const order = new Order(req.body);
            console.log('client', await getClientById(req.body.clientId))
            const client = await getClientById(req.body.clientId);
            const room = await getRoomById(req.body.roomId);
            if (!client) {
                sendError(res, 400, `That client doesn't exist`);
            }
            if (!room) {
                sendError(res, 400, `That room doesn't exist`);
            }
            order.cost = room.price * Math.ceil(Math.abs(order.dateOfDeparture.getTime() - order.dateOfArrival.getTime()) / (1000 * 3600 * 24));
            order.cost = client.privileged ? order.cost * 0.8 : order.cost;
            await order.save();
            sendResult(res, 'Success', {...order._doc});
        } catch (error) {
            sendError(res, 400, `Bad request! ${error}`)
        }
    },
    editOrder: async (req, res) => {
        console.log("editOrder");
        try {
            let newOrder = {...req.body};
            let order = await getOrderById(req.body.id);
            console.log('order', order);
            if (order) {
                Object.entries(order._doc).forEach(([key, value]) => {
                    order[key] = newOrder[key] ?? value;
                });
                await Order.replaceOne({_id: new ObjectId(req.body.id)}, order);
                sendResult(res, 'Success', {
                    ...order._doc
                });
            } else {
                sendError(res, 400, 'Order is missing')
            }
        } catch (error) {
            sendError(res, 400, `Bad request! ${error}`)
        }
    },
    getOrders: async (req, res) => {
        console.log("getOrders");
        try {
            const orders = await getAllOrders();
            console.log(orders);
            if (orders.length) {
                sendResult(res, 'Success', orders.map((order) => {
                    return {
                        ...order._doc
                    }
                }));
            } else {
                sendError(res, 400, 'Orders are missing')
            }
        } catch (error) {
            sendError(res, 400, `Bad request! ${error}`)
        }
    },
    getOrder: async (req, res) => {
        console.log("getOrder");
        try {
            const order = await getOrderById(req.params.id);
            if (order) {
                sendResult(res, 'Success', {
                    ...order._doc
                });
            } else {
                sendError(res, 400, 'Order is missing')
            }
        } catch (error) {
            sendError(res, 400, `Bad request! ${error}`)
        }
    },
    deleteOrder: async (req, res) => {
        console.log("deleteOrder");
        try {
            const order = await getOrderById(req.params.id);
            if (order) {
                await order.remove();
                /////Delete topics and questions/////
                sendResult(res, 'Success', {
                    ...order._doc
                });
            } else {
                sendError(res, 400, 'Order is missing')
            }
        } catch (error) {
            sendError(res, 400, `Bad request! ${error}`)
        }
    },
}
