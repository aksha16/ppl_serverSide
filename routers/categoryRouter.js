const express = require("express");
const router = express.Router();
const api = require("../apis/categoryApi");
const multer = require("multer");

const uploadCategory = multer({
  dest: "/home/com122/Desktop/ppl/clientSide" + "/public/categoryPics"
});

router.get("/", (req, res) => {
  res.send("done!");
});

router.post(
  "/categoryUpload",
  uploadCategory.single("image"),
  async (req, res) => {
    try {
      console.log("is this running ..?");
      let obj = req.body;
      obj.image = req.file.filename;
      obj.name = obj.name.toLowerCase();
      let yes = await api.findByCategory(req.body.name);
      if (yes) {
        obj.status = true;
        console.log("category present ");
        res.send(obj);
      } else {
        obj.status = false;
        await api.uploadCategory(obj);
        console.log(obj, "category");
        res.send(obj);
      }
    } catch (err) {
      console.log("error", err);
    }
  }
);

router.post("/showcategory", async (req, res) => {
  console.log("is this been called !?");
  let data = await api.showCategory();
  res.send(data);
});

module.exports = router;
