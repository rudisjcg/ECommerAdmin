import mongoose from "mongoose";
const { Schema, models, model } = mongoose;


const categorySchema = new Schema({
    name: { type: String, required: true },
    parent: {type:mongoose.Schema.Types.ObjectId, required:false, ref:'Category'},
    properties:[{type:Object}]
});

export const Category = models?.Category || model('Category', categorySchema);
