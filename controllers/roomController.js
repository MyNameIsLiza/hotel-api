const Room = require('../models/roomModel');
const {ObjectId} = require("mongodb");
const {sendError, sendResult, getRoomById, getAllRooms} = require('./baseController');

module.exports = {
    addRoom: async (req, res) => {
        console.log("addRoom");
        try {
            const room = new Room(req.body);
            await room.save();
            sendResult(res, 'Success', {"id": room._id, ...room._doc});
        } catch (error) {
            sendError(res, 400, `Bad request! ${error}`)
        }
    },
    editRoom: async (req, res) => {
        console.log("editRoom");
        try {
            let newRoom = {...req.body};
            let room = await getRoomById(req.body.id);
            console.log('room', room);
            if (room) {
                Object.entries(room._doc).forEach(([key, value]) => {
                    room[key] = newRoom[key] ?? value;


                });
                await Room.replaceOne({_id: new ObjectId(req.body.id)}, room);
                sendResult(res, 'Success', {
                    "id": room._id, ...room._doc
                });
            } else {
                sendError(res, 400, 'Room is missing')
            }
        } catch (error) {
            sendError(res, 400, `Bad request! ${error}`)
        }
    },
    getRooms: async (req, res) => {
        console.log("getRooms");
        try {
            const rooms = await getAllRooms();
            console.log(rooms);
            if (rooms.length) {
                sendResult(res, 'Success', rooms.map((room) => {
                    return {
                        "id": room._id,
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
        console.log("getRoom");
        try {
            const room = await getRoomById(req.params.id);
            if (room) {
                sendResult(res, 'Success', {
                    "id": room._id,
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
        console.log("deleteRoom");
        try {
            const room = await getRoomById(req.params.id);
            if (room) {
                await room.remove();
                /////Delete topics and questions/////
                sendResult(res, 'Success', {
                    "id": room._id,
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
