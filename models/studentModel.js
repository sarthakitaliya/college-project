const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: String,
    rollno: String,
    address: String,
    email: String,
    courseName: String
});

module.exports = mongoose.model('student', studentSchema);
