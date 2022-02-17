const Room = require("../models/roomModel");
const Client = require("../models/clientModel");

const {ObjectId} = require("mongodb");

module.exports = {
    sendError(res, status, message) {
        res.status(status).send({
            message: message
        });
    },

    sendResult(res, message, result) {
        res.send({
            message: message,
            result: Array.isArray(result)?[...result]:result
        });
    },

    async getAllRooms() {
        const rooms = await Room.find({},'-__v');
        return rooms ?? false;
    },

    async getRoomById(id) {
        const room = await Room.findOne({_id: new ObjectId(id)},'-__v');
        return room ?? false;
    },

    async getAllClients() {
        const clients = await Client.find({},'-__v');
        return clients ?? false;
    },

    async getClientById(id) {
        const client = await Client.findOne({_id: new ObjectId(id)},'-__v');
        return client ?? false;
    },

    /*async getQuestionById(id) {
        const question = await Question.findOne({_id: new ObjectId(id)},'-__v');
        return question ?? false;
    },

    async getTopicById(id) {
        const topic = await Topic.findOne({_id: new ObjectId(id)},'-__v');
        return topic ?? false;
    },

    async getCategoryById(id) {
        const category = await Category.findOne({_id: new ObjectId(id)},'-__v');
        return category ?? false;
    },



    async getAllTopics() {
        const topics = await Topic.find({},'-__v');
        return topics ?? false;
    },

    async getAllCategories() {
        const categories = await Category.find({},'-__v');
        return categories ?? false;
    },

    async getTopicsByCategoryId(categoryId) {
        const topics = await Topic.find({'categoryId':categoryId},'-__v');
        return topics;
    },

    async getQuestionsByTopicId(topicId) {
        const questions = await Question.find({'topicId':topicId},'-__v');
        return questions;
    },*/
}
