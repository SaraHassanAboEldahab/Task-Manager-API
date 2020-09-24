const mongoose = require('mongoose')
const taskSchema=new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    //da hyb2a l nfs l id bta3 l user l 3ml creation lel task da
    owner:{
        type:mongoose.Schema.Types.ObjectId, //this means the data stored and the owner will be an objectId
        required:true,
        ref:"User"//it is reference from this field to another model w byb2a nfs asm l model bzabt
    }
},{
    timestamps:true
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task