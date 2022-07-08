const { Op } = require("sequelize");
const db = require("../models");

const RoleList = db.rolelists;

const newData = async () => {
  return await RoleList.findAll({
    order: [["id", "DESC"]],
  });
};

const create = async (req, res) => {
  let data = {
    id_role: req.body.id_role,
    doc: req.body.doc,
    roleid: req.body.id_role.tiString() + req.body.doc,
    create: req.body.create,
    read: req.body.read,
    update: req.body.update,
    delete: req.body.delete,
    amend: req.body.amend,
    submit: req.body.submit,
    report: req.body.report,
    export: req.body.export,
  };

  try {
    const rolelist = await RoleList.create(data);
    req.socket.emit("rolelist", await newData());

    res.status(200).json({
      status: true,
      message: "successfully save data",
      data: rolelist,
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.errors[0].message });
  }
};

const getAllRoleList = async (req, res) => {
  let rolelist = await RoleList.findAll({});
  req.socket.emit("rolelist", await newData());
  res.send(rolelist);
};

const getOneRoleList = async (req, res) => {
  let id = req.params.id;
  let rolist = await RoleList.findOne({ where: { id: id } });
  res.status(200).send(rolist);
};

const updateRoleList = async (req, res) => {
  let id = req.params.id;
  try {
    const rolist = await RoleList.update(req.body, { where: { id: id } });
    if (rolist > 0) {
      req.socket.emit("rolelist", await newData());
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

const deleteRoleList = async (req, res) => {
  let id = req.params.id;
  try {
    const hapus = await RoleList.destroy({ where: { id: id } });
    if (hapus > 0) {
      req.socket.emit("rolelist", await newData());
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
  getAllRoleList,
  getOneRoleList,
  updateRoleList,
  deleteRoleList,
};
