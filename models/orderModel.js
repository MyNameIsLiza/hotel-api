const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const OrderSchema = new Schema({
    surname: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    middleName: {
        type: String,
        required: false
    },
    passportNumber: {
        type: String,
        validate: {
            validator: function (v) {
                console.log('passportNumber', /\d{3}-\d{3}-\d{4}/.test(v));
                return v.length === 9;
            },
            message: props => `${props.value} is not a valid passport number!`
        },
        required: [true, 'User passport number required'],
        unique: true
    },
    telephoneNumber: {
        type: String,
        validate: {
            validator: function(v) {
                console.log('telephoneNumber', /\d{3}-\d{3}-\d{4}/.test(v));
                return /\d{3}-\d{3}-\d{4}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'User phone number required']
    },
});

OrderSchema.plugin(uniqueValidator);

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
