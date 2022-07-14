const db = require("../models");
const {
  permissionBranch,
  permissionCG,
  permissionCustomer,
  permissionUser,
} = require("../utils/getPermission");
var IO = require("../app");
const CallSheet = db.callsheets;

const newCallSheet = async (userId, type) => {
  const isBranch = await permissionBranch(userId, type);
  const isCG = await permissionCG(userId, type);
  const isCustomer = await permissionCustomer(userId, type);
  const isUser = await permissionUser(userId, type);
  const isWhere = [
    isCG.length > 0 && { id_customerGroup: isCG },
    isBranch.length > 0 && { id_branch: isBranch },
    isCustomer.length > 0 && { id_customer: isCustomer },
    isUser.length > 0 && { id_user: isUser },
  ];
  let finalWhere = [];
  if (
    isBranch.length > 0 ||
    isCG.length > 0 ||
    isUser.length > 0 ||
    isCustomer.length > 0
  ) {
    finalWhere = isWhere;
  }
  return await CallSheet.findAll({
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
        attributes: ["id", "name", "type", "status"],
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
  let data = {
    name: req.body.name,
    id_customer: req.body.id_customer,
    pic: req.body.pic,
    phone: req.body.phone,
    priceNote: req.body.priceNote,
    remindOrderNote: req.body.remindOrderNote,
    billingNote: req.body.billingNote,
    compInformNote: req.body.compInformNote,
    deliveryNote: req.body.deliveryNote,
    id_user: req.body.id_user,
    id_branch: req.body.id_branch,
    callType: req.body.callType,
    id_customerGroup: req.body.id_customerGroup,
  };
  try {
    const callsheets = await CallSheet.create(data);
    IO.setEmit("callsheets", await newCallSheet(req.userId, "callsheet"));
    res.status(200).json({
      status: true,
      message: "successfully save data",
      data: callsheets,
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.errors[0].message });
  }
};

const getAllCallSheet = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "callsheet");
  const isCG = await permissionCG(req.userId, "callsheet");
  const isCustomer = await permissionCustomer(req.userId, "callsheet");
  const isUser = await permissionUser(req.userId, "callsheet");
  const isWhere = [
    isCG.length > 0 && { id_customerGroup: isCG },
    isBranch.length > 0 && { id_branch: isBranch },
    isCustomer.length > 0 && { id_customer: isCustomer },
    isUser.length > 0 && { id_user: isUser },
  ];
  let finalWhere = [];
  if (
    isBranch.length > 0 ||
    isCG.length > 0 ||
    isUser.length > 0 ||
    isCustomer.length > 0
  ) {
    finalWhere = isWhere;
  }
  let callsheets = await CallSheet.findAll({
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
        attributes: ["id", "name", "type", "status"],
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
  IO.setEmit("callsheets", await newCallSheet(req.userId, "callsheet"));
  res.send(callsheets);
};

const getOneCallSheet = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "callsheet");
  const isCG = await permissionCG(req.userId, "callsheet");
  const isCustomer = await permissionCustomer(req.userId, "callsheet");
  const isUser = await permissionUser(req.userId, "callsheet");
  let id = req.params.id;
  let callsheets = await CallSheet.findOne({
    where: [
      { id: id },
      isCG.length > 0 && { id_customerGroup: isCG },
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
        attributes: ["id", "name", "type", "status"],
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
  if (callsheets) {
    res.status(200).send(callsheets);
  } else {
    res.status(400).json({
      status: false,
      message: "No data or you don't have access to this document!",
    });
  }
};

const updateCallSheet = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "callsheet");
  const isCG = await permissionCG(req.userId, "callsheet");
  const isCustomer = await permissionCustomer(req.userId, "callsheet");
  const isUser = await permissionUser(req.userId, "callsheet");
  let id = req.params.id;
  const callsheets = await CallSheet.update(req.body, {
    where: [
      { id: id },
      isCG.length > 0 && { id_customerGroup: isCG },
      isBranch.length > 0 && { id_branch: isBranch },
      isCustomer.length > 0 && { id_customer: isCustomer },
      isUser.length > 0 && { id_user: isUser },
    ],
  });
  if (callsheets > 0) {
    IO.setEmit("callsheets", await newCallSheet(req.userId, "callsheet"));
    res.status(200).json({
      status: true,
      message: "successfully save data",
      data: await newCallSheet(req.userId, "callsheet"),
    });
  } else {
    res.status(400).json({
      status: false,
      message: "No data or you don't have access to this document!",
    });
  }
};

const deleteCallSheet = async (req, res) => {
  const isBranch = await permissionBranch(req.userId, "callsheet");
  const isCG = await permissionCG(req.userId, "callsheet");
  const isCustomer = await permissionCustomer(req.userId, "callsheet");
  const isUser = await permissionUser(req.userId, "callsheet");
  let id = req.params.id;
  try {
    const hapus = await CallSheet.destroy({
      where: [
        { id: id },
        isCG.length > 0 && { id_customerGroup: isCG },
        isBranch.length > 0 && { id_branch: isBranch },
        isCustomer.length > 0 && { id_customer: isCustomer },
        isUser.length > 0 && { id_user: isUser },
      ],
    });
    if (hapus > 0) {
      IO.setEmit("callsheets", await newCallSheet(req.userId, "callsheet"));
      res.status(200).json({
        status: true,
        message: "successfully delete data",
        data: await newCallSheet(req.userId, "callsheet"),
      });
    } else {
      res.status(400).json({
        status: false,
        message: "No data or you don't have access to this document!",
      });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: error });
  }
};

module.exports = {
  create,
  getAllCallSheet,
  getOneCallSheet,
  updateCallSheet,
  deleteCallSheet,
};
