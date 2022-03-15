const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const RoomSchema = new Schema({
    roomNumber: {
        type: Number,
        required: true,
        unique: true
    },
    roomTypeId: {
        type: String,
        required: true,
        ref: 'room_types'
    },
    image: {
        type : String,
        required: true
    },
    description: {
        type : String,
        required: false
    },
});

RoomSchema.plugin(uniqueValidator);

RoomSchema.pre('save',  function (next)  {
    const room = this;
    const RoomTypes = mongoose.model('room_types');
    RoomTypes.findOne({_id:room.roomTypeId}, function (err, found) {
        if (found) return next();
        else return next(new Error("not found"));
    });
});
/*CategorySchema.post('save', (doc) => {
    console.log('save');
    console.log('doc', doc);
});

RoomSchema.post('remove', async (doc) => {
    console.log('RoomSchema post remove');
    try {
        const topics = await Topic.find({'categoryId': doc._id});
        if(topics.length){
            topics.forEach(async (topic)=> await topic.remove());
        }
    }catch (e) {
        console.log('Topics are absent');
    }
});
*/

const Room = mongoose.model('rooms', RoomSchema);
module.exports = Room;
