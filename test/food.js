var assert    = require('chai').assert;
var webdriver = require('selenium-webdriver');
var test      = require('selenium-webdriver/testing');
foodStorage   = require('../lib/food')

test.describe('testing food', function() {
  var driver;
  this.timeout(10000);

  test.beforeEach(function() {
    driver = new webdriver.Builder()
      .forBrowser('chrome')
      .build();
  })

  test.afterEach(function() {
    driver.quit();
  })

  test.it('should allow me to fill in new food fields', function() {

    driver.get('http://localhost:8080/foods.html');

    var name = driver.findElement({id: 'food-name'});
    var calories = driver.findElement({id: 'food-calories'});
    name.sendKeys('this is a new food name');

    name.getAttribute('value').then(function(value) {
      assert.equal(value, 'this is a new food name');
    });

    calories.sendKeys('this is a new calorie amount');

    calories.getAttribute('value').then(function(value) {
      assert.equal(value, 'this is a new calorie amount');
    });
  });

  test.it('should allow me to create a new food', function() {

    driver.get('http://localhost:8080/foods.html');

    var name = driver.findElement({id: 'food-name'});
    var calories = driver.findElement({id: 'food-calories'});

    name.sendKeys('new');
    calories.sendKeys('1');
    driver.findElement({id: 'create-food'}).click();

    driver.findElement({className: 'table-body'}).getText().then(function(textValue) {
      assert.include(textValue, "new");
    });
  })

  test.it('should allow me to delete a food', function() {

    driver.get('http://localhost:8080/foods.html');

    var name = driver.findElement({id: 'food-name'});
    var calories = driver.findElement({id: 'food-calories'});

    name.sendKeys('new');
    calories.sendKeys('1');
    driver.findElement({id: 'create-food'}).click();
    driver.findElement({id: 'foods'}).getText().then(function(textValue) {
      assert.include(textValue, "new");
    });
    driver.findElement({className: 'delete-icon'}).click();

    driver.executeScript("localStorage.getItem('food')").then(function(food) {
      assert.equal(food, null);
    });
  })

  test.it('requires a name for adding a food', function(){

    driver.get('http://localhost:8080/foods.html');

    var calories = driver.findElement({id: 'food-calories'});
    var submitButton = driver.findElement({id: 'create-food'});
    var message = driver.findElement({id: 'message'});

    calories.sendKeys('100');
    submitButton.click();

    message.getText().then(function(messageText) {
      assert.equal(messageText, 'Please enter a food name');
    });
 })

  test.it('requires a calorie amount for adding a new food', function(){

    driver.get('http://localhost:8080/foods.html');

    var foodName = driver.findElement({id: 'food-name'});
    var submitButton = driver.findElement({id: 'create-food'});
    var message = driver.findElement({id: 'message'});

    foodName.sendKeys('new food name');
    submitButton.click();

    message.getText().then(function(messageText) {
      assert.equal(messageText, 'Please enter a calorie amount');
    });
  })

  test.it('clears input fields and warning messages after food is created', function(){

    driver.get('http://localhost:8080/foods.html');

    var foodName = driver.findElement({id: 'food-name'});
    var foodCalories = driver.findElement({id: 'food-calories'});
    var submitButton = driver.findElement({id: 'create-food'});
    var warningMessage = driver.findElement({id: 'message'});

    foodCalories.sendKeys('500');
    submitButton.click();

    warningMessage.getText().then(function(value) {
      assert.equal(value, 'Please enter a food name');
    });

    foodName.sendKeys('pizza');
    submitButton.click();

    foodName.getText().then(function(fieldValue){
      assert.equal(fieldValue, '');
    });

    foodCalories.getText().then(function(fieldValue){
      assert.equal(fieldValue, '');
    });

    warningMessage.getText().then(function(messageValue) {
      assert.equal(messageValue, '');
    });
  })

  test.it('should persist foods when browser refreshes', function(){

    driver.get('http://localhost:8080/foods.html');

    var caloriesAdded = JSON.stringify([{name: 'pizza', calories: '500'}]);
    driver.executeScript("window.localStorage.setItem('food-calories', '" + caloriesAdded + "');");

    driver.get("http://localhost:8080/foods.html");

    driver.executeScript("return window.localStorage.getItem('food-calories');").then(function(foodCalories){
      assert.equal(foodCalories, caloriesAdded);
    });
  })

});
