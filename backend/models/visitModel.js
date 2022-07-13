module.exports = (sequelize, DataTypes) => {
  const Visits = sequelize.define("visits", {
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
    id_task: { type: DataTypes.INTEGER, index: true },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
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
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    signature: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lng: {
      type: DataTypes.STRING,
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
    id_customerGroup: { type: DataTypes.INTEGER, index: true },
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

  return Visits;
};
