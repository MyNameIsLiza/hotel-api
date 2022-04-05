const Order = require('../models/orderModel');
const {getRoomById} = require("./baseController");
const {getClientById} = require("./baseController");
const {ObjectId} = require("mongodb");
const {sendError, sendResult, getOrderById, getAllOrders, filterData} = require('./baseController');

module.exports = {
    addOrder: async (req, res) => {
        console.log("addOrder");
        try {
            const order = new Order(req.body);
            const client = await getClientById(req.body.clientId);
            const room = await getRoomById(req.body.roomId);
            const days = Math.ceil(Math.abs(order.dateOfDeparture.getTime() - order.dateOfArrival.getTime()) / (1000 * 3600 * 24));
            if(days < 1){
                sendError(res, 400, `Bad request! Dates are inappropriate`);
                return;
            }
            if(!order.cost){
                order.cost = room.price * Math.ceil(Math.abs(order.dateOfDeparture.getTime() - order.dateOfArrival.getTime()) / (1000 * 3600 * 24));
                order.cost = client.privileged ? order.cost * 0.8 : order.cost;
            }
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
            let order = await getOrderById(req.body._id);
            console.log('order', order);
            if (order) {
                Object.entries(newOrder).forEach(([key, value]) => {
                    order[key] = newOrder[key] ?? value;
                });
                await Order.replaceOne({_id: new ObjectId(req.body._id)}, order);
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
                sendResult(res, 'Success', []);
            }
        } catch (error) {
            sendError(res, 400, `Bad request! ${error}`)
        }
    },
    searchOrders: async (req, res) => {
        console.log("searchOrders");
        try {
            let orders = await getAllOrders();
            orders = filterData(orders, req.body)
            console.log(orders);
            if (orders.length) {
                sendResult(res, 'Success', orders.map((order) => {
                    order = order.entry?? order;
                    order = order._doc ?? order;
                    return {
                        ...order
                    }
                }));
            } else {
                sendResult(res, 'Success', []);
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
