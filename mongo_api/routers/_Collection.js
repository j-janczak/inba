const mongoose = require('mongoose');
const express = require('express');
const Schema = mongoose.Schema;

class Collection {
    constructor(name, schema) {
        this.model = mongoose.model(name, new Schema(schema));
        this.router = express.Router();
        this.router.get('/', this.get.bind(this));
        this.router.get('/:id', this.getOne.bind(this));
        this.router.post('/', (req, res, next) => {
            const data = req.body;
            this.post(data, req, res, next);
        });
    }
    sendError(res) {
        
    }
    get(req, res, next) {}
    getOne(req, res, next) {}
    post(dara, req, res, next) {}
}

module.exports = Collection;