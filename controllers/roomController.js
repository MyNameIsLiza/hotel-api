const Room = require('../models/roomModel');
const {ObjectId} = require("mongodb");
const {sendError, sendResult, getRoomById, getAllRooms} = require('./baseController');

module.exports = {
    addRoom: async (req, res) => {
        /*
        #swagger.tags = ['Rooms']
        #swagger.description = 'Add room'
        #swagger.parameters['roomNumber'] = {
            in: "body",
            required: true,
            schema: { $ref: '#/definitions/roomNumber' },
            description: "Room number"
        }
        #swagger.parameters['price'] = {
            in: "body",
            required: true,
            schema: { $ref: '#/definitions/price' },
            description: "Room price"
        }
        #swagger.parameters['roomType'] = {
            in: "body",
            required: true,
            schema: { $ref: '#/definitions/roomType' },
            description: "Room type"
        } */
        console.log("addRoom");
        try {
            const room = new Room(req.body);
            await room.save();
            sendResult(res, 'Success', {...room._doc});
        } catch (error) {
            sendError(res, 400, `Bad request! ${error}`)
        }
    },
    editRoom: async (req, res) => {
        /*
        #swagger.tags = ['Rooms']
        #swagger.description = 'Edit room by id'
        #swagger.parameters['id'] = {
                description: 'Room id'
        }
        #swagger.parameters['roomNumber'] = {
            in: "body",
            required: true,
            schema: { $ref: '#/definitions/roomNumber' },
            description: "Room number"
        }
        #swagger.parameters['price'] = {
            in: "body",
            required: true,
            schema: { $ref: '#/definitions/price' },
            description: "Room price"
        }
        #swagger.parameters['roomType'] = {
            in: "body",
            required: true,
            schema: { $ref: '#/definitions/roomType' },
            description: "Room type"
        }
        */
        console.log("editRoom");
        try {
            let newRoom = {...req.body};
            let room = await getRoomById(req.params.id);
            console.log('room', room);
            if (room) {
                Object.entries(room._doc).forEach(([key, value]) => {
                    room[key] = newRoom[key] ?? value;
                });
                await Room.replaceOne({_id: new ObjectId(req.params.id)}, room);
                sendResult(res, 'Success', {
                    ...room._doc
                });
            } else {
                sendError(res, 400, 'Room is missing')
            }
        } catch (error) {
            sendError(res, 400, `Bad request! ${error}`)
        }
    },
    getRooms: async (req, res) => {
        // #swagger.tags = ['Rooms']
        // #swagger.description = 'Get all rooms'
        console.log("getRooms");
        try {
            const rooms = await getAllRooms();
            console.log(rooms);
            if (rooms.length) {
                sendResult(res, 'Success', rooms.map((room) => {
                    return {
                        ...room._doc
                    }
                }));
            } else {
                sendError(res, 400, 'Rooms are missing')
            }
        } catch (error) {
            sendError(res, 400, `Bad request! ${error}`)
        }
    },
    getRoom: async (req, res) => {
        // #swagger.tags = ['Rooms']
        // #swagger.description = 'Get room by id'
        /*  #swagger.parameters['id'] = {
                description: 'Room id'
        } */
        console.log("getRoom");
        try {
            const room = await getRoomById(req.params.id);
            if (room) {
                sendResult(res, 'Success', {
                    ...room._doc
                });
            } else {
                sendError(res, 400, 'Room is missing')
            }
        } catch (error) {
            sendError(res, 400, `Bad request! ${error}`)
        }
    },
    deleteRoom: async (req, res) => {
        // #swagger.tags = ['Rooms']
        // #swagger.description = 'Delete room by id'
        /*  #swagger.parameters['id'] = {
                description: 'Room id'
        } */
        console.log("deleteRoom");
        try {
            const room = await getRoomById(req.params.id);
            if (room) {
                await room.remove();
                sendResult(res, 'Success', {
                    ...room._doc
                });
            } else {
                sendError(res, 400, 'Room is missing')
            }
        } catch (error) {
            sendError(res, 400, `Bad request! ${error}`)
        }
    },
}
