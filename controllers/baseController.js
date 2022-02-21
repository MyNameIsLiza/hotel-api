const Room = require("../models/roomModel");
const Client = require("../models/clientModel");
const Order = require("../models/orderModel");

const {ObjectId} = require("mongodb");
const smartSearch = require("smart-search");

module.exports = {
    sendError(res, status, message) {
        res.status(status).send({
            message: message
        });
    },

    sendResult(res, message, result) {
        res.send({
            message: message,
            result: Array.isArray(result) ? [...result] : result
        });
    },

    async getAllRooms() {
        const rooms = await Room.find({}, '-__v');
        return rooms ?? false;
    },

    async getRoomById(id) {
        const room = await Room.findOne({_id: new ObjectId(id)}, '-__v');
        return room ?? false;
    },

    async getAllClients() {
        const clients = await Client.find({}, '-__v');
        return clients ?? false;
    },

    async getClientById(id) {
        const client = await Client.findOne({_id: new ObjectId(id)}, '-__v');
        return client ?? false;
    },

    async getAllOrders() {
        const orders = await Order.find({}, '-__v');
        return orders ?? false;
    },

    async getOrderById(id) {
        const order = await Order.findOne({_id: new ObjectId(id)}, '-__v');
        return order ?? false;
    },

    filterData(arr, obj) {
        const arrays = [];
        Object.entries(obj).forEach(([key, value]) => {
            if (typeof value === 'string') {
                const fields = {};
                fields[key] = true;
                arrays.push(smartSearch(arr, value, fields));
            } else if (typeof value === 'number') {
                arrays.push(arr.filter((el) => el[key].toString().includes(value.toString())))
            } else {
                arrays.push(arr.filter((el) => el[key] === value));
            }

        });
        console.log(arrays)
        return intersec(arrays) ?? [];
    }
}

function lenSort(a, b) {
    return a.length - b.length;
}

function intersec(arrays) {
    arrays.sort(lenSort);

    const arraysDicts = [];
    for (let arrayIndex = 1; arrayIndex < arrays.length; arrayIndex++) {
        let dict = {};
        for (let index = 0; index < arrays[arrayIndex].length; index++) {
            dict[arrays[arrayIndex][index]] = true;
        }
        arraysDicts.push(dict);
    }

    const res = [];
    for (let index = 0; index < arrays[0].length; index++) {
        let flag = true;
        for (let arrayIndex = 0; arrayIndex < arraysDicts.length; arrayIndex++) {
            if (!(arrays[0][index] in arraysDicts[arrayIndex])) {
                flag = false;
                break;
            }
        }
        if (flag) res.push(arrays[0][index]);
    }

    return res;
}