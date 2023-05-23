const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const adminModel = require("../db/models/adminModel");
const studentModel = require("../db/models/studentModel");
const batchModel = require("../db/models/batchModel");

//route-> http://localhost:5000/admin/auth/register
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hash = bcrypt.hashSync(password, saltRounds);
    const newAdmin = new adminModel({ email: email, password: hash });
    await newAdmin.save();
    res.send({ msg: "admin register successful" });
  } catch (err) {
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await adminModel.findOne({ email: email });
    if (!admin) {
      res.send({ msg: "invalid credential" });
    } else if (!bcrypt.compareSync(password, admin.password)) {
      res.send({ msg: "invalid credential" });
    } else {
      const token = jwt.sign(
        {
          id: admin._id,
          email: admin.email,
        },
        "xxEEzz",
      );
      res.send({ msg: "admin login seccessful", token: token });
    }
  } catch (err) {
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/auth/sregister/:id of batch
router.post("/sregister/:id", async (req, res) => {
  try {
    const { name, username, password, previouspoint } = req.body;
    const student = await studentModel.findOne({ username: username });
    const bid = req.params.id;
    if (!student) {
      const newstudent = new studentModel({
        name: name,
        username: username,
        password: password,
        previouspoint: previouspoint,
      });
      const s = await newstudent.save();
      const batch = await batchModel.findById(bid);
      batch.students.push(s._id);
      await batch.save();
      res.send({ msg: "student registration successful" });
    } else {
      res.send({ msg: "student already added" });
    }
  } catch (err) {
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/auth/mosregister/:id of batch
router.post("/mosregister/:id", async (req, res) => {
  try {
    const {
      name,
      username,
      password,
      currentyear,
      marpreviouspoint,
      mofirstpoint,
      mosecondpoint,
      mothirdpoint,
      mofourthpoint,
    } = req.body;
    const student = await studentModel.findOne({ username: username });
    const bid = req.params.id;
    if (!student) {
      const newstudent = new studentModel({
        name: name,
        username: username,
        password: password,
        marpreviouspoint: marpreviouspoint,
        currentyear: currentyear,
        mofirstpoint: mofirstpoint,
        mosecondpoint: mosecondpoint,
        mothirdpoint: mothirdpoint,
        mofourthpoint: mofourthpoint,
        mototal:
          parseInt(mofirstpoint) +
          parseInt(mosecondpoint) +
          parseInt(mothirdpoint) +
          parseInt(mofourthpoint),
      });
      const s = await newstudent.save();
      const batch = await batchModel.findById(bid);
      batch.students.push(s._id);
      await batch.save();
      res.send({ msg: "student registration successful" });
    } else {
      res.send({ msg: "student already added" });
    }
  } catch (err) {
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/auth/slogin
router.post("/slogin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const student = await studentModel.findOne({
      username: username,
      password: password,
    });
    if (student) {
      const stoken = jwt.sign(
        {
          id: student._id,
          usename: student.username,
        },
        "xFuck",
      );
      res.send({ msg: "student login seccessful", stoken: stoken });
    } else {
      res.send({ msg: "invalid credential" });
    }
  } catch (err) {
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/auth/moslogin
router.post("/moslogin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const student = await studentModel.findOne({
      username: username,
      password: password,
    });
    if (student) {
      const stoken = jwt.sign(
        {
          id: student._id,
          usename: student.username,
        },
        "xFuck",
      );
      res.send({ msg: "student login seccessful", stoken: stoken });
    } else {
      res.send({ msg: "invalid credential" });
    }
  } catch (err) {
    res.send({ err: "server error" });
  }
});

module.exports = router;
