/*
 * Main battery status display script
 * author: @oliviernt
 */
(function(global) {
  var doc = global.document,
      navigator = global.navigator,
      display = doc.querySelector('.display'),
      jumbotron = doc.querySelector('.jumbotron'),
      sound = doc.querySelector('.sound'),
      battery,
      WARNING_LEVEL = 10,
      DANGER_LEVEL = 4;

  function msg(txt, status) {
    status = status || 'success';
    var p = doc.createElement('p');
    p.innerHTML = txt;
    display.appendChild(p);
  }

  function displayTime(timeInSec) {
    var hours = Math.floor(timeInSec / 60 / 60),
        minutes = Math.floor(timeInSec / 60) - Math.floor(timeInSec / 60 / 60) * 60,
        seconds = 0;
    return hours + 'h ' + minutes + 'm';
  }

  function displayInfo() {
    display.innerHTML = '';
    msg('Your battery is <b>' + (battery.charging ? 'charging' : 'discharging') + '</b>.');
    if (battery.charging && battery.chargingTime !== global.Infinity) {
      msg('Time until fully charged: ' + displayTime(battery.chargingTime));
    } else if (battery.charging) {
      msg('Your battery is fully charged.');
    } else if (battery.dischargingTime !== global.Infinity) {
      msg('Time until fully discharged: ' + displayTime(battery.dischargingTime));
    }
    msg('Level: ' + (Math.round(battery.level * 10000) / 100) + '%' );
    displayLevelWarning();
  }

  function displayLevelWarning() {
    var level = Math.round(battery.level * 100);
    if (level <= DANGER_LEVEL && !battery.charging) {
      jumbotron.classList.remove('warning');
      jumbotron.classList.add('danger');
      msg('<b>Watch out your battey level is very low!</b>');
      msg('You should really connect your power cord of your device now.');
    } else if (level <= WARNING_LEVEL && !battery.charging) {
      jumbotron.classList.remove('danger');
      jumbotron.classList.add('warning');
      msg('<b>Watch out your battey level is low!</b>');
      msg('We\'d recommend connecting your power cord to your device now.');
    } else {
      jumbotron.classList.remove('danger');
      jumbotron.classList.remove('warning');
    }
  }

  function handleBattery(bat) {
    battery = bat;
    battery.addEventListener('chargingchange', displayInfo);
    battery.addEventListener('chargingtimechange', displayInfo);
    battery.addEventListener('dischargingtimechange', displayInfo);
    battery.addEventListener('levelchange', displayInfo);

    displayInfo();
  }

  if ('getBattery' in navigator) {
    navigator.getBattery().then(handleBattery);
  } else if ('batteyr' in navigator) {
    handleBattery(navigator.battery);
  } else {
    msg('Sorry, your browser doesn\'t support the BatteryManager Web API.');
  }
})(this);
