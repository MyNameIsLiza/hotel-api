const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const RoomSchema = new Schema({
    roomNumber: {
        type: Number,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    roomType: {
        type: String,
        required: true,
        enum: {
            values: ['Luxury', 'President', 'Common', 'Economy'],
            message: '{VALUE} is not supported'
        }
    },
    roomStatus: {
        type: Boolean,
        required: true,
        default: false
    },
});

RoomSchema.plugin(uniqueValidator);

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
