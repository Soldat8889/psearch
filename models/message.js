'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    idUSERS: DataTypes.INTEGER,
    content: DataTypes.STRING
  }, {});
  Message.associate = function(models) {
    models.Message.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    })
  };
  return Message;
};