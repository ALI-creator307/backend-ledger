const mongoose = require('mongoose')


const transaction = new mongoose.Schema({

    fromAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "transaction must be associated with a FROM account"],
        index: true,
    },
    toAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "transaction must be associated with a TO account"],
        index: true,
    },
    status:{
        type: String,
        enum:{
            values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
            message: "Status can be either PENDING, COMPLETED, FAILED, REVERSED"
        },
        default: "PENDING",
    },
    amount:{
        type: Number,
        required: [true, "Amount is required for creating a transaction"],
        min: [0, "transaction amount can not be negative"]
    },
    idempotencyKey:{
        type: String,
        required: [true, "IdempotencyKey is requred for creating a transaction"],
        index: true,
        unique: true
    }
},{
    timestamps: true
})