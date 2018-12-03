'use strict';

// recover tracker
const augmentTracker = turbine.getSharedModule("adobe-analytics","augment-tracker");

module.exports = function(settings) {
  var namespace = settings.namespace || "";
  if ("" !== namespace) {
    namespace = namespace + ".";
  }

  if (augmentTracker) {
    augmentTracker( function(tracker) {
      if (tracker) {
        // iterate through cd vars
        for (var key in settings.contextData) {
          var cdName = namespace + key;
          var cdValue = settings.contextData[key];
          tracker.contextData[cdName] = cdValue;
        }
      }
    });
  }
};
