const config = require('../config');
const utils = require('../utils');
const models = require('../models');
const TOKEN_KEY = config.get('TOKEN_KEY');

function* checkAuth(next) {
  let user = utils.cookies.get(this, TOKEN_KEY);
  const data = user && user.id && (yield models.User.findOne({
    _id: user.id,
    isEnabled: true,
  }));
  if (data) {
    user.name = data.name;
    user.avatar = data.avatar;
    user.permissions = data.permissions;
  } else {
    user = null;
  }
  this.state.user = Object.assign({
    name: '未登录用户',
  }, user);
  yield* next;
}