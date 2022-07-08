module.exports = (sequelize, DataTypes) => {
  const CustomerGroup = sequelize.define("customergroup", {
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
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: { type: DataTypes.BOOLEAN, defaultValue: 1 },
  });

  return CustomerGroup;
};
