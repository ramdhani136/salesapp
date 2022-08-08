const db = require("../models");
const sharp = require("sharp");
const path = require("path");
const {
  permissionBranch,
  permissionCG,
  permissionCustomer,
  permissionUser,
} = require("../utils/getPermission");
const { Op } = require("sequelize");
const { paddy } = require("../utils/paddy");
var IO = require("../app");

const Visits = db.visits;

const newVisit = async (userId, type) => {
  const isBranch = await permissionBranch(userId, type);
  const isCG = await permissionCG(userId, type);
  const isCustomer = await permissionCustomer(userId, type);
  const isUser = await permissionUser(userId, type);
  const isWhere = [
    isBranch.length > 0 && { id_branch: isBranch },
    isCustomer.length > 0 && { id_customer: isCustomer },
    isUser.length > 0 && { id_user: isUser },
  ];
  let finalWhere = [];
  if (isBranch.length > 0 || isUser.length > 0 || isCustomer.length > 0) {
    finalWhere = isWhere;
  }
  return await Visits.findAll({
    where: finalWhere,
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
        where: isCG.length > 0 && { id_customerGroup: isCG },
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
  const date =
    new Date().getFullYear().toString() +
    paddy(new Date().getMonth() + 1, 2).toString();
  const lastVisit = await db.visits.findOne({
    where: { name: { [Op.like]: `%${paddy(req.body.id_branch, 3)}${date}%` } },
    order: [["name", "DESC"]],
  });

  let isName = "";
  if (lastVisit) {
    let masterNumber = parseInt(
      lastVisit.name.substr(9, lastVisit.name.length)
    );

    isName =
      "VST" +
      paddy(req.body.id_branch, 3) +
      date +
      paddy(masterNumber + 1, 5).toString();
  } else {
    isName =
      "VST" + paddy(req.body.id_branch, 3) + date + paddy(1, 5).toString();
  }

  let data = await {
    name: isName,
    id_customer: req.body.id_customer,
    address: req.body.address,
    pic: req.body.pic,
    phone: req.body.phone,
    priceNote: req.body.priceNote,
    remindOrderNote: req.body.remindOrderNote,
    billingNote: req.body.billingNote,
    compInformNote: req.body.compInformNote,
    img: isName + ".jpg",
    signature: req.body.signature,
    lat: req.body.lat,
    lng: req.body.lng,
    id_user: req.body.id_user,
    id_branch: req.body.id_branch,
    status: req.body.status,
  };
  if (req.file != undefined) {
    try {
      const visits = await Visits.create(data);
      const compressedImage = await path.join(
        __dirname,
        "../public/images",
        isName + ".jpg"
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
      IO.setEmit("visits", await newVisit(req.userId, "visit"));

      res.status(200).json({
        status: true,
        message: "successfully save data",
        data: visits,
      });
    } catch (error) {
      console.log(error);
      res
        .status(400)
        .json({ status: false, message: `${error.table} is required` });
    }
  } else {
    res
      .status(400)
      .json({ status: false, message: "Please snap your images!" });
  }
};

const getAllVisit = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "visit");
  const isCG = await permissionCG(req.userId, "visit");
  const isCustomer = await permissionCustomer(req.userId, "visit");
  const isUser = await permissionUser(req.userId, "visit");
  const isWhere = [
    isBranch.length > 0 && { id_branch: isBranch },
    isCustomer.length > 0 && { id_customer: isCustomer },
    isUser.length > 0 && { id_user: isUser },
  ];
  let finalWhere = [];
  if (isBranch.length > 0 || isUser.length > 0 || isCustomer.length > 0) {
    finalWhere = isWhere;
  }
  let visits = await Visits.findAll({
    where: finalWhere,
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
        attributes: ["id", "name", "type", "id_customerGroup", "status"],
        where: isCG.length > 0 && { id_customerGroup: isCG },
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
  IO.setEmit("visits", await newVisit(req.userId, "visit"));
  res.send(visits);
};

const getOneVisit = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "visit");
  const isCG = await permissionCG(req.userId, "visit");
  const isCustomer = await permissionCustomer(req.userId, "visit");
  const isUser = await permissionUser(req.userId, "visit");
  let id = req.params.id;
  let visits = await Visits.findOne({
    where: [
      { id: id },
      isBranch.length > 0 && { id_branch: isBranch },
      isCustomer.length > 0 && { id_customer: isCustomer },
      isUser.length > 0 && { id_user: isUser },
    ],
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
        where: isCG.length > 0 && { id_customerGroup: isCG },
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
  if (visits) {
    res.status(200).send(visits);
  } else {
    res.status(400).json({
      status: false,
      message: "No data or you don't have access to this document!",
    });
  }
};

const updateVisit = async (req, res) => {
  let id = req.params.id;
  const allData = await newVisit(req.userId, "visit");
  isResult = allData.filter((item) => item.id == id);
  if (isResult.length > 0) {
    try {
      await db.visits.update(req.body, {
        where: { id: id },
      });
      IO.setEmit("visits", await newVisit(req.userId, "visit"));
      res.status(200).json({
        status: true,
        message: "successfully update data",
        data: await newVisit(req.userId, "visit"),
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error,
      });
    }
  } else {
    res.status(400).json({
      status: false,
      message: "No data or you don't have access to this document!",
    });
  }
};

const deleteVisit = async (req, res) => {
  let id = req.params.id;
  const allData = await newVisit(req.userId, "visit");
  isResult = allData.filter((item) => item.id == id);
  if (isResult.length > 0) {
    try {
      await db.visits.destroy({
        where: { id: id },
      });
      IO.setEmit("visits", await newVisit(req.userId, "visit"));
      res.status(200).json({
        status: true,
        message: "successfully delete data",
        data: await newVisit(req.userId, "visit"),
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error,
      });
    }
  } else {
    res.status(400).json({
      status: false,
      message: "No data or you don't have access to this document!",
    });
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
