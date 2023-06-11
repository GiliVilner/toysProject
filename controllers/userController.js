const { UserModel, createToken, validUser, validLogin } = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.userCtrl = {
    userList: async (req, res) => {
        try {
            let data = await UserModel.find({}, { password: 0 });
            res.json(data);
        }
        catch (err) {

            console.log(err)
            res.status(500).json({ msg: "err", err })
        }
    },
    userInfo: async (req, res) => {
        try {
            let info = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 });
            res.json(info);
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ msg: "err", err })
        }
    },
    signUp: async (req, res) => {
        let validBody = validUser(req.body);
        if (validBody.error) {
          return res.status(400).json(validBody.error.details);
        }
        try {
          let user = new UserModel(req.body);
    
          user.password = await bcrypt.hash(user.password, 10);
 
          await user.save();
          user.password = "*****";
          res.status(201).json(user);
        }
        catch (err) {
          if (err.code == 11000) {
            return res.status(500).json({ msg: "Email already in system, try log in", code: 11000 })
    
          }
          console.log(err);
          res.status(500).json({ msg: "err", err })
        }
      },
      login: async (req, res) => {
        let validBody = validLogin(req.body);
        if (validBody.error) {
          return res.status(400).json(validBody.error.details);
        }
        try {
          let user = await UserModel.findOne({ email: req.body.email })
          if (!user) {
            return res.status(401).json({ msg: "Password or email is worng ,code:1" })
          }
          let authPassword = await bcrypt.compare(req.body.password, user.password);
          if (!authPassword) {
            return res.status(401).json({ msg: "Password or email is worng ,code:2" });
          }
          let token = createToken(user._id, user.role);
          res.json({ token });
        }
        catch (err) {
          console.log(err)
          res.status(500).json({ msg: "err", err })
        }
      },
      editUser: async (req, res) => {
        let validBody = validUser(req.body);
        if (validBody.error) {
          return res.status(400).json(validBody.error.details);
        }
        try {
          let idEdit = req.params.idEdit;
          let data;
          if (req.tokenData.role === "admin") {
            data = await UserModel.updateOne({ _id: idEdit }, req.body)
          }
          else if (idEdit === req.tokenData._id) {
            data = await UserModel.updateOne({ _id: idEdit }, req.body)
          }
          if (!data) {
            return res.status(400).json({ err: "This operation is not enabled !" })
          }
          let user = await UserModel.findOne({ _id: idEdit });
          user.password = await bcrypt.hash(user.password, 10);
          await user.save()
          res.status(200).json({ msg: data })
        }
        catch (err) {
          console.log(err);
          res.status(400).json({ err })
        }
      },
      deleteAccount: async (req, res) => {
        try {
          let idDel = req.params.idDel;
          let data;
          if (req.tokenData.role === "admin") {
            data = await UserModel.deleteOne({ _id: idDel });
          }
          else if (idDel === req.tokenData._id) {
            data = await UserModel.deleteOne({ _id: idDel });
          }
          res.json(data);
        }
        catch (err) {
          console.log(err);
          res.status(500).json({ err })
        }
      }

};


