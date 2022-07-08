const { Op } = require("sequelize");
const db = require("../models");

const RoleProfile = db.roleprofiles;

const newProfile = async () => {
  return await RoleProfile.findAll({
    order: [["id", "DESC"]],
  });
};

const create = async (req, res) => {
  let data = {
    name: req.body.name,
    id_user: req.body.deskripsi,
    status: req.body.status,
  };

  try {
    const roleprofile = await RoleProfile.create(data);
    req.socket.emit("roleprofiles", await newProfile());

    res.status(200).json({
      status: true,
      message: "successfully save data",
      data: roleprofile,
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.errors[0].message });
  }
};

const getAllProfile = async (req, res) => {
  let roleprofile = await RoleProfile.findAll({
    include: [
      {
        model: db.rolelists,
        as: "rolelist",
        where: {
          status: 1,
        },
        attributes: [
          "id",
          "doc",
          "create",
          "read",
          "update",
          "delete",
          "amend",
          "submit",
          "report",
          "export",
        ],
      },
    ],
  });
  req.socket.emit("roleprofiles", await newProfile());
  res.send(roleprofile);
};

const getOneProfile = async (req, res) => {
  let id = req.params.id;
  let profile = await RoleProfile.findOne({ where: { id: id } });
  res.status(200).send(profile);
};

const updateProfile = async (req, res) => {
  let id = req.params.id;
  try {
    const profile = await RoleProfile.update(req.body, { where: { id: id } });
    if (profile > 0) {
      req.socket.emit("roleprofiles", await newProfile());
      res.status(200).json({
        status: true,
        message: "successfully save data",
        data: await newProfile(),
      });
    } else {
      res.status(400).json({ status: false, message: "No Data" });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: "failed to update data" });
  }
};

const deleteProfile = async (req, res) => {
  let id = req.params.id;
  try {
    const hapus = await RoleProfile.destroy({ where: { id: id } });
    if (hapus > 0) {
      req.socket.emit("roleprofiles", await newProfile());
      res.status(200).json({
        status: true,
        message: "successfully delete data",
        data: await newProfile(),
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
  getAllProfile,
  getOneProfile,
  updateProfile,
  deleteProfile,
};
