const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name value']
    },
    password: {
        type: String,
        required: [true, 'Please add a password value']
    },
    email: {
        type: String,
        required: [true, 'Please add a email value'],
        unique: true
    },
    address: {
        type: String,
        required: [true, 'Please add a address value']
    },
    prevOrders: Array,
    prevReservations: Array,

}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema);