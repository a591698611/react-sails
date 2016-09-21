/**
 * isAuthenticated
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
'use strict';

module.exports = function (req, res, next) {
  let path = req.url;
  if (path) path = path.split('?')[0];

  if (path === '/login') {
    if (req.session.token) return res.redirect('/chat');
    return next();
  } else {
    if (req.session.token) {
      return next();
    } else {
      if (req.xhr) return res.json({"code": -1, "message": "请重新登录！"});
      return res.redirect('/login');
    }
  }
};
