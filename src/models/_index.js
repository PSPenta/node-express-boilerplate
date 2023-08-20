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

  /** ** Example Relationships */
  /** Sequelize One-To-One relationship */
  // user.hasOne(profile, { foreignKey: 'userId' });
  // profile.belongsTo(user, {
  //   constraints: true,
  //   onDelete: 'CASCADE',
  //   foreignKey: 'userId'
  // });

  /** Sequelize One-To-Many relationship */
  // user.hasMany(product);
  // product.belongsTo(user, {
  //   constraints: true,
  //   onDelete: 'CASCADE'
  // });

  /** Sequelize Many-To-Many relationship */
  // user.belongsToMany(product, {
  //   through: this.model('UserProducts'),
  //   constraints: true,
  //   onDelete: 'CASCADE'
  // });
  // product.belongsToMany(user, {
  //   through: this.model('UserProducts'),
  //   constraints: true,
  //   onDelete: 'CASCADE'
  // });
  /** ** Example Relationships */

  return {
    blacklist,
    user
  };
};
