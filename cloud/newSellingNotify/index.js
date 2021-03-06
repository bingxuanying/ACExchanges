const cloud = require("wx-server-sdk");

cloud.init();
const db = cloud.database();
const _ = db.command;
// 功能1： 有人post了一个新的selling -> 心愿单里有的人收到新消息
exports.main = async (event, context) => {
  let { OPENID, APPID, UNIONID } = cloud.getWXContext();
  //news 需要的para: zh_name, img_url,  roomId, timestamp isUpdated(这里加), description
  let zh_name = event.zh_name;
  let roomId = event.roomId;
  let news = {};
  news.img_url = event.img_url;
  news.roomId = roomId;
  news.timestamp = event.timestamp;
  news.zh_name = zh_name;
  news.productId = roomId;
  news.description = "有人添加了出售!";
  news.isUpdated = true;
  let path = "wishlist." + zh_name + ".zh_name";
  let path2 = "tradeHistory.news.rooms." + roomId;
  db.collection("UsersProfile")
    .where({
      [path]: zh_name,
    })
    .update({
      data: {
        "tradeHistory.news.isUpdated": true,
        [path2]: news,
        "tradeHistory.isUpdated": true,
      },
    })
    .then((res) => {
      console.log("push news to who in wishlist: success");
    })
    .catch((res) => {
      console.log("push news to who in wishlist: fail");
      console.log(res);
    });
};
