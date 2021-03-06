const fetch = require('node-fetch');
const Router = require('koa-router');
const utils = require('../utils');
const config = require('../config');
const models = require('../models');
const TOKEN_KEY = config.get('TOKEN_KEY');
const CLIENT_ID = config.get('GITHUB_CLIENT_ID');
const CLIENT_SECRET = config.get('GITHUB_CLIENT_SECRET');
const GITHUB_OAUTH2 = config.get('GITHUB_OAUTH2');

function parseJSON(res) {
  return res.json()
  .then(data => res.ok ? {data} : {status: res.status, error: data});
}

function fetchToken(code) {
  const data = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code,
  };
  return fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(parseJSON);
}

function fetchAPI(token, path) {
  return fetch(`https://api.github.com${path}`, {
    method: 'GET',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/json',
    },
  })
  .then(parseJSON);
}

const router = new Router({
  prefix: '/account',
})
.get('/login', function* (next) {
  this.redirect(GITHUB_OAUTH2);
})
.get('/callback', function* (next) {
  const {code} = this.query;
  if (!code) {
    this.status = 400;
    return;
  }
  let res = yield fetchToken(code);
  if (res.data) {
    const {access_token: token} = res.data;
    res = yield fetchAPI(token, '/user');
  }
  if (res.error) {
    this.status = res.status;
    this.body = res.error;
    return;
  }
  const {name, id, avatar_url, email, login} = res.data;
  const userAttr = {
    openId: `github/${id}`,
    login,
    name,
    email,
    avatar: avatar_url,
  };
  const user = yield models.User.findOneAndUpdate({
    openId: userAttr.openId,
  }, userAttr, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });
  utils.cookies.set(this, TOKEN_KEY, {
    id: user._id,
    name: user.name,
  });
  this.redirect('../');
})
.get('/logout', function* (next) {
  utils.cookies.remove(this, TOKEN_KEY);
})

module.exports = router.routes();