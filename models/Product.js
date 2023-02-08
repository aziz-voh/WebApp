'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
 class Product extends Model {
   /**
    * Helper method for defining associations.
    * This method is not a part of Sequelize lifecycle.
    * The `models/index` file will call this method automatically.
    */
   static associate(models) {
     // define association here
   }
 }
 Product.init({


   name: {
     type: DataTypes.STRING,
     allowNull: true,
     validate: {
       notEmpty: { msg: 'Name must not be empty' },
     },
   },
   description: {
     type: DataTypes.STRING,
     allowNull: true,
     validate: {
       notEmpty: { msg: 'Description must not be empty' },
     },
   },
   sku: {
     type: DataTypes.STRING,
     allowNull: true,
     unique: true,//error capture
     validate: {
       notEmpty: { msg: 'sku must not be empty' },
     },
   },
   manufacturer: {
       type: DataTypes.STRING,
       allowNull: true,
       validate: {
         notEmpty: { msg: 'Manufacturer must not be empty' },
       },
     },
     quantity: {
       type: DataTypes.INTEGER,
       allowNull: true,
       validate: {
         notEmpty: { msg: 'Quantity must not be empty' },
         min:0,
         max:100
       },
     },
     owner_user_id:{
      type: DataTypes.INTEGER,
     }
 },
 {
   sequelize,
   modelName: 'Product',
   timestamps: true,
   createdAt: 'date_added',
   updatedAt:"date_last_updated"
 });
 return Product;
};
