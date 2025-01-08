import mongoose from "mongoose";


const branchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    liveLocation :{
        latitude: {
            type: Number
        },
        longtitude: {
            type: Number
        },
    },
    address: {
        type: String,
    },
    deliveryPartners: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DeliveryPartner",
        },
    ],
});

const Branch = mongoose.model("Branch", branchSchema);

export default Branch;