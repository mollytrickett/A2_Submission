const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
title: {
    type: String,
    required: true,
    maxlength: 100
},
description: {
    type: String,
    required: true,
    maxlength: 500
},
createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'users'
}
});

module.exports = mongoose.model('posts', postSchema)