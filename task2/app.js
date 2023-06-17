//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose")
const _=require("lodash")

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect('mongodb://127.0.0.1:27017/database');
const items=mongoose.Schema({
  name:String
})
const item=mongoose.model("item",items)
const item1=new item({
  name:"working"
})
const item2=new item({
  name:"sleeping"
})
d=[item1,item2]
const listSchema={
  name:String,
  p:[items]
}
const list=mongoose.model("list",listSchema)

app.get("/", function(req, res) {
  item.find(function(err,f){
    if(f.length===0){
      item.insertMany(d,function(err){
        if(err){
          console.log("hello")
        }
        else{
          console.log("succesfull")
        }
      })
      res.redirect("/")
    }
    else{
      res.render("list", {listTitle: "Today", newListItems: f});
    }
});})
app.get("/:dhar",function(req,res){
  console.log(req.params.dhar)
  const ll=_.capitalize(req.params.dhar)
  list.findOne({name:ll},function(err,mm){
    if(!err){
      if(!mm){
        const list1=new list({
          name:ll,
          p:d
        })
        list1.save()
        res.redirect("/"+ll)
      }
      else{
        res.render("list",{listTitle:mm.name,newListItems:mm.p})
      }
    }
  })
})

app.post("/", function(req, res){
  const i = req.body.newItem
  const j=req.body.list
  const item3=new item({
    name:i
  })
  if(j==="Today"){
    item3.save()
    res.redirect("/")
  }
  else{
    list.findOne({name:j},function(err,kkk){
      kkk.p.push(item3)
      kkk.save()
      res.redirect("/"+j)
    })
  }
});
app.post("/delete",function(req,res){
  const id=req.body.checkbox
  const lo=req.body.listName
  if (lo==="Today"){
  item.findByIdAndRemove(id,function(err,f){
    if(!err){
      res.redirect("/")
      console.log("succesfully deleted")
    }
  })
}
else{
  list.findOneAndUpdate({name: lo}, {$pull: {p: {_id: id}}}, function(err, k){
         if (!err){
           res.redirect("/" + lo);
        }
      })
    }
})
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
