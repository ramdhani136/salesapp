const db = require("../models");

const CallSheet = db.callsheets;

const newCallSheet = async () => {
  return await CallSheet.findAll({
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
    category: req.body.category,
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
    req.socket.emit("callsheets", await newCallSheet());
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
  let callsheets = await CallSheet.findAll({
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
  req.socket.emit("callsheets", await newCallSheet());
  res.send(callsheets);
};

const getOneCallSheet = async (req, res) => {
  let id = req.params.id;
  let callsheets = await CallSheet.findOne({
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
  res.status(200).send(callsheets);
};

const updateCallSheet = async (req, res) => {
  let id = req.params.id;
  const callsheets = await CallSheet.update(req.body, { where: { id: id } });
  if (callsheets > 0) {
    req.socket.emit("callsheets", await newCallSheet());
    res.status(200).json({
      status: true,
      message: "successfully save data",
      data: await newCallSheet(),
    });
  } else {
    res.status(400).json({ status: false, message: "failed to update data" });
  }
};

const deleteCallSheet = async (req, res) => {
  let id = req.params.id;
  try {
    const hapus = await CallSheet.destroy({ where: { id: id } });
    if (hapus > 0) {
      req.socket.emit("callsheets", await newCallSheet());
      res.status(200).json({
        status: true,
        message: "successfully delete data",
        data: await newCallSheet(),
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
  getAllCallSheet,
  getOneCallSheet,
  updateCallSheet,
  deleteCallSheet,
};
