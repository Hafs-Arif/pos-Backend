import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const videoSchema = new mongoose.Schema({

    videoFile: { type: String, required: true },
    thumbnail: { type: String, required: true },
    owner: [ { type: Schema.types.Objectid, ref: "User" } ],
    title: { type: String, required: true },
    description: { type: String },
    duration: { type: Numbers, required: true }, //Cloudnary etc gives details like this
    views: { type: Numbers, default: 0 },
    isPublished: { type: boolean, default: true }
}, {timestamps: true});

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model('Video', videoSchema);