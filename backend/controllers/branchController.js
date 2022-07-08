const db = require("../models");

const Branch = db.branch;

const newBranch = async () => {
  return await Branch.findAll({
    order: [["id", "DESC"]],
  });
};

const create = async (req, res) => {
  let data = {
    name: req.body.name,
    deskripsi: req.body.deskripsi,
    lat: req.body.lat,
    lng: req.body.lng,
  };

  try {
    const branch = await Branch.create(data);
    req.socket.emit("branch", await newBranch());

    res
      .status(200)
      .json({ status: true, message: "successfully save data", data: branch });
  } catch (error) {
    res.status(400).json({ status: false, message: error.errors[0].message });
  }
};

const getAllBranch = async (req, res) => {
  let branch = await Branch.findAll({});
  req.socket.emit("branch", await newBranch());
  res.send(branch);
};

const getOneBranch = async (req, res) => {
  let id = req.params.id;
  let branch = await Branch.findOne({ where: { id: id } });
  res.status(200).send(branch);
};

const updateBranch = async (req, res) => {
  let id = req.params.id;
  try {
    const branch = await Branch.update(req.body, { where: { id: id } });
    if (branch > 0) {
      req.socket.emit("branch", await newBranch());
      res.status(200).json({
        status: true,
        message: "successfully save data",
        data: await newBranch(),
      });
    } else {
      res.status(400).json({ status: false, message: "No Data" });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: "failed to update data" });
  }
};

const deleteBranch = async (req, res) => {
  let id = req.params.id;
  try {
    const hapus = await Branch.destroy({ where: { id: id } });
    if (hapus > 0) {
      req.socket.emit("branch", await newBranch());
      res.status(200).json({
        status: true,
        message: "successfully delete data",
        data: await newBranch(),
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
  getAllBranch,
  getOneBranch,
  updateBranch,
  deleteBranch,
};
