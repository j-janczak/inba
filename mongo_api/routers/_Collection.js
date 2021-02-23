const mongoose = require('mongoose');
const express = require('express');
const Schema = mongoose.Schema;

class Collection {
    constructor(name, schema) {
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
    sendResult(collecionName, result) {
        if (this.globasRes === undefined) {
            console.error('RES IS UNDEFINED');
            return;
        }
        if (result.error !== undefined) {
            console.error(`[${collecionName}]`, result);
            this.globasRes.statusMessage = "ERROR";
            this.globasRes.send(result);
        } else {
            console.log(`[${collecionName}]`, result);
            this.globasRes.send(result);
        }
    }
    sendError(res) {}
    get(req, res, next) {}
    getOne(req, res, next) {}
    post(dara, req, res, next) {}
}

module.exports = Collection;