const mongoose = require('mongoose');
const config = require('../config');
mongoose.Promise = Promise;
mongoose.set('debug', config.get('DEBUG'));
const {Schema} = mongoose;
mongoose.connect(config.get('MONGODB'));

const models = module.exports = {};
models.ready = new Promise((resolve, reject) => {
  const db = mongoose.connection;
  db.on('error', err => {
    console.error(err);
    reject(err);
  });
  db.once('open', () => {
    init();
    resolve();
  });
});

function init() {
  const userSchema = Schema({
    openId: {
      type: String,
      unique: true,
    },
    login: String,
    name: String,
    email: String,
    avatar: String,
    permissions: {type: [String], default: []},
    isEnabled: {type: Boolean, default: true},
  });
  models.User = mongoose.model('User', userSchema);

  const quizSchema = Schema({
    title: String,
    description: String,
    languages: [{type: Schema.Types.ObjectId, ref: 'Language'}],
    createdBy: {type: Schema.Types.ObjectId, ref: 'User'},
    createdAt: {type: Date, default: Date.now},
    isEnabled: {type: Boolean, default: true},
  });
  models.Quiz = mongoose.model('Quiz', quizSchema);

  const userQuizSchema = Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    quiz: {type: Schema.Types.ObjectId, ref: 'Quiz'},
    solutions: [{
      code: String,
      language: {type: Schema.Types.ObjectId, ref: 'Language'},
      createdAt: {type: Date, default: Date.now},
    }],
  });
  models.UserQuiz = mongoose.model('UserQuiz', userQuizSchema);

  const langSchema = Schema({
    title: String,
    value: String,
    isEnabled: {type: Boolean, default: true},
  });
  models.Language = mongoose.model('Language', langSchema);
}