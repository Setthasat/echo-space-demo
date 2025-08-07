import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema({
    postID: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    description : {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    comments: [{
        name: {
            type: String,
            require: true
        },
        comment: {
            type: String,
            require: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
});

const PostModel = mongoose.model("post", PostSchema);

export default PostModel;