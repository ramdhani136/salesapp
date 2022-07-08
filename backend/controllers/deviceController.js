const db = require("../models");

const Devices = db.devices;

const newDevices = async () => {
  return await Devices.findAll({
    order: [["id", "DESC"]],
  });
};

const create = async (req, res) => {
  let data = {
    name: req.body.name,
    deskripsi: req.body.deskripsi,
  };
  try {
    const device = await Devices.create(data);
    req.socket.emit("devices", await newDevices());
    res.status(200).json({
      status: true,
      message: "successfully save data",
      data: device,
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.errors[0].message });
  }
};

const getAllDevice = async (req, res) => {
  let devices = await Devices.findAll({});
  req.socket.emit("devices", await newDevices());
  res.send(devices);
};

const getOneDevice = async (req, res) => {
  let id = req.params.id;
  let device = await Devices.findOne({ where: { id: id } });
  res.status(200).send(device);
};

const updateDevice = async (req, res) => {
  let id = req.params.id;
  const devices = await Devices.update(req.body, { where: { id: id } });
  if (devices > 0) {
    req.socket.emit("devices", await newDevices());
    res.status(200).json({
      status: true,
      message: "successfully save data",
      data: await newDevices(),
    });
  } else {
    res.status(400).json({ status: false, message: "failed to update data" });
  }
};

const deleteDevice = async (req, res) => {
  let id = req.params.id;
  try {
    const hapus = await Devices.destroy({ where: { id: id } });
    if (hapus > 0) {
      req.socket.emit("devices", await newDevices());
      res.status(200).json({
        status: true,
        message: "successfully delete data",
        data: await newDevices(),
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
  getAllDevice,
  getOneDevice,
  updateDevice,
  deleteDevice,
};
