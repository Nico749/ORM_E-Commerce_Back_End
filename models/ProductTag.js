const { Model, DataTypes, INTEGER } = require('sequelize');

const sequelize = require('../config/connection');

class ProductTag extends Model {}

ProductTag.init(
  {
    id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      references:{
        model:'product',
        key:'id'
      },
    },
    tag_id:{
     type:DataTypes.INTEGER,
     references: {
      // This references the `tag` model and look for the id property
      model: 'tag',
      key: 'id',
    },
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_tag',
  }
);

module.exports = ProductTag;
