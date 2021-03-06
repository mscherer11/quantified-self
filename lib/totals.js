DailyMeals = require('./daily-meals')

class Totals {
  constructor(){}

  caloriesConsumed() {
    var data = [];
    var caloriesList = [];
    caloriesList = this.getCalories(this.createMealData(data));
    return this.getCaloriesSum(caloriesList);
  }

  caloriesBurned() {
    var rawData = JSON.parse(localStorage.dailyMeals);
    var data = rawData[0].data.exercise;
    var caloriesList = [];
    caloriesList = this.getCalories(data);
    return this.getCaloriesSum(caloriesList);
  }

  getCaloriesSum(caloriesList) {
    if (caloriesList.length == 0) {
      return 0;
    } else {
      return caloriesList.reduce(this.getSum);
    }
  }

  caloriesRemaining() {
    var goal = parseInt(document.getElementById('calories-goal').innerHTML)
    return goal + this.caloriesBurned() - this.caloriesConsumed();
  }

  flattenArrays(data) {
    var merged = [].concat.apply([], data);
    return merged;
  }

  getSum(total, calorieAmount) {
    return total + calorieAmount;
  }

  getCalories(data) {
    var final = data.map(function(object){
      return parseInt(object.calories);
    });
    return final;
  }

  createMealData(data) {
    var dailymeals = new DailyMeals;
    var meals = ['breakfast', 'lunch', 'dinner', 'snack'];
    var date = document.getElementById('today').innerHTML;
    var dayMeals = dailymeals.addOrGetMeals(date);
    for (var i = 0; i < meals.length; i++) {
      var mealData = dayMeals.data[meals[i]]
      data.push(mealData);
    }
    return this.flattenArrays(data);
  }

}
module.exports = Totals;
