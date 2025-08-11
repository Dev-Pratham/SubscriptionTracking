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
      default: "INR",
      trim: true,
      uppercase: true,
      match: [/^[A-Z]{3}$/, "Currency must be a valid 3-letter code"],
    },
    frequency: {
      type: String,
      required: [true, "Frequency is required"],
      enum: ["Weekly", "Monthly", "Quarterly", "Yearly"],
      trim: true,
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
      enum: ["Active", "Inactive", "Cancelled", "Expired"],
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
      validate: {
        validator: function (value) {
          //this refers to the current document
          return value >= this.startDate;
        },
        //another way to write the validator using arrow
        // validator: (value) => value <= new Date(),
        message: "Renewal date cannot be before start date",
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

//auto calculate renewalDate before saving the document
//if the renewalDate is not provided but the startDate and frequency are provided
subscriptionSchema.pre("save", function (next) {
  if (!this.renewalDate) {
    const renewalPeriods = {
      Weekly: 7,
      Monthly: 30,
      Quarterly: 90,
      Yearly: 365,
    };

    //jan 1st
    //monthly 30 days
    //jan 31st
    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(
      this.renewalDate.getDate() + renewalPeriods[this.frequency]
    );
  }

  //if renew date is provided, we autoupdate status
  if (this.renewalDate < new Date()) {
    this.status = "Expired";
  }

  //make it proceed to the creation of the document
  next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
