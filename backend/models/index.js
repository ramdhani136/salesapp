const dbConfig = require("../config/db");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log("DB Error" + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.devices = require("./deviceModel")(sequelize, DataTypes);
db.branch = require("./branchModel")(sequelize, DataTypes);
db.users = require("./userModel")(sequelize, DataTypes);
db.customergroup = require("./cutsomerGroup")(sequelize, DataTypes);
db.customers = require("./customerModel")(sequelize, DataTypes);
db.visits = require("./visitModel")(sequelize, DataTypes);
db.callsheets = require("./callSheetModel")(sequelize, DataTypes);
db.roleprofiles = require("./roleProfile")(sequelize, DataTypes);
db.rolelists = require("./roleList")(sequelize, DataTypes);
db.roleusers = require("./roleUser")(sequelize, DataTypes);

db.sequelize.sync({ force: false }).then(() => {
  console.log("resync!");
});

// relasi table db
// user
db.users.hasMany(db.roleprofiles, {
  foreignKey: "id_user",
  as: "roleprofile",
});

db.users.hasMany(db.roleusers, {
  foreignKey: "id_user",
  as: "role",
});

// visits
db.visits.belongsTo(db.users, {
  foreignKey: "id_user",
  as: "user",
});

db.visits.belongsTo(db.branch, {
  foreignKey: "id_branch",
  as: "branch",
});

db.visits.belongsTo(db.customers, {
  foreignKey: "id_customer",
  as: "customer",
});

// Callsheet
db.callsheets.belongsTo(db.users, {
  foreignKey: "id_user",
  as: "user",
});

db.callsheets.belongsTo(db.branch, {
  foreignKey: "id_branch",
  as: "branch",
});

db.callsheets.belongsTo(db.customers, {
  foreignKey: "id_customer",
  as: "customer",
});

// Role Profile
db.roleprofiles.hasMany(db.rolelists, {
  foreignKey: "id_role",
  as: "rolelist",
});

//Role User
db.roleusers.belongsTo(db.roleprofiles, {
  foreignKey: "id_roleprofile",
  as: "roleprofile",
});

module.exports = db;
