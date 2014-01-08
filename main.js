/*
 * Main battery status display script
 * author: @oliviernt
 */
(function(global) {
  var doc = global.document,
      navigator = global.navigator,
      display = doc.querySelector('.display');
  
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
          msg('Your battery is ' + (bat.charging ? '' : 'dis') + 'charging');
    
      if (bat.chargingTime !== Infinity)
        msg('Charging Time: ' + displayTime(bat.chargingTime));
    
      if (bat.dischargingTime !== Infinity)
        msg('Discharging Time: ' + displayTime(bat.dischargingTime));
    
      msg('Level: ' + (bat.level * 100) + '%' );
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