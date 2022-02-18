const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    roomId: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
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
        required: true
    },
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
