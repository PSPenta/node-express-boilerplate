const Blacklist = require('./Blacklist');
const User = require('./User');

exports.initModels = (sequelize, { DataTypes }) => {
  const blacklist = Blacklist(sequelize, DataTypes);
  const user = User(sequelize, DataTypes);

  /**
   * Add associations like hasOne hasMany here
   */
  user.hasMany(blacklist, { foreignKey: 'userId' });
  blacklist.belongsTo(user, { foreignKey: 'userId' });

  /**
   * Attach your own custom properties and functions like below
   * If a table needs too many such custom functions,
   * add those in a file named, <model name>.helper.js and import it
   */
  // shopOrder.getRandom = (count = 1) =>
  // shopOrder.findAll({
  // raw: true,
  //   order: sequelize.literal("rand()"),
  //   limit: count
  // });

  return {
    blacklist,
    user
  };
};
