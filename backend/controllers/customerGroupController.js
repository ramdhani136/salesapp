const db = require("../models");
const jwt = require("jsonwebtoken");

const CustomerGroup = db.customergroup;

const newCG = async () => {
  return await CustomerGroup.findAll({
    order: [["id", "DESC"]],
    include: [
      { model: db.users, as: "user", attributes: ["id", "name"] },
      { model: db.branch, as: "branch", attributes: ["id", "name"] },
    ],
  });
};

const create = async (req, res) => {
  let data = {
    name: req.body.name,
    deskripsi: req.body.deskripsi,
    id_user: req.body.id_user,
    id_branch: req.body.id_branch,
  };
  try {
    const cg = await CustomerGroup.create(data);
    req.socket.emit("customergroup", await newCG());
    res.status(200).json({
      status: true,
      message: "successfully save data",
      data: cg,
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.errors[0].message });
  }
};

const getAllCG = async (req, res) => {
  let branchs = await db.permission.findAll({
    where: [{ id_user: req.userId }, { allow: "branch" }],
  });
  let isBranch = [];
  branchs.forEach((element) => {
    isBranch = [...isBranch, element.dataValues.value];
  });
  let cg = await CustomerGroup.findAll({
    where: isBranch.length > 0 && { id_branch: isBranch },
    order: [["id", "DESC"]],
    include: [
      { model: db.users, as: "user", attributes: ["id", "name"] },
      { model: db.branch, as: "branch", attributes: ["id", "name"] },
    ],
  });
  req.socket.emit("customergroup", await newCG());
  res.send(cg);
};

const getOneCG = async (req, res) => {
  let branchs = await db.permission.findAll({
    where: [{ id_user: req.userId }, { allow: "branch" }],
  });
  let isBranch = [];
  branchs.forEach((element) => {
    isBranch = [...isBranch, element.dataValues.value];
  });
  let id = req.params.id;
  let cg = await CustomerGroup.findOne({
    where: [{ id: id }, isBranch.length > 0 && { id_branch: isBranch }],
    include: [
      { model: db.users, as: "user", attributes: ["id", "name"] },
      { model: db.branch, as: "branch", attributes: ["id", "name"] },
    ],
  });
  res.status(200).send(cg);
};

const updateCG = async (req, res) => {
  let id = req.params.id;
  const cg = await CustomerGroup.update(req.body, { where: { id: id } });
  if (cg > 0) {
    req.socket.emit("customergroup", await newCG());
    res.status(200).json({
      status: true,
      message: "successfully save data",
      data: await newCG(),
    });
  } else {
    res.status(400).json({ status: false, message: "failed to update data" });
  }
};

const deleteCG = async (req, res) => {
  let id = req.params.id;
  try {
    const hapus = await CustomerGroup.destroy({ where: { id: id } });
    if (hapus > 0) {
      req.socket.emit("customergroup", await newCG());
      res.status(200).json({
        status: true,
        message: "successfully delete data",
        data: await newCG(),
      });
    } else {
      res.status(400).json({ status: false, message: "No data" });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: "failed to delete data" });
  }
};

module.exports = {
  create,
  getAllCG,
  getOneCG,
  updateCG,
  deleteCG,
};
