exports.cookies = {
  get(ctx, key) {
    const value = ctx.cookies.get(key, {signed: true});
    try {
      return JSON.parse(new Buffer(value, 'base64').toString());
    } catch (e) {
      // ignore invalid data
    }
  },
  set(ctx, key, data) {
    const value = new Buffer(JSON.stringify(data)).toString('base64');
    ctx.cookies.set(key, value, {signed: true});
  },
  remove(ctx, key) {
    ctx.cookies.set(key, '', {expires: new Date(Date.now() - 24 * 60 * 60 * 1000)});
  },
};

exports.permit = function (key) {
  /**
   * permissions:
   * - admin: user is admin
   */
  return function* (next) {
    const {user} = this.state;
    const permissions = user && user.isEnabled ? user.permissions || [] : null;
    if (!permissions || key && !permissions.includes(key)) {
      this.status = 401;
      this.body = {
        error: 'Not Authorized',
      };
      return;
    }
    yield* next;
  };
};