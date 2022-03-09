const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const RoomTypeSchema = new Schema({
    price: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
});

RoomTypeSchema.plugin(uniqueValidator);

const RoomType = mongoose.model('room_types', RoomTypeSchema);
module.exports = RoomType;
