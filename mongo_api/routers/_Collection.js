const mongoose = require('mongoose');
const express = require('express');
const Schema = mongoose.Schema;

class Collection {
    constructor(name, schema) {
        this.name = name;
        this.model = mongoose.model(name, new Schema(schema));
        this.router = express.Router();
        this.globasRes = undefined;
        this.router.get('/', this.get.bind(this));
        this.router.get('/:id', this.getOne.bind(this));
        this.router.post('/', (req, res, next) => {
            const data = req.body;
            this.post(data, req, res, next);
        });
    }
    sendResult(result) {
        if (this.globasRes === undefined) {
            console.error('RES IS UNDEFINED');
            return;
        }
        if (result.error !== undefined) {
            console.error(`[${this.name}]`, result);
            this.globasRes.statusMessage = "ERROR";
            this.globasRes.send(result.error);
        } else {
            console.log(`[${this.name}]`, result);
            this.globasRes.send(result);
        }
    }
    sendError(res) {}
    get(req, res, next) {}
    getOne(req, res, next) {}
    post(data, req, res, next) {}
}

module.exports = Collection;