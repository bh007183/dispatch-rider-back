

module.exports = function (sequelize, DataTypes) {
const User = sequelize.define('User', {
  // Model attributes are defined here
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING
    // allowNull defaults to true
  },
  username:{
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  connections: {
    type: DataTypes.STRING,
    defaultValue: "[]"
  },
  email: {
    type: DataTypes.STRING,
    validate: { isEmail: true }
},
password: {
    type: DataTypes.STRING,
    allowNull: false

},
isOnline: {
    type: DataTypes.BOOLEAN,
    defaultValue: false

}

}, {
  // Other model options go here
});
User.associate = function(models) {
    User.belongsTo(models.User);
    User.hasMany(models.Message)
  };
return User
}
