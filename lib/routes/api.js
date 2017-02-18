const Router = require('koa-router');
const models = require('../models');
const {permit} = require('../utils');

const router = new Router({
  prefix: '/api',
})

// user APIs
.get('/me', permit(), function* (next) {
  this.body = {
    data: this.state.user,
  };
})
.get('/me/quizzes', permit(), function* (next) {
  const quizzes = yield* getQuizzesByUserId(this.state.user.id);
  this.body = {
    data: quizzes,
  };
})
.get('/me/quizzes/:id', permit(), function* (next) {
  const userQuiz = yield model.findOne({
    user: this.state.user.id,
    quiz: this.params.id,
  })
  .select('quiz solutions -_id')
  .populate('quiz', 'title description languages')
  .populate('solutions.language quiz.languages', 'title value', null, {isEnabled: true});
  this.body = {
    data: userQuiz,
  };
})
.post('/me/quizzes/:id', permit(), function* (next) {
  const userQuiz = yield model.findOne({
    user: this.state.user.id,
    quiz: this.params.id,
  });
  const {code, language} = this.request.body;
  userQuiz.solutions.push({code, language});
  yield userQuiz.save();
  this.status = 201;
  this.body = {
    error: null,
  };
})

// admin APIs
.get('/users', permit('admin'), function* (next) {
  const users = yield models.User.find();
  this.body = {
    data: users,
  };
})
.get('/users/:id', permit('admin'), function* (next) {
  const user = yield models.User.findOne({
    _id: this.params.id,
  });
  if (!user) {
    this.status = 404;
    this.body = {
      error: 'Not found',
    };
    return;
  }
  this.body = {
    data: user,
  };
})
.patch('/users/:id', permit('admin'), function* (next) {
  const {permissions, isEnabled} = this.request.body;
  const updates = {};
  if (permissions != null) updates.permissions = permissions;
  if (isEnabled != null) updates.isEnabled = !!isEnabled;
  const user = yield models.User.findOneAndUpdate({
    _id: this.params.id
  }, updates, {new: true});
  this.body = {
    data: user,
  };
})
.get('/user/:id/quizzes', permit('admin'), function* (next) {
  const quizzes = yield* getQuizzesByUserId(this.params.id);
  this.body = {
    data: quizzes,
  };
})
.get('/quizzes', permit('admin'), function* (next) {
  const quizzes = yield models.Quiz.find();
  this.body = {
    data: quizzes,
  };
})
.post('/quizzes', permit('admin'), function* (next) {
  const {title, description, languages} = this.request.body;
  const quiz = yield models.Quiz.create({
    title, description, languages,
    createdBy: this.state.user.id,
  });
  this.status = 201;
  this.body = quiz;
})
.put('/quizzes/:id', permit('admin'), function* (next) {
  const {title, description, languages} = this.request.body;
  const quiz = yield models.Quiz.findOneAndUpdate({
    _id: this.params.id,
  }, {title, description, languages}, {new: true});
  this.body = {
    data: quiz,
  };
})

module.exports = router.routes();

function* getQuizzesByUserId(id) {
  const userQuizzes = yield models.UserQuiz.find({user: id})
  .select('quiz -_id')
  .populate('quiz');
  return userQuizzes.map(item => item.quiz);
}
