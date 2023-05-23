const router = require("express").Router();
const semModel = require("../db/models/semModel");
const teacherModel = require("../db/models/teacherModel");
const feedbackModel = require("../db/models/feedbackModel");
const auth = require("../controller/authCheck");
const batchModel = require("../db/models/batchModel");
const activityModel = require("../db/models/activityModel");
const activitycountModel = require("../db/models/activitycountModel");
const cetificateModel = require("../db/models/cetificateModel");
const studentModel = require("../db/models/studentModel");
const courseModel = require("../db/models/courseModel");
const coursecertificateModel = require("../db/models/coursecertificateModel");
const { default: mongoose } = require("mongoose");

/////////////////////MOOCS SYSTEM////////////////////////////////
//router->http://localhost:5000/admin/postApi/addCourse
router.post("/addCourse", async (req, res) => {
  try {
    const { name, duration, credit, website } = req.body;
    const course = await courseModel.findOne({ name: name });
    if (!course) {
      const newcourse = new courseModel({
        name: name,
        duration: duration,
        credit: credit,
        website: website,
      });
      await newcourse.save();
      res.send({ msg: "add course successful" });
    } else {
      res.send({ msg: "course already exist" });
    }
  } catch (err) {
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/postApi/deleteCourse/:id of course
router.delete("/deleteCourse/:id", async (req, res) => {
  try {
    await courseModel.findByIdAndDelete(req.params.id);
    res.send({ msg: "course deleted" });
  } catch (err) {
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/postApi/moaddBatch
router.post("/moaddBatch", async (req, res) => {
  try {
    const { batch } = req.body;
    const newbatch = new batchModel({ batch: batch });
    await newbatch.save();
    res.send({ msg: "add batch successful" });
  } catch (err) {
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/postApi/addMoCertificate/:id of student
router.post("/addMoCertificate/", async (req, res) => {
  try {
    const sid = req.query.id;
    const { name, imageurl } = req.body;
    const s = await studentModel.findById(sid);
    const course = await courseModel.findOne({ name: name });
    const newcertificate = new coursecertificateModel({
      name: name,
      imageurl: imageurl,
      s_id: sid,
      website: course.website,
      point: course.credit,
      duration: course.duration,
    });
    const cc = await newcertificate.save();
    s.moocsCertificates.push(cc._id);
    await s.save();
    res.send({ msg: "certificate added" });
  } catch (err) {
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/postApi/deleteMoCertificate/:id of certificate
router.delete("/deleteMoCertificate/", async (req, res) => {
  try {
    const cid = req.query.cid;
    const sid = req.query.sid;
    const s = await studentModel.findById(sid);
    s.moocsCertificates.pull(cid);
    await s.save();
    await coursecertificateModel.findByIdAndDelete(cid);
    res.json({ msg: "certificate delete succcessful" });
  } catch (err) {
    console.log(err);
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/postApi/verifyMoCertificate/?cid=1&sid=2
router.put("/verifyMoCertificate", async (req, res) => {
  try {
    const sid = req.query.sid;
    const cid = req.query.cid;
    const c = await coursecertificateModel.findByIdAndUpdate(cid, {
      isverified: true,
      ispending: false,
    });
    const s = await studentModel.findById(sid);
    await studentModel.findByIdAndUpdate(sid, {
      mocurrentpoint: s.mocurrentpoint + c.point,
    });
    res.send({ msg: "certificate verified" });
  } catch (err) {
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/postApi/rejectMoCertificate/?cid=1
router.put("/rejectMoCertificate", async (req, res) => {
  try {
    const { remark } = req.body;
    const cid = req.query.cid;
    const c = await coursecertificateModel.findByIdAndUpdate(cid, {
      isverified: false,
      ispending: false,
      remark: remark,
    });
    res.send({ msg: "certificate rejected" });
  } catch (err) {
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/postApi/finalMoUpdate/:id of student
router.put("/finalMoUpdate/:id", async (req, res) => {
  try {
    const sid = req.params.id;
    const s = await studentModel.findById(sid);
    const allr = await coursecertificateModel.findOne({
      s_id: sid,
      ispending: true,
    });
    if (allr) {
      return res.send({ msg: "check all pending requests" });
    }
    if (s.currentyear == 1) {
      await studentModel.findByIdAndUpdate(sid, {
        currentyear: s.currentyear + 1,
        mototal: s.mototal + s.mocurrentpoint,
        mofirstpoint: s.mocurrentpoint,
        mocurrentpoint: 0,
      });
    } else if (s.currentyear == 2) {
      await studentModel.findByIdAndUpdate(sid, {
        currentyear: s.currentyear + 1,
        mototal: s.mototal + s.mocurrentpoint,
        mosecondpoint: s.mocurrentpoint,
        mocurrentpoint: 0,
      });
    } else if (s.currentyear == 3) {
      await studentModel.findByIdAndUpdate(sid, {
        currentyear: s.currentyear + 1,
        mototal: s.mototal + s.mocurrentpoint,
        mothirdpoint: s.mocurrentpoint,
        mocurrentpoint: 0,
      });
    } else if (s.currentyear == 4) {
      await studentModel.findByIdAndUpdate(sid, {
        mototal: s.mototal + s.mocurrentpoint,
        mofourthpoint: s.mocurrentpoint,
        mocurrentpoint: 0,
      });
    }

    await studentModel.findByIdAndUpdate(sid, { moocsCertificates: [] });

    res.send({ msg: "final update complete" });
  } catch (err) {
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/postApi/modeleteStudent/?bid=1&sid=2
router.delete("/modeleteStudent/", async (req, res) => {
  try {
    const bid = req.query.bid;
    const sid = req.query.sid;
    const b = await batchModel.findById(bid);
    b.students.pull(sid);
    await b.save();
    await studentModel.findByIdAndDelete(sid);
    res.send({ msg: "student deleted" });
  } catch (err) {
    res.send({ err: "server error" });
  }
});

/////////////////////MAR SYSTEM////////////////////////////////

//route-> http://localhost:5000/admin/postApi/addBatch
router.post("/addBatch", async (req, res) => {
  try {
    const { batch } = req.body;
    const newbatch = new batchModel({ batch: batch });
    await newbatch.save();
    res.send({ msg: "add batch successful" });
  } catch (err) {
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/postApi/addActivity
router.post("/addActivity", async (req, res) => {
  try {
    const { name, minpoint, maxpoint } = req.body;
    const activity = await activityModel.findOne({ name: name });
    if (!activity) {
      const newactivity = new activityModel({
        name: name,
        minpoint: minpoint,
        maxpoint: maxpoint,
      });
      await newactivity.save();
      res.send({ msg: "add activity successful" });
    } else {
      res.send({ msg: "activity already exist" });
    }
  } catch (err) {
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/postApi/deleteActivity/:id of activity
router.delete("/deleteActivity/:id", async (req, res) => {
  try {
    await activityModel.findByIdAndDelete(req.params.id);
    res.send({ msg: "activity deleted" });
  } catch (err) {
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/postApi/deleteStudent/?bid=1&sid=2
router.delete("/deleteStudent/", async (req, res) => {
  try {
    const bid = req.query.bid;
    const sid = req.query.sid;
    const b = await batchModel.findById(bid);
    b.students.pull(sid);
    await b.save();
    await studentModel.findByIdAndDelete(sid);
    res.send({ msg: "student deleted" });
  } catch (err) {
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/postApi/addCertificate/:id of student
router.post("/addCertificate/:id", async (req, res) => {
  try {
    const { name, imageurl } = req.body;
    const sid = req.params.id;
    const student = await studentModel.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(sid),
        },
      },
      {
        $lookup: {
          from: "activitycounts",
          localField: "activityCount",
          foreignField: "_id",
          as: "activityCountObj",
        },
      },
    ]);
    const v = await studentModel.findById(sid);

    const activity = await activityModel.findOne({ name: name });
    let flag = true;
    student[0].activityCountObj.forEach(async (element) => {
      if (element.name == name && element.point == element.maxpoint) {
        flag = false;
        return res.json({ msg: "you already got max point" });
      } else if (element.name == name) {
        flag = false;
        const y = await activitycountModel.findByIdAndUpdate(element._id, {
          point: element.point + activity.minpoint,
        });
        const newcertificate = new cetificateModel({
          name: name,
          imageurl: imageurl,
          point: activity.minpoint,
          countid: y._id,
        });
        const x = await newcertificate.save();
        v.activityCertificates.push(x._id);
        await v.save();
        return res.json({ msg: "cerificate added successfully1" });
      }
    });

    if (flag == true) {
      const newacount = new activitycountModel({
        name: name,
        point: activity.minpoint,
        maxpoint: activity.maxpoint,
      });
      const y = await newacount.save();
      const newcertificate = new cetificateModel({
        name: name,
        imageurl: imageurl,
        point: activity.minpoint,
        countid: y._id,
      });
      const x = await newcertificate.save();
      v.activityCertificates.push(x._id);
      v.activityCount.push(y._id);
      await v.save();
      return res.json({ msg: "cerificate added successfully2" });
    }
  } catch (err) {
    console.log(err);
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/postApi/deleteCertificate/:id of certificate
router.delete("/deleteCertificate/", async (req, res) => {
  try {
    const cid = req.query.cid;
    const sid = req.query.sid;
    const c = await cetificateModel.findById(cid);
    const s = await studentModel.findById(sid);
    const acount = await activitycountModel.findById(c.countid);
    s.activityCertificates.pull(cid);
    await s.save();
    await activitycountModel.findByIdAndUpdate(c.countid, {
      point: acount.point - c.point,
    });
    await cetificateModel.findByIdAndDelete(cid);
    res.json({ msg: "certificate delete succcessful" });
  } catch (err) {
    console.log(err);
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/postApi/verifyCertificate/?cid=1&sid=2
router.put("/verifyCertificate", async (req, res) => {
  try {
    const sid = req.query.sid;
    const cid = req.query.cid;
    const c = await cetificateModel.findByIdAndUpdate(cid, {
      isverified: true,
      ispending: false,
    });
    const s = await studentModel.findById(sid);
    await studentModel.findByIdAndUpdate(sid, {
      currentpoint: s.currentpoint + c.point,
    });
    res.send({ msg: "certificate verified" });
  } catch (err) {
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/postApi/rejectCertificate/?cid=1
router.put("/rejectCertificate", async (req, res) => {
  try {
    const { remark } = req.body;
    const cid = req.query.cid;
    const c = await cetificateModel.findByIdAndUpdate(cid, {
      isverified: false,
      ispending: false,
      remark: remark,
    });
    res.send({ msg: "certificate rejected" });
  } catch (err) {
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/postApi/finalUpdate/:id of student
router.put("/finalUpdate/:id", async (req, res) => {
  try {
    const sid = req.params.id;
    const s = await studentModel.findById(sid);
    await studentModel.findByIdAndUpdate(sid, {
      marpreviouspoint: s.marpreviouspoint + s.currentpoint,
      currentpoint: 0,
    });
    s.activityCertificates.forEach(async (obj) => {
      await cetificateModel.findByIdAndDelete(obj);
    });

    await studentModel.findByIdAndUpdate(sid, { activityCertificates: [] });

    res.send({ msg: "final update complete" });
  } catch (err) {
    res.send({ err: "server error" });
  }
});

//////////////////////////feedback system////////////////////////////////

//route-> http://localhost:5000/admin/postApi/addsem
router.post("/addSem", auth, async (req, res) => {
  try {
    const { batch, semester, session } = req.body;
    const newsem = new semModel({ batch, semester, session });
    await newsem.save();
    res.status(200).send({ msg: "sem created successfully" });
  } catch (err) {
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/postApi/addteacher/:id of sem
router.post("/addteacher/:id", auth, async (req, res) => {
  try {
    const { subcode, subname, teachername } = req.body;
    const semid = req.params.id;
    const newteacher = new teacherModel({ subcode, subname, teachername });
    const teacher = await newteacher.save();
    const sem = await semModel.findById(semid);
    sem.teachers.push(teacher._id);
    await sem.save();
    res.status(200).send({ msg: "teacher created successfully" });
  } catch (err) {
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/postApi/startfeedback:id of sem
router.get("/startfeedback/:id", auth, async (req, res) => {
  try {
    const semid = req.params.id;
    const sem = await semModel.findById(semid);
    sem.isstarted = !sem.isstarted;
    await sem.save();
    res.status(200).send({ msg: "succesfully started" });
  } catch (err) {
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/postApi/deleteBatch:id of batch
router.delete("/deleteBatch/:id", auth, async (req, res) => {
  try {
    const batchid = req.params.id;
    await semModel.findByIdAndDelete(batchid);
    res.send({ msg: "delete successful" });
  } catch (err) {
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/postApi/deleteTeacher:id of teacher
router.delete("/deleteTeacher/:id", auth, async (req, res) => {
  try {
    const teacherid = req.params.id;
    await teacherModel.findByIdAndDelete(teacherid);
    res.send({ msg: "delete successful" });
  } catch (err) {
    res.send({ err: "server error" });
  }
});

//route-> http://localhost:5000/admin/postApi/addfeedback:id of teacher
router.post("/addfeedback/:id", async function (req, res) {
  try {
    const { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, opinion } = req.body;
    const teacherid = req.params.id;
    const techer = await teacherModel.findById(teacherid);
    techer.totalresponse++;

    if (opinion != "") {
      const newop = new feedbackModel({ opinion: opinion });
      const op = await newop.save();
      techer.opinions.push(op._id);
    }

    if (q1 == "poor") {
      techer.q1.poor++;
    } else if (q1 == "fair") {
      techer.q1.fair++;
    } else if (q1 == "good") {
      techer.q1.good++;
    } else if (q1 == "very good") {
      techer.q1.vgood++;
    } else if (q1 == "excellent") {
      techer.q1.excellent++;
    }

    if (q2 == "poor") {
      techer.q2.poor++;
    } else if (q2 == "fair") {
      techer.q2.fair++;
    } else if (q2 == "good") {
      techer.q2.good++;
    } else if (q2 == "very good") {
      techer.q2.vgood++;
    } else if (q2 == "excellent") {
      techer.q2.excellent++;
    }

    if (q3 == "poor") {
      techer.q3.poor++;
    } else if (q3 == "fair") {
      techer.q3.fair++;
    } else if (q3 == "good") {
      techer.q3.good++;
    } else if (q3 == "very good") {
      techer.q3.vgood++;
    } else if (q3 == "excellent") {
      techer.q3.excellent++;
    }

    if (q4 == "poor") {
      techer.q4.poor++;
    } else if (q4 == "fair") {
      techer.q4.fair++;
    } else if (q4 == "good") {
      techer.q4.good++;
    } else if (q4 == "very good") {
      techer.q4.vgood++;
    } else if (q4 == "excellent") {
      techer.q4.excellent++;
    }

    if (q5 == "poor") {
      techer.q5.poor++;
    } else if (q5 == "fair") {
      techer.q5.fair++;
    } else if (q5 == "good") {
      techer.q5.good++;
    } else if (q5 == "very good") {
      techer.q5.vgood++;
    } else if (q5 == "excellent") {
      techer.q5.excellent++;
    }

    if (q6 == "poor") {
      techer.q6.poor++;
    } else if (q6 == "fair") {
      techer.q6.fair++;
    } else if (q6 == "good") {
      techer.q6.good++;
    } else if (q6 == "very good") {
      techer.q6.vgood++;
    } else if (q6 == "excellent") {
      techer.q6.excellent++;
    }

    if (q7 == "poor") {
      techer.q7.poor++;
    } else if (q7 == "fair") {
      techer.q7.fair++;
    } else if (q7 == "good") {
      techer.q7.good++;
    } else if (q7 == "very good") {
      techer.q7.vgood++;
    } else if (q7 == "excellent") {
      techer.q7.excellent++;
    }

    if (q8 == "poor") {
      techer.q8.poor++;
    } else if (q8 == "fair") {
      techer.q8.fair++;
    } else if (q8 == "good") {
      techer.q8.good++;
    } else if (q8 == "very good") {
      techer.q8.vgood++;
    } else if (q8 == "excellent") {
      techer.q8.excellent++;
    }

    if (q9 == "poor") {
      techer.q9.poor++;
    } else if (q9 == "fair") {
      techer.q9.fair++;
    } else if (q9 == "good") {
      techer.q9.good++;
    } else if (q9 == "very good") {
      techer.q9.vgood++;
    } else if (q9 == "excellent") {
      techer.q9.excellent++;
    }

    if (q10 == "poor") {
      techer.q10.poor++;
    } else if (q10 == "fair") {
      techer.q10.fair++;
    } else if (q10 == "good") {
      techer.q10.good++;
    } else if (q10 == "very good") {
      techer.q10.vgood++;
    } else if (q10 == "excellent") {
      techer.q10.excellent++;
    }

    await techer.save();

    res.status(200).send({ msg: "feedback added" });
  } catch (err) {
    console.log(err);
    res.send({ err: "server error" });
  }
});

module.exports = router;
