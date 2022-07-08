const db = require("../models");

const Customers = db.customers;

const newCustomer = async () => {
  return await Customers.findAll({
    order: [["id", "DESC"]],
  });
};

const create = async (req, res) => {
  let data = {
    name: req.body.name,
    deskripsi: req.body.deskripsi,
    type: req.body.type,
    id_customerGroup: req.body.id_customerGroup,
    email: req.body.email,
    phone: req.body.phone,
    pic: req.body.pic,
    lat: req.body.lat,
    lng: req.body.lng,
  };
  try {
    const customer = await Customers.create(data);
    req.socket.emit("customers", await newCustomer());
    res.status(200).json({
      status: true,
      message: "successfully save data",
      data: customer,
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.errors[0].message });
  }
};

const getAllCustomer = async (req, res) => {
  let customer = await Customers.findAll({});
  req.socket.emit("customers", await newCustomer());
  res.send(customer);
};

const getOneCustomer = async (req, res) => {
  let id = req.params.id;
  let customer = await Customers.findOne({ where: { id: id } });
  res.status(200).send(customer);
};

const updateCustomer = async (req, res) => {
  let id = req.params.id;
  const customer = await Customers.update(req.body, { where: { id: id } });
  if (customer > 0) {
    req.socket.emit("customers", await newCustomer());
    res.status(200).json({
      status: true,
      message: "successfully save data",
      data: await newCustomer(),
    });
  } else {
    res.status(400).json({ status: false, message: "failed to update data" });
  }
};

const deleteCustomer = async (req, res) => {
  let id = req.params.id;
  try {
    const hapus = await Customers.destroy({ where: { id: id } });
    if (hapus > 0) {
      req.socket.emit("customers", await newCustomer());
      res.status(200).json({
        status: true,
        message: "successfully delete data",
        data: await newCustomer(),
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
  getAllCustomer,
  getOneCustomer,
  updateCustomer,
  deleteCustomer,
};
