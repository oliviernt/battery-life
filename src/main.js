/*
 * Main battery status display script
 * author: @oliviernt
 */
(function(global) {
  const doc = global.document;
  const navigator = global.navigator;
  const display = doc.querySelector('.display');
  const jumbotron = doc.querySelector('.jumbotron');
  const sound = doc.querySelector('.sound');
  const WARNING_LEVEL = 10;
  const DANGER_LEVEL = 4;

  function msg(txt, status) {
    status = status || 'success';
    const p = doc.createElement('p');
    p.innerHTML = txt;
    display.appendChild(p);
  }

  function displayTime(timeInSec) {
    const hours = Math.floor(timeInSec / 60 / 60),
        minutes = Math.floor(timeInSec / 60) - Math.floor(timeInSec / 60 / 60) * 60,
        seconds = 0;
    return '<b>' + hours + 'h ' + minutes + 'm</b>';
  }

  function displayInfo(battery) {
    display.innerHTML = '';
    msg('Your battery is <b>' + (battery.charging ? 'charging' : 'discharging') + '</b>.');
    if (battery.charging && battery.chargingTime !== global.Infinity) {
      msg('Time until fully charged: ' + displayTime(battery.chargingTime));
    } else if (battery.charging) {
      msg('Your battery is fully charged.');
    } else if (battery.dischargingTime !== global.Infinity) {
      msg('Time until fully discharged: ' + displayTime(battery.dischargingTime));
    }
    msg('Level: <b>' + (Math.round(battery.level * 10000) / 100) + '%</b>' );
    displayLevelWarning(battery);
  }

  function displayLevelWarning(battery) {
    const level = Math.round(battery.level * 100);
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

  function handleBattery(battery) {
    battery.addEventListener('chargingchange', displayInfo.bind(null, battery));
    battery.addEventListener('chargingtimechange', displayInfo.bind(null, battery));
    battery.addEventListener('dischargingtimechange', displayInfo.bind(null, battery));
    battery.addEventListener('levelchange', displayInfo.bind(null, battery));

    displayInfo(battery);
  }

  if ('getBattery' in navigator) {
    navigator.getBattery().then(handleBattery);
  } else if ('battery' in navigator) {
    handleBattery(navigator.battery);
  } else {
    msg('Sorry, your browser doesn\'t support the BatteryManager Web API.');
  }
})(window);
