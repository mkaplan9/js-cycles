const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class Trail extends ObjectClass {
  constructor(parentID, x, y, dir) {
    super(shortid(), x, y, dir, Constants.BULLET_SPEED);
    this.parentID = parentID;
  }
}

module.exports = Trail;
