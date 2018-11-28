'use strict';

const builtInVariableList = [
  'campaign',
  'pageName',
  'channel',
  'server',
  'purchaseID',
  'state',
  'zip',
  'pageType'
];
const builtInEventsList = [
  'purchase',
  'scCheckout',
  'scAdd',
  'scView',
  'scOpen',
  'scRemove',
];
const maxIndexProps = 75;
const maxIndexEVars = 200;
const maxIndexEvents = 1000;

module.exports = function(settings) {
  var namespace = settings.namespace || "";
  if ("" !== namespace) {
    namespace = namespace + ".";
  }
  // recover tracker
  const augmentTracker = turbine.getSharedModule("adobe-analytics","augment-tracker");
  console.log(augmentTracker);

  augmentTracker && augmentTracker( function(s) {
    // copy built-in variables first
    for (let i = 0; i < builtInVariableList.length; i++) {
      const element = builtInVariableList[i];
      if (weShouldCopy(element)) {
        copy(s, namespace, element);
      }
    }

    // copy built-in events
    if (weShouldCopy('builtInEvents')) {
      const events = s.events;
      if ('undefined' !== events && events) {
        for (let i = 0; i < builtInEventsList.length; i++) {
          const event = builtInEventsList[i];
          if (events.indexOf(event) >= 0) {
            s.contextData[namespace + event] = event;
          }
        }
      }
    }

    // copy eVars
    if (weShouldCopy('eVars')) {
      for (let i = 1; i <= maxIndexEVars; i++) {
        const eVar = s['v' + i];
        if ('undefined' !== typeof eVar && eVar) {
          s.contextData[namespace + 'eVar' + i] = s[eVar];
        }
      }
    }

    // copy props
    if (weShouldCopy('props')) {
      for (let i = 1; i <= maxIndexProps; i++) {
        const prop = s['c' + i];
        if ('undefined' !== typeof prop && prop) {
          s.contextData[namespace + 'prop' + i] = s[prop];
        }
      }
    }

    // copy listVars
    if (weShouldCopy('listVars')) {
      copy(s, namespace, 'list1');
      copy(s, namespace, 'list2');
      copy(s, namespace, 'list3');
    }

    // copy events
    if (weShouldCopy('events')) {
      const events = s.events;
      if ('undefined' !== events && events) {
        for (let i = 1; i <= maxIndexEvents; i++) {
          const event = 'event' + i;
          if (events.indexOf(event) >= 0) {
            s.contextData[namespace + event] = event;
          }
        }
      }
    }
  });
};

function weShouldCopy(area) {
  return ('undefined' !== typeof settings[area] && true === settings[area]);
}

function copy(s, namespace, variable) {
  if ('undefined' !== typeof s[variable] && s[variable]) {
    s.contextData[namespace + variable] = s[variable];
  }
}