'use strict';

var builtInVariableList = [
  'campaign',
  'pageName',
  'channel',
  'server',
  'purchaseID',
  'state',
  'zip',
  'pageType'
];
var maxIndexProps = 75;
var maxIndexEVars = 200;
var maxIndexListVars = 3;
var maxIndexHier = 10;

var getTracker = turbine.getSharedModule("adobe-analytics","get-tracker");

module.exports = function(settings) {
  var namespace = settings.namespace || "";
  if ("" !== namespace) {
    namespace = namespace + ".";
  }
  var mappings = settings.mappings;
  // recover tracker
  getTracker().then( function(tracker) {
    if (tracker) {
      // copy built-in variables first
      if (true === settings.page.copy) {
        for (var i = 0; i < builtInVariableList.length; i++) {
          var element = builtInVariableList[i];
          copyOrMove(settings.page.delete, tracker, namespace, element, settings.mappings);
        }
      }

      // copy events
      if (true === settings.events.copy || true === settings.builtInEvents.copy) {
        var newEvents = [];
        var events = tracker.events;
        if ('undefined' !== events && events) {
          events = events.split(',');
          for (var i = 0; i < events.length; i++) {
            var event = events[i];
            if ((true === settings.events.copy && event.indexOf('event') == 0) || true === settings.builtInEvents.copy) {
              var key = event;
              if ('undefined' !== mappings[event] && mappings[event]) {
                key = mappings[event];
              }
              tracker.contextData[namespace + key] = event;
              if ((true !== settings.events.delete && event.indexOf('event') == 0) || true !== settings.builtInEvents.delete) {
                newEvents.push(event);
              }
            }
          }
          tracker.events = newEvents.join(',');
        }
      }

      // copy eVars
      copyOrMoveNumberedVars(settings, tracker, namespace, mappings, 'eVars', 'eVar', maxIndexEVars);

      // copy props
      copyOrMoveNumberedVars(settings, tracker, namespace, mappings, 'props', 'prop', maxIndexProps);

      // copy listVars
      copyOrMoveNumberedVars(settings, tracker, namespace, mappings, 'listVars', 'list', maxIndexListVars);

      // copy hierarchy vars
      copyOrMoveNumberedVars(settings, tracker, namespace, mappings, 'hier', 'hier', maxIndexHier);

    } else {
      console.log('tracker not found');
    } // if tracker
  });
}

function copyOrMove(moveInstead, tracker, namespace, variable, mappings) {
  if ('undefined' !== tracker[variable] && tracker[variable]) {
    var key = variable;
    if ('undefined' !== mappings[variable] && mappings[variable]) {
      key = mappings[variable];
    }
    tracker.contextData[namespace + key] = tracker[variable];
    if (moveInstead && 'pageName' !== variable) {
      tracker[variable] = '';
    }
  }
}

function copyOrMoveNumberedVars(settings, tracker, namespace, mappings, group, vname, maxIndex) {
  if (true === settings[group].copy) {
    for (var i = 1; i <= maxIndex; i++) {
      var effectiveVarName = vname + i;
      var value = tracker[effectiveVarName];
      if ('undefined' !== typeof value && value) {
        if ('undefined' !== typeof mappings[effectiveVarName] && mappings[effectiveVarName]) {
          effectiveVarName = mappings[effectiveVarName];
        }
        tracker.contextData[namespace + effectiveVarName] = value;
        if (true === settings[group].delete) {
          tracker[vname + i] = '';
        }
      }
    }
  }
}