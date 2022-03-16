const RoomType = require('../models/roomTypeModel');
const {ObjectId} = require("mongodb");
const {sendError, sendResult, getRoomTypeById, getAllRoomTypes} = require('./baseController');

module.exports = {
    addRoomType: async (req, res) => {
        console.log("addRoomType");
        try {
            const roomType = new RoomType(req.body);
            await roomType.save();
            sendResult(res, 'Success', {...roomType._doc});
        } catch (error) {
            sendError(res, 400, `Bad request! ${error}`)
        }
    },
    editRoomType: async (req, res) => {
        console.log("editRoomType");
        try {
            let newRoomType = {...req.body};
            let roomType = await getRoomTypeById(req.body._id);
            console.log('roomType', roomType);
            if (roomType) {
                Object.entries(newRoomType).forEach(([key, value]) => {
                    roomType[key] = newRoomType[key] ?? value;
                });
                await RoomType.replaceOne({_id: new ObjectId(req.body._id)}, roomType);
                sendResult(res, 'Success', {
                    ...roomType._doc
                });
            } else {
                sendError(res, 400, 'RoomType is missing')
            }
        } catch (error) {
            sendError(res, 400, `Bad request! ${error}`)
        }
    },
    getRoomTypes: async (req, res) => {
        console.log("getRoomTypes");
        try {
            const roomTypes = await getAllRoomTypes();
            console.log(roomTypes);
            if (roomTypes.length) {
                sendResult(res, 'Success', roomTypes.map((roomType) => {
                    return {
                        ...roomType._doc
                    }
                }));
            } else {
                sendError(res, 400, 'RoomTypes are missing')
            }
        } catch (error) {
            sendError(res, 400, `Bad request! ${error}`)
        }
    },
    getRoomType: async (req, res) => {
        console.log("getRoomType");
        try {
            const roomType = await getRoomTypeById(req.params.id);
            if (roomType) {
                sendResult(res, 'Success', {
                    ...roomType._doc
                });
            } else {
                sendError(res, 400, 'RoomType is missing')
            }
        } catch (error) {
            sendError(res, 400, `Bad request! ${error}`)
        }
    },
    deleteRoomType: async (req, res) => {
        console.log("deleteRoomType");
        try {
            const roomType = await getRoomTypeById(req.params.id);
            if (roomType) {
                await roomType.remove();
                sendResult(res, 'Success', {
                    ...roomType._doc
                });
            } else {
                sendError(res, 400, 'RoomType is missing')
            }
        } catch (error) {
            sendError(res, 400, `Bad request! ${error}`)
        }
    },
}
