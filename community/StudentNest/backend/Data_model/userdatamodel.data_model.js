import mongoose, { Schema } from "mongoose";

const DataModel = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /@gmail\.com$/.test(v); // checks if it ends with @gmail.com
        },
        message: (props) =>
          `${props.value} is not a valid email address. It must end with @gmail.com`,
      },
    },
    pass: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const DataModelSchema = mongoose.model("DataModel", DataModel);
export default DataModelSchema;
