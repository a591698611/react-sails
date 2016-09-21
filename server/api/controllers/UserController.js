'use strict';

module.exports = {

  login(req, res) {
    let params = {};
    params.username = req.param('username');
    params.password = req.param('password');
    params.time = Date.now();
    params.ip = req.ip;

    const data = [{
      username: 'admin',
      password: 'admin',
      head: 'avatar1'
    }, {
      username: 'admin1',
      password: 'admin1',
      head: 'avatar1'
    }, {
      username: 'admin2',
      password: 'admin2',
      head: 'avatar2'
    }, {
      username: 'admin3',
      password: 'admin3',
      head: 'avatar3'
    }];

    data.some(v => {
      let auth = (v.username === params.username && v.password === params.password);
      if (auth) {
        const r = {
          'data': {
            'id': 1,
            'ip': '::ffff:127.0.0.1',
            'token': 'QWVoZGhEWEY5dHQ2cDJoV2JJMk1vWm1Wb0pTZnFSOGtTMVlxZ2h3bDR3QUpod1U4ck9nVG44QSs0dERrOGtJdQ==',
            'head': v.head
          },
          'message': '成功',
          'status': 303
        };
        try {
          if (r.data && r.data.token) {
            const crypto = require('crypto');
            req.session.username = params.username;
            req.session.password = crypto.createHash('md5').update(params.password + params.time).digest('hex');
            req.session.token = r.data.token;
            req.session.head = r.data.head;
            return res.json({code: 200, path: 'chat'});
          }
        } catch (e) {
          sails.log.error('UserController.login():' + e);
        }
      } else {
        return res.json({code: -1});
      }
    });
  },

  getInfo(req, res) {
    res.json({
      head: req.session.head
    })
  },

  logout(req, res) {
    delete req.session.token;
    req.session.save();
    res.json({code: 200});
  }

};
