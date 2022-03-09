const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    roomId: {
        type: String,
        required: true,
        ref: 'rooms'
    },
    clientId: {
        type: String,
        required: true,
        ref: 'clients'
    },
    dateOfArrival: {
        type: Date,
        required: true
    },
    dateOfDeparture: {
        type: Date,
        required: true,
    },
    cost: {
        type: Number,
        default: 0,
        required: true
    },
});

OrderSchema.pre('save',  function (next)  {
    const order = this;
    const Room = mongoose.model('rooms');
    const Client = mongoose.model('clients');
    Room.findOne({_id:order.roomId}, function (err, found) {
        if (found) {
            Client.findOne({_id:order.clientId}, function (err, found) {
                if (found) return next();
                else return next(new Error("Client is not found"));
            });
        }
        else return next(new Error("Room is not found"));
    });
});


/*CategorySchema.post('save', (doc) => {
    console.log('save');
    console.log('doc', doc);
});

OrderSchema.post('remove', async (doc) => {
    console.log('OrderSchema post remove');
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

const Order = mongoose.model('orders', OrderSchema);
module.exports = Order;
