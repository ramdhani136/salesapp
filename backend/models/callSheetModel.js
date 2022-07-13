module.exports = (sequelize, DataTypes) => {
  const CallSheets = sequelize.define("callsheets", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    id_customer: { type: DataTypes.INTEGER, index: true },
    id_customerGroup: { type: DataTypes.INTEGER, index: true },
    pic: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM("daily", "manual"),
    },
    callType: {
      type: DataTypes.ENUM("in", "out"),
    },
    priceNote: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    remindOrderNote: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    billingNote: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    compInformNote: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    deliveryNote: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      index: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    surveyNote: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    id_branch: {
      type: DataTypes.INTEGER,
      allowNull: false,
      index: true,
    },
    surveyAt: {
      type: DataTypes.DATE,
    },
    isSurvey: { type: DataTypes.BOOLEAN, defaultValue: 0 },
    status: { type: DataTypes.BOOLEAN, defaultValue: 1 },
  });

  return CallSheets;
};
