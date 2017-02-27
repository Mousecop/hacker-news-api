const mongoose = require('mongoose');

const hackerNewsSchema = mongoose.Schema({
    title: {type:String, required: true},
    url: {type: String, required: true},
    votes: {type: Number, default: 0}
});

hackerNewsSchema.methods.apiRepr = function() {
    return {
        id: this._id,
        title: this.title,
        url: this.url,
        votes: this.votes
    };
}

const HackerNews = mongoose.model('HackerNews', hackerNewsSchema);

module.exports = {HackerNews};