module.exports = (sequelize, DataTypes) => {
  const Devices = sequelize.define("devices", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deskripsi: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.BOOLEAN, defaultValue: 1 },
  });

  return Devices;
};
