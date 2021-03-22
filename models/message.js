

module.exports = function (sequelize, DataTypes) {
    const Message = sequelize.define('Message', {
      // Model attributes are defined here
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      },
     
    }, {
      // Other model options go here
    });
    Message.associate = function(models){
      Message.belongsTo(models.User)
    }
    return Message
    
    }
    