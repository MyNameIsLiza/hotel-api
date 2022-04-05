const Room = require('../models/roomModel');
const {ObjectId} = require("mongodb");
const {sendError, sendResult, getRoomById, getAllRooms, filterData} = require('./baseController');

module.exports = {
    addRoom: async (req, res) => {
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
        console.log("editRoom");
        try {
            let newRoom = {...req.body};
            let room = await getRoomById(req.body._id);
            console.log('room', room);
            if (room) {
                Object.entries(newRoom).forEach(([key, value]) => {
                    room[key] = newRoom[key] ?? value;
                });
                await Room.replaceOne({_id: new ObjectId(req.body._id)}, room);
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
                sendResult(res, 'Success', []);
            }
        } catch (error) {
            sendError(res, 400, `Bad request! ${error}`)
        }
    },
    searchRooms: async (req, res) => {
        console.log("searchRooms");
        try {
            let rooms = await getAllRooms();
            rooms = filterData(rooms, req.body);
            console.log(rooms);
            if (rooms.length) {
                sendResult(res, 'Success', rooms.map((room) => {
                    return {
                        ...room._doc
                    }
                }));
            } else {
                sendResult(res, 'Success', []);
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
