'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class productos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  productos.init({
    nombre: DataTypes.STRING,
    precio: DataTypes.DECIMAL,
    descripcion: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'productos',
  });
  return productos;
};