const router = require("express").Router();
const { default: mongoose } = require("mongoose");
const semModel = require("../db/models/semModel");
const teacherModel = require("../db/models/teacherModel");
const auth = require("../controller/authCheck");
const batchModel = require("../db/models/batchModel");
const activityModel = require("../db/models/activityModel");
const courseModel = require("../db/models/courseModel");
const studentModel = require("../db/models/studentModel");

////////////MOOCS SYSTEM///////////////////////

//route-> http://localhost:5000/admin/getApi/getCourses
router.get("/getCourses", async (req, res) => {
  try {
    const course = await courseModel.find();
    res.json(course);
  } catch (err) {
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/getApi/mogetBatch
router.get("/mogetBatch", async (req, res) => {
  try {
    const batchs = await batchModel.find();
    res.json(batchs);
  } catch (err) {
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/getApi/getMoStudents/:id of batch
router.get("/getMoStudents/:id", async (req, res) => {
  try {
    const bid = req.params.id;
    const x = await batchModel.findById(bid);
    console.log(x);
    const data = await batchModel.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(bid),
        },
      },
      {
        $lookup: {
          from: "students",
          localField: "students",
          foreignField: "_id",
          as: "studentsObj",
        },
      },
    ]);
    res.json(data[0]);
  } catch (err) {
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/getApi/getmoStudent/:id of student
router.get("/getmoStudent/:id", async (req, res) => {
  try {
    const sid = req.params.id;
    const student = await studentModel.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(sid),
        },
      },
      {
        $lookup: {
          from: "moocscertificates",
          localField: "moocsCertificates",
          foreignField: "_id",
          as: "certificateObj",
        },
      },
    ]);
    res.json(student[0]);
  } catch (err) {
    res.send({ err: "server error" });
  }
});

////////////MAR SYSTEM///////////////////////

//route-> http://localhost:5000/admin/getApi/getBatch
router.get("/getBatch", async (req, res) => {
  try {
    const batchs = await batchModel.find();
    res.json(batchs);
  } catch (err) {
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/getApi/getStudents/:id of batch
router.get("/getStudents/:id", async (req, res) => {
  try {
    const bid = req.params.id;
    const data = await batchModel.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(bid),
        },
      },
      {
        $lookup: {
          from: "students",
          localField: "students",
          foreignField: "_id",
          as: "studentsObj",
        },
      },
    ]);
    console.log(data);
    res.json(data[0]);
  } catch (err) {
    console.log(err);
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/getApi/getActivites
router.get("/getActivites", async (req, res) => {
  try {
    const activity = await activityModel.find();
    res.json(activity);
  } catch (err) {
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/getApi/getStudent/:id of student
router.get("/getStudent/:id", async (req, res) => {
  try {
    const sid = req.params.id;
    const student = await studentModel.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(sid),
        },
      },
      {
        $lookup: {
          from: "certificates",
          localField: "activityCertificates",
          foreignField: "_id",
          as: "certificateObj",
        },
      },
      {
        $lookup: {
          from: "activitycounts",
          localField: "activityCount",
          foreignField: "_id",
          as: "countObj",
        },
      },
    ]);
    res.json(student[0]);
  } catch (err) {
    res.send({ err: "server error" });
  }
});

//////////FEEDBACK SYSTEM///////////////////////

//route-> http://localhost:5000/admin/getApi/getsem
router.get("/getSem", async (req, res) => {
  try {
    if (req.query.started) {
      const data = await semModel.find({ isstarted: req.query.started });
      res.json(data[0]);
    } else {
      const data = await semModel.find().sort({ batch: -1 });
      res.json(data);
    }
  } catch (err) {
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/getApi/getteacher/:id of sem
router.get("/getteacher/:id", async (req, res) => {
  try {
    const semid = req.params.id;
    const data = await semModel.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(semid),
        },
      },
      {
        $lookup: {
          from: "teachers",
          localField: "teachers",
          foreignField: "_id",
          as: "techerObj",
        },
      },
    ]);
    res.json(data[0]);
  } catch (err) {
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/getApi/getsingleteacher/:id of teacher
router.get("/getsingleteacher/:id", async (req, res) => {
  try {
    const techerid = req.params.id;
    var data = await teacherModel.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(techerid),
        },
      },
      {
        $lookup: {
          from: "feedbacks",
          localField: "opinions",
          foreignField: "_id",
          as: "opinionsObj",
        },
      },
    ]);
    data = data[0];

    res.json({
      subcode: data.subcode,
      subname: data.subname,
      teacher: data.teachername,
      totalres: data.totalresponse,
      opinions: data.opinionsObj,
      q1: {
        poorno: data.q1.poor,
        poorval: data.q1.poor * 20,
        fairno: data.q1.fair,
        fairval: data.q1.fair * 40,
        goodno: data.q1.good,
        goodval: data.q1.good * 60,
        vgoodno: data.q1.vgood,
        vgoodval: data.q1.vgood * 80,
        excellentno: data.q1.excellent,
        excellentval: data.q1.excellent * 100,
        total:
          data.q1.poor * 20 +
          data.q1.fair * 40 +
          data.q1.good * 60 +
          data.q1.vgood * 80 +
          data.q1.excellent * 100,
        avg:
          (data.q1.poor * 20 +
            data.q1.fair * 40 +
            data.q1.good * 60 +
            data.q1.vgood * 80 +
            data.q1.excellent * 100) /
          data.totalresponse,
      },
      q2: {
        poorno: data.q2.poor,
        poorval: data.q2.poor * 20,
        fairno: data.q2.fair,
        fairval: data.q2.fair * 40,
        goodno: data.q2.good,
        goodval: data.q2.good * 60,
        vgoodno: data.q2.vgood,
        vgoodval: data.q2.vgood * 80,
        excellentno: data.q2.excellent,
        excellentval: data.q2.excellent * 100,
        total:
          data.q2.poor * 20 +
          data.q2.fair * 40 +
          data.q2.good * 60 +
          data.q2.vgood * 80 +
          data.q2.excellent * 100,
        avg:
          (data.q2.poor * 20 +
            data.q2.fair * 40 +
            data.q2.good * 60 +
            data.q2.vgood * 80 +
            data.q2.excellent * 100) /
          data.totalresponse,
      },
      q3: {
        poorno: data.q3.poor,
        poorval: data.q3.poor * 20,
        fairno: data.q3.fair,
        fairval: data.q3.fair * 40,
        goodno: data.q3.good,
        goodval: data.q3.good * 60,
        vgoodno: data.q3.vgood,
        vgoodval: data.q3.vgood * 80,
        excellentno: data.q3.excellent,
        excellentval: data.q3.excellent * 100,
        total:
          data.q3.poor * 20 +
          data.q3.fair * 40 +
          data.q3.good * 60 +
          data.q3.vgood * 80 +
          data.q3.excellent * 100,
        avg:
          (data.q3.poor * 20 +
            data.q3.fair * 40 +
            data.q3.good * 60 +
            data.q3.vgood * 80 +
            data.q3.excellent * 100) /
          data.totalresponse,
      },
      q4: {
        poorno: data.q4.poor,
        poorval: data.q4.poor * 20,
        fairno: data.q4.fair,
        fairval: data.q4.fair * 40,
        goodno: data.q4.good,
        goodval: data.q4.good * 60,
        vgoodno: data.q4.vgood,
        vgoodval: data.q4.vgood * 80,
        excellentno: data.q4.excellent,
        excellentval: data.q4.excellent * 100,
        total:
          data.q4.poor * 20 +
          data.q4.fair * 40 +
          data.q4.good * 60 +
          data.q4.vgood * 80 +
          data.q4.excellent * 100,
        avg:
          (data.q4.poor * 20 +
            data.q4.fair * 40 +
            data.q4.good * 60 +
            data.q4.vgood * 80 +
            data.q4.excellent * 100) /
          data.totalresponse,
      },
      q5: {
        poorno: data.q5.poor,
        poorval: data.q5.poor * 20,
        fairno: data.q5.fair,
        fairval: data.q5.fair * 40,
        goodno: data.q5.good,
        goodval: data.q5.good * 60,
        vgoodno: data.q5.vgood,
        vgoodval: data.q5.vgood * 80,
        excellentno: data.q5.excellent,
        excellentval: data.q5.excellent * 100,
        total:
          data.q5.poor * 20 +
          data.q5.fair * 40 +
          data.q5.good * 60 +
          data.q5.vgood * 80 +
          data.q5.excellent * 100,
        avg:
          (data.q5.poor * 20 +
            data.q5.fair * 40 +
            data.q5.good * 60 +
            data.q5.vgood * 80 +
            data.q5.excellent * 100) /
          data.totalresponse,
      },
      q6: {
        poorno: data.q6.poor,
        poorval: data.q6.poor * 20,
        fairno: data.q6.fair,
        fairval: data.q6.fair * 40,
        goodno: data.q6.good,
        goodval: data.q6.good * 60,
        vgoodno: data.q6.vgood,
        vgoodval: data.q6.vgood * 80,
        excellentno: data.q6.excellent,
        excellentval: data.q6.excellent * 100,
        total:
          data.q6.poor * 20 +
          data.q6.fair * 40 +
          data.q6.good * 60 +
          data.q6.vgood * 80 +
          data.q6.excellent * 100,
        avg:
          (data.q6.poor * 20 +
            data.q6.fair * 40 +
            data.q6.good * 60 +
            data.q6.vgood * 80 +
            data.q6.excellent * 100) /
          data.totalresponse,
      },
      q7: {
        poorno: data.q7.poor,
        poorval: data.q7.poor * 20,
        fairno: data.q7.fair,
        fairval: data.q7.fair * 40,
        goodno: data.q7.good,
        goodval: data.q7.good * 60,
        vgoodno: data.q7.vgood,
        vgoodval: data.q7.vgood * 80,
        excellentno: data.q7.excellent,
        excellentval: data.q7.excellent * 100,
        total:
          data.q7.poor * 20 +
          data.q7.fair * 40 +
          data.q7.good * 60 +
          data.q7.vgood * 80 +
          data.q7.excellent * 100,
        avg:
          (data.q7.poor * 20 +
            data.q7.fair * 40 +
            data.q7.good * 60 +
            data.q7.vgood * 80 +
            data.q7.excellent * 100) /
          data.totalresponse,
      },
      q8: {
        poorno: data.q8.poor,
        poorval: data.q8.poor * 20,
        fairno: data.q8.fair,
        fairval: data.q8.fair * 40,
        goodno: data.q8.good,
        goodval: data.q8.good * 60,
        vgoodno: data.q8.vgood,
        vgoodval: data.q8.vgood * 80,
        excellentno: data.q8.excellent,
        excellentval: data.q8.excellent * 100,
        total:
          data.q8.poor * 20 +
          data.q8.fair * 40 +
          data.q8.good * 60 +
          data.q8.vgood * 80 +
          data.q8.excellent * 100,
        avg:
          (data.q8.poor * 20 +
            data.q8.fair * 40 +
            data.q8.good * 60 +
            data.q8.vgood * 80 +
            data.q8.excellent * 100) /
          data.totalresponse,
      },
      q9: {
        poorno: data.q9.poor,
        poorval: data.q9.poor * 20,
        fairno: data.q9.fair,
        fairval: data.q9.fair * 40,
        goodno: data.q9.good,
        goodval: data.q9.good * 60,
        vgoodno: data.q9.vgood,
        vgoodval: data.q9.vgood * 80,
        excellentno: data.q9.excellent,
        excellentval: data.q9.excellent * 100,
        total:
          data.q9.poor * 20 +
          data.q9.fair * 40 +
          data.q9.good * 60 +
          data.q9.vgood * 80 +
          data.q9.excellent * 100,
        avg:
          (data.q9.poor * 20 +
            data.q9.fair * 40 +
            data.q9.good * 60 +
            data.q9.vgood * 80 +
            data.q9.excellent * 100) /
          data.totalresponse,
      },
      q10: {
        poorno: data.q10.poor,
        poorval: data.q10.poor * 20,
        fairno: data.q10.fair,
        fairval: data.q10.fair * 40,
        goodno: data.q10.good,
        goodval: data.q10.good * 60,
        vgoodno: data.q10.vgood,
        vgoodval: data.q10.vgood * 80,
        excellentno: data.q10.excellent,
        excellentval: data.q10.excellent * 100,
        total:
          data.q10.poor * 20 +
          data.q10.fair * 40 +
          data.q10.good * 60 +
          data.q10.vgood * 80 +
          data.q10.excellent * 100,
        avg:
          (data.q10.poor * 20 +
            data.q10.fair * 40 +
            data.q10.good * 60 +
            data.q10.vgood * 80 +
            data.q10.excellent * 100) /
          data.totalresponse,
      },
    });
  } catch (err) {
    console.error(err);
    res.send({ err: "server error" });
  }
});

router.get("/sheet/");

module.exports = router;
