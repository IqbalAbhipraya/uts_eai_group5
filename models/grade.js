'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Grade extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Grade.belongsTo(models.Student, { foreignKey: 'studentId'});
      Grade.belongsTo(models.Course, { foreignKey: 'courseId'});
    }
  }
  Grade.init({
    studentId: DataTypes.INTEGER,
    courseId: DataTypes.INTEGER,
    grade: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Grade',
  });
  return Grade;
};