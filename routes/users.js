const express= require("express");
const {auth, authAdmin} = require("../middlewares/auth");
const { userCtrl } = require("../controllers/userController");
const router=express.Router();

router.get("/myInfo",auth,userCtrl.userInfo);

router.get("/userList",authAdmin,userCtrl.userList);

router.post("/",userCtrl.signUp);

router.post("/login",userCtrl.login);

router.put("/idEdit",auth,userCtrl.editUser);

router.delete("/idDel",auth,userCtrl.deleteAccount);

module.exports = router;