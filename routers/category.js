const express = require("express");
const router = express.Router();
const api = require("../apis/categories");
const multer = require("multer");

const uploadCategory = multer({
  dest: "/home/com122/Desktop/ppl/clientSide" + "/public/categoryPics"
});

///login/categoryupload
router.post(
    "/categoryUpload",
    uploadCategory.single("image"),
    async (req, res) => {
        try {
        console.log("is this running ..?");
      let obj = req.body;
      obj.image = req.file.filename;
      obj.category = obj.category.toLowerCase();
      let yes = await api.findByCategory(req.body.category);
      if(yes) {
        obj.status = true
          console.log("category present ");
          res.send(obj)
      }
      else {
        obj.status = false
      await api.uploadCategory(obj);
      console.log(obj, "category");
      res.send(obj);
      }
        }
  
  
        catch(err) {
            console.log("error", err);
        }
    }
  );

  //login/category
  router.post("/showcategory", async (req, res) => {
    console.log("is this been called !?");
    let data = await api.showCategory();
    //console.log("category has been sent", data);
    res.send(data);
  });