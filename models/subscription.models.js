import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription name is required"],
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be a grater than zero"],
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      enum: ["USD", "EUR", "GBP", "INR", "JPY"],
      default: "USD",
      trim: true,
      uppercase: true,
      match: [/^[A-Z]{3}$/, "Currency must be a valid 3-letter code"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Entertainment", "Utilities", "Food", "Health", "Other"],
      trim: true,
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: ["Credit Card", "Debit Card", "PayPal", "Bank Transfer"],
      trim: true,
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["Active", "Inactive", "Cancelled"],
      default: "Active",
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        //another way to write the validator using arrow
        // validator: (value) => value <= new Date(),
        message: "Start date cannot be in the future",
      },
    },
    renewalDate: {
      type: Date,
      required: [true, "Start date is required"],
      validate: {
        validator: function (value) {
          //this refers to the current document
          return value >= this.startDate;
        },
        //another way to write the validator using arrow
        // validator: (value) => value <= new Date(),
        message: "Start date cannot be in the future",
      },
    },
    //Most important field user that subscribes to the subscription
    user: {
      //object id reference to the User model
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true, // Indexing the user field for faster lookups
    },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
