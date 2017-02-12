document.body.onload = init;

const MIN_RENDER_MS    = 1000 / 60;
const WAGE_TYPE_HOURLY = 'hour';
const WAGE_TYPE_YEARLY = 'year';

var msPerTimePeriod = {};
msPerTimePeriod[WAGE_TYPE_HOURLY] = 1000 * 60 * 60;
msPerTimePeriod[WAGE_TYPE_YEARLY] = 1000 * 60 * 60 * 40 * 52;

// Elements
var wageCounter;
var wageInput;
var wageTypeSelect;
var setWageButton;

// State
var msPerPenny;
var timePerRender;
var startDateMs;
var elapsedTimeMs;

var settings = {};

function init() {
  wageCounter      = document.getElementById('wage-counter');
  wageInput        = document.getElementById('input-wage-amount');
  wageTypeSelect   = document.getElementById('select-wage-type');
  setWageButton    = document.getElementById('button-set-wage');

  setWageButton.addEventListener('click', startCounting);
}

function startCounting() {
  var wageType = wageTypeSelect.options[wageTypeSelect.selectedIndex].value;
  var wageInPennies = wageInput.value * 100;
  msPerPenny = msPerTimePeriod[wageType] / wageInPennies;
  timePerRender = Math.max(msPerPenny, MIN_RENDER_MS);
  startDateMs = Date.now();
  setCounter(0);
  setTimeout(updateCounter, timePerRender);
}

function updateCounter() {
  elapsedTimeMs = Date.now() - startDateMs;
  setCounter(Math.floor(elapsedTimeMs / msPerPenny) / 100);
  // Just to make sure we tick regularly and don't skip/hang
  setTimeout(updateCounter, timePerRender - (elapsedTimeMs % timePerRender));
}

function setCounter(value) {
  value = '$' + value.toFixed(2);
  wageCounter.textContent = value;
  document.title = 'Wagebucket - ' + value;
}
