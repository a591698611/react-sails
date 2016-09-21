'use strict';

let allMsg = [];
module.exports = {

  msg(req, res) {
    if (!req.isSocket) return res.badRequest();
    allMsg.push({
      msg: req.param('message'),
      head: req.param('head')
    });

    // 私聊
    /*const roomId = req.param('id');
    sails.sockets.join(req, roomId);
    sails.sockets.broadcast(roomId, {message: allMsg}, req);*/

    // 广播
    sails.sockets.blast({message: allMsg}, req);
  }

};
