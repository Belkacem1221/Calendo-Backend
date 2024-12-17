const mongoose = require('mongoose');

// define group schema
const groupSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            default: "Nom de groupe obligatoire",
            unique: true,
            trim: true,
        },
        userFirstName: {
            type: String,
            required: true,
            default: "Prénom obligatoire",
            unique: true,
            trim: true,
        },
        userLastName: {
            type: String,
            required: true,
            default: "Nom de famille obligatoire",
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
    }
);
const groupModel = mongoose.model("Groupes", groupSchema);

module.exports = groupModel;