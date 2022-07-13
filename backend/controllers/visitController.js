const db = require("../models");
const sharp = require("sharp");
const path = require("path");

const Visits = db.visits;

const newVisit = async () => {
  return await Visits.findAll({
    include: [
      {
        model: db.users,
        as: "user",
        attributes: ["id", "name", "username", "email", "phone"],
      },
      {
        model: db.branch,
        as: "branch",
        attributes: ["id", "name"],
      },
      {
        model: db.customers,
        as: "customer",
        attributes: ["id", "name", "type"],
        include: [
          {
            model: db.customergroup,
            as: "customergroup",
            attributes: ["id", "name", "deskripsi", "status"],
          },
        ],
      },
    ],
    order: [["id", "DESC"]],
  });
};

const create = async (req, res) => {
  let data = await {
    name: req.body.name,
    id_customer: req.body.id_customer,
    address: req.body.address,
    pic: req.body.pic,
    phone: req.body.phone,
    category: req.body.category,
    priceNote: req.body.priceNote,
    remindOrderNote: req.body.remindOrderNote,
    billingNote: req.body.billingNote,
    compInformNote: req.body.compInformNote,
    img: req.body.name + ".jpg",
    signature: req.body.signature,
    lat: req.body.lat,
    lng: req.body.lng,
    id_user: req.body.id_user,
    id_branch: req.body.id_branch,
    id_branch: req.body.id_task,
  };

  try {
    const visits = await Visits.create(data);
    const compressedImage = await path.join(
      __dirname,
      "../public/images",
      req.body.name + ".jpg"
    );
    await sharp(req.file.path)
      .resize(640, 480)
      .jpeg({
        quality: 100,
        chromaSubsampling: "4:4:4",
      })
      .toFile(compressedImage, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
        }
      });
    res
      .status(200)
      .json({ status: true, message: "successfully save data", data: visits });
  } catch (error) {
    res.status(400).json({ status: false, message: error.errors[0].message });
  }

  // req.socket.emit("visits", await newVisit());
};

const getAllVisit = async (req, res) => {
  let visits = await Visits.findAll({
    include: [
      {
        model: db.users,
        as: "user",
        attributes: ["id", "name", "username", "email", "phone"],
      },
      {
        model: db.branch,
        as: "branch",
        attributes: ["id", "name"],
      },
      {
        model: db.customers,
        as: "customer",
        attributes: ["id", "name", "type"],
        include: [
          {
            model: db.customergroup,
            as: "customergroup",
            attributes: ["id", "name", "deskripsi", "status"],
          },
        ],
      },
    ],
    order: [["id", "DESC"]],
  });
  req.socket.emit("visits", await newVisit());
  res.send(visits);
};

const getOneVisit = async (req, res) => {
  let id = req.params.id;
  let visits = await Visits.findOne({
    where: { id: id },
    include: [
      {
        model: db.users,
        as: "user",
        attributes: ["id", "name", "username", "email", "phone"],
      },
      {
        model: db.branch,
        as: "branch",
        attributes: ["id", "name"],
      },
      {
        model: db.customers,
        as: "customer",
        attributes: ["id", "name", "type"],
        include: [
          {
            model: db.customergroup,
            as: "customergroup",
            attributes: ["id", "name", "deskripsi", "status"],
          },
        ],
      },
    ],
    order: [["id", "DESC"]],
  });
  res.status(200).send(visits);
};

const updateVisit = async (req, res) => {
  let id = req.params.id;
  try {
    const visits = await Visits.update(req.body, { where: { id: id } });
    req.socket.emit("visits", await newVisit());
    if (visits > 0) {
      res
        .status(200)
        .json({ message: "Successfull", status: true, data: await newVisit() });
    } else {
      res.status(400).json({ status: false, message: "No Data" });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: "failed to update data" });
  }
};

const deleteVisit = async (req, res) => {
  try {
    let id = req.params.id;
    const visitnya = await Visits.destroy({ where: { id: id } });
    req.socket.emit("visits", await newVisit());
    if (visitnya > 0) {
      res
        .status(200)
        .json({ message: "Successfull", status: true, data: await newVisit() });
    } else {
      res.status(500).json({ message: "No Data", status: false });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: "failed to delete data" });
  }
};

const message = async (req, res) => {
  var myModul = require("../utils/waBot");
  myModul.kirimpesan(req.body.number, req.body.message);
  res.send(req.body);
};

module.exports = {
  create,
  getAllVisit,
  getOneVisit,
  updateVisit,
  deleteVisit,
  message,
};
