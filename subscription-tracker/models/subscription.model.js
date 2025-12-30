import mongoose from "mongoose";
const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Subscription name is required"],
        trim: true,
        minLength: 2,
        maxLength: 100
    },
    price: {
        type: Number,
        required: [true, "Subscription price is required"],
        min: [0 , "Price cannot be negative"],
        max: [10000, "Price seems too high"]
    },
    currency: {
        type: String,
        required: [true, "Currency is required"],
        enum: ["USD", "EUR", "GBP", "JPY", "AUD", "CAD"],
        default: "USD"
    },
    frequency: {
        type: String,
        required: [true, "Billing frequency is required"],  
        enum: ["monthly", "yearly", "weekly", "daily"]
    },
    catagory: {
        type: String,
        enum: ["entertainment", "productivity", "education", "health", "other"],
        default: "other",
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive", "canceled", "paused"],
        default: "active"
    },
    startDate: {
        type: Date,
        required: [true, "Start date is required"],
        validate: function (v) {
            return v <= new Date();
        },
        message: props => `Start date ${props.value} cannot be in the future!`
    },
    renewalDate: {
        type: Date,
        validate: function (v) {
            return v > this.startDate;
        },
        message: props => `Renewal date ${props.value} cannot be in the past!`
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Associated user is required"],
        index: true,
    }
}, { timestamps: true });
subscriptionSchema.pre('save',function(next){
    if(!this.renewalDate){
        const renewalPeriod = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriod[this.frequency]);

    }
    if (this.renewalDate < new Date()){ {
        this.status = 'inactive';
    } }
    next();

})



const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;