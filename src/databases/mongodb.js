'use strict';

const moment = require('moment');
const mongoose = require('mongoose');
const logger = require('../extensions/logger');

const Schema = mongoose.Schema;

module.exports = class Databases {

  constructor() {
    try {
      const sirexjs = require(`${process.cwd()}/node_modules/sirexjs`);
      console.log(sirexjs);
      console.log(2);
      // Always make sure that the collection schema has created and updates at items set
      this.collectionSchema.createdAt = Date;
      this.collectionSchema.updatedAt = Date;

      const schema = new Schema(this.collectionSchema);

      // Middleware
      schema.pre('save', async function(next) {
        if (this.isNew) {
          this.createdAt = this.updatedAt = moment();
        } else {
          this.updatedAt = moment();
        }
        logger.info(this);
        return next();
      });

      if (typeof mongoose.models[this.collectionName] === 'undefined') {
        this.collection = mongoose.model(this.collectionName, schema);
      } else {
        this.collection = mongoose.models[this.collectionName];
      }

    } catch (e) {
      logger.error("[Databases]", e);
      throw e;
    }
  }

  get types() {
    return mongoose.Types;
  }

  static get types() {
    return mongoose.Types;
  }

  static connect() {

    if(typeof process.env.MONGODB === 'undefined') {
      logger.error('MongoDB database not set.');
      process.db_status.mongodb = false;
      return false;
    }
    mongoose.connect(
      process.env.MONGODB, {
        poolSize: 10,
        useNewUrlParser: true
      });

    mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
    mongoose.connection.once('open', () => {
      logger.info('MongoDB connected');
      process.db_status.mongodb = true;
      return true;
    });
  }

};
