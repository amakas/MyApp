import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
content:{type:String, trim:true},
username:{type:String},
createdAt:{type:Date, default:new Date()},
updatedAt:{type:Date, default:new Date()}
});

const Message = mongoose.model('Message', messageSchema);
export default Message;