const db = require("../models");
var IO = require("../app");
const IsData = db.permission;

const newData = async () => {
  return await IsData.findAll({
    order: [["allow", "ASC"]],
    include: [
      { model: db.users, as: "user", attributes: ["id", "name"] },
      { model: db.users, as: "created", attributes: ["id", "name"] },
    ],
  });
};

const create = async (req, res) => {
  let input = {
    id_user: req.body.id_user,
    uniqid: req.body.doc
      ? req.body.id_user.toString() +
        req.body.allow.toString() +
        req.body.id_created.toString() +
        req.body.doc.toString()
      : req.body.id_user.toString() +
        req.body.allow.toString() +
        req.body.id_created.toString(),
    allow: req.body.allow,
    value: req.body.value,
    id_created: req.body.id_created,
    doc: req.body.doc,
  };

  try {
    const data = await IsData.create(input);
    IO.setEmit("permission", await newData());
    res.status(200).json({
      status: true,
      message: "successfully save data",
      data: data,
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.errors[0].message });
  }
};

const getAllData = async (req, res) => {
  let data = await IsData.findAll({
    order: [["allow", "ASC"]],
    include: [
      { model: db.users, as: "user", attributes: ["id", "name"] },
      { model: db.users, as: "created", attributes: ["id", "name"] },
    ],
  });
  IO.setEmit("permission", await newData());
  res.send(data);
};

const getOneData = async (req, res) => {
  let id = req.params.id;
  let data = await IsData.findOne({
    where: { id: id },
    include: [
      { model: db.users, as: "user", attributes: ["id", "name"] },
      { model: db.users, as: "created", attributes: ["id", "name"] },
    ],
  });
  res.status(200).send(data);
};

const updateData = async (req, res) => {
  let id = req.params.id;
  try {
    const data = await IsData.update(req.body, { where: { id: id } });
    if (data > 0) {
      IO.setEmit("permission", await newData());
      res.status(200).json({
        status: true,
        message: "successfully save data",
        data: await newData(),
      });
    } else {
      res.status(400).json({ status: false, message: "No Data" });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: "failed to update data" });
  }
};

const deleteData = async (req, res) => {
  let id = req.params.id;
  try {
    const data = await IsData.destroy({ where: { id: id } });
    if (hapdataus > 0) {
      IO.setEmit("permission", await newData());
      res.status(200).json({
        status: true,
        message: "successfully delete data",
        data: await newData(),
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
  getAllData,
  getOneData,
  updateData,
  deleteData,
};
