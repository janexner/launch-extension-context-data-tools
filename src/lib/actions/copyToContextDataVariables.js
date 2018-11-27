'use strict';

const builtInVariableList = [
  'products',
  'campaign',
  'pageName',
  'channel',
  'server',
  'r',
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
  const s = {}; // TODO recover s object

  // copy built-in variables first
  for (let i = 0; i < builtInVariableList.length; i++) {
    const element = builtInVariableList[i];
    if (weShouldCopy(element)) {
      copy(element);
    }
  }

  // copy built-in events

  // copy eVars
  if (weShouldCopy('eVars')) {
    for (let i = 1; i <= maxIndexEVars; i++) {
      const eVar = s['eVar' + i];
      copy(eVar);
    }
  }

  // copy props
  if (weShouldCopy('props')) {
    for (let i = 1; i <= maxIndexProps; i++) {
      const prop = s['prop' + i];
      copy(prop);
    }
  }

  // copy listVars
  if (weShouldCopy('listVars')) {
    copy('list1');
    copy('list2');
    copy('list3');
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
};

function weShouldCopy(area) {
  return ('undefined' !== typeof settings[area] && true === settings[area]);
}

function copy(variable) {
  if ('undefined' !== typeof s[variable] && s[variable]) {
    s.contextData[namespace + variable] = s[variable];
  }
}