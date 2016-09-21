'use strict';

module.exports = {

  login(req, res) {
    res.view('static/index');
  },

  index(req, res) {
    res.view('index/index');
  }

};
