const mongoose = require('mongoose');

// define activity schema
const activitySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            default: "Titre obligatoire",
            trim: true,
        },
        auteur: {
            type: String,
            required: true,
            default: "obligatoire",
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        startDate: {
            type: Date,
            required: true,
            trim: true
        },
        endDate: {
            type: Date,
            required: true,
            trim: true
        },
        time: {
            type: String,
            required: true
        },
        participants: {
            type: [User]
        },
    },
);
const activityModel = mongoose.medel("Activities", activitySchema);

module.exports = activityModel;