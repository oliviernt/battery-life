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
      WARNING_LEVEL = 10,
      DANGER_LEVEL = 4;
  
  function msg(txt, status) {
    status = status || 'success';
    var p = doc.createElement('p');
    p.innerHTML = txt;
    display.appendChild(p);
  }
  
  if ('battery' in navigator) {
    var bat = navigator.battery,
      displayTime = function (timeInSec) {
        var hours = Math.floor(timeInSec / 60 / 60),
            minutes = Math.floor(timeInSec / 60) - Math.floor(timeInSec / 60 / 60) * 60,
            seconds = 0;
        return hours + 'h ' + minutes + 'm';
      },
      displayInfo = function() {
        display.innerHTML = '';
        msg('Your battery is <b>' + (bat.charging ? '' : 'dis') + 'charging</b>');
        if (bat.chargingTime !== Infinity) {
          msg('Charging Time: ' + displayTime(bat.chargingTime));
        }
        if (bat.dischargingTime !== Infinity) {
          msg('Discharging Time: ' + displayTime(bat.dischargingTime));
        }
        msg('Level: ' + Math.round(bat.level * 100) + '%' );
        displayLevelWarning();
      },
      displayLevelWarning = function() {
        var level = Math.round(bat.level * 100);
        if (level <= DANGER_LEVEL && !bat.charging) {
          jumbotron.classList.remove('warning');
          jumbotron.classList.add('danger');
          msg('<b>Watch out your battey level is very low!</b>');
          msg('You should really connect your power cord of your device now.');
        } else if (level <= WARNING_LEVEL && !bat.charging) {
          jumbotron.classList.remove('danger');
          jumbotron.classList.add('warning');
          msg('<b>Watch out your battey level is low!</b>');
          msg('We\'d recommend connecting your power cord to your device now.');
        } else {
          jumbotron.classList.remove('danger');
          jumbotron.classList.remove('warning');
        }
      };
    
    bat.onchargingchange = displayInfo;
    bat.onchargingtimechange = displayInfo;
    bat.ondischargingtimechange = displayInfo;
    bat.onlevelchange = displayInfo;
    
    displayInfo();
    display.className += ' update';
  } else {
    msg('Sorry, your browser doesn\'t support the BatteryManager Web API.');
  }
})(this);