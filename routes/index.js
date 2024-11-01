var express = require('express');
var router = express.Router();
var mqtt = require('mqtt');
var sep = "\n";

// intégration de classe ItemList : 
var monItemList = require('../classItems');
console.log(monItemList.itemList);

var myItemsList=monItemList.itemList;
var Item=monItemList.Item;

//console.log("TEST INTÉGRATION : " + monItemList.tab[0].getLength);

// socket (Maxime-bouffard-style)
var socketApi = require("../socketAPI");
var io = socketApi.io;
io.sockets.on('connection', function(socket) {
  console.log("socket connecté !");
  socket.emit("cnxOK", "vous êtes bien connecté via SOCKET");
})

// mqtt
var client = mqtt.connect('mqtt://127.0.0.1:1883');
client.on('connect', function () {
      console.log("MQTT connecté !");
});
client.subscribe('ITEM/#');
client.on("message", function(topic, message) {
  //console.log(topic.toString());
  //console.log(message.toString());
  if(topic.indexOf("ITEM/MODULE") !== -1) {
    if (topic.indexOf("NEW") !== -1) {
      var mySplit = message.toString().split(sep);
      var myName = mySplit[0];
      var myPrice = mySplit[1];
      //console.log(mySplit);
      var it = new Item(myItemsList.getLastItemId()+1,myName, parseFloat(myPrice));
      myItemsList.add(it);
      // add here refresh page
      //location.reload();
    } else if (topic.indexOf("DELETE/ID") !== -1) {
      var delId = Number(message.toString());
      if (myItemsList.removeItemById(delId)) {
        console.log("OK");
        // add here refresh page
      }
    } else if (topic.indexOf("DELETE/NAME") !== -1) {
      var delN = message.toString().replace(/(\r\n|\n|\r)/gm, "");
      console.log("DELETE BY NAME : "+delN);
      if (myItemsList.removeItemByName(delN)) {
        console.log("OK");
        // add here refresh page
      }
    } else {
        console.log("bad id from module");
    }
  }
});

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('pages/index', { title: 'Express', listItems: myItemsList });
});

router.post('/', function(req, res, next) {
  console.log(req.body);
  if (typeof (req.body.supprID) !== "undefined") {
    if (myItemsList.removeItemById(Number(req.body.supprID))) {
      console.log(myItemsList);
      var st = String(req.body.supprID);
      client.publish('ITEM/WEB/DELETE/ID', st);
    } else {
      console.log("undefined item");
    }
  }
  if (typeof (req.body.supprNom) !== "undefined") {
    if (myItemsList.removeItemByName(req.body.supprNom)) {
      console.log(myItemsList);
      var st = String(req.body.supprNom);
      client.publish('ITEM/WEB/DELETE/NAME', st);
    } else {
      console.log("undefined item");
    }
  }
  if (typeof (req.body.addNom) !== "undefined" && typeof (req.body.addPrix) !== "undefined" ) {
    if (parseFloat(req.body.addPrix) > 0) {
      //console.log(myItemsList);
      var it = new Item(myItemsList.getLastItemId()+1,req.body.addNom, parseFloat(req.body.addPrix));
      //it.init((myItemsList.getLength())+1,req.body.addNom, parseFloat(req.body.addPrix));
      //it.init(myItemsList.getLastItemId()+1,req.body.addNom, parseFloat(req.body.addPrix));
      myItemsList.add(it);
      var st = String(it.id);
      st += sep;
      st += it.dateCreation;
      st += sep;
      st += it.nom;
      st += sep;
      st += String(it.prix);
      client.publish('ITEM/WEB/NEW', st);
    } else {
      console.log("undefined price");
    }
  }
  res.render('pages/index', { title: 'Express', listItems: myItemsList });
});

module.exports = router;
