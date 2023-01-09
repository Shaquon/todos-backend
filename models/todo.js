const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const todoSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: String, required: true },
    creatorId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    isDeleted: { type: Boolean, required: true, defaults: false }
});

todoSchema.pre("find", function () {
    this.where({ isDeleted: false });
});

todoSchema.pre("findOne", function () {
    this.where({ isDeleted: false });
});

todoSchema.pre("findById", function () {
    this.where({ isDeleted: false });
});

todoSchema.pre("findByIdAndUpdate", function () {
    this.where({ isDeleted: false });
});

todoSchema.pre("findByIdAndRemove", function () {
    this.where({ isDeleted: false });
});

module.exports = mongoose.model('Todo', todoSchema);