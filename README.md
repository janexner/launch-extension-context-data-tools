# Context Data Tools

Provides Actions and some tools to let you use contextData variables for tracking.

The Extension provides three Actions:

1. Copy to Context Data Variables
2. Set Context Data Variables
3. Set Context Data from Data Layer

Both Actions can be used to set contextData variables, but they are used for different use cases.

## Copy to Context Data Variables

The Action, when called, takes variables from an existing tracker object, and copies or moves them into contextData. They can also be renamed.

### Example

If the current tracker has the following values:

```js
s.pageName='Home';
s.channel='home';
s.eVar1='en';
s.eVar2='ch';
s.prop1='en';
s.events='event1';
```

then the Action would turn it into something like this:

```js
s.contextData['pageName']='home';
s.contextData['channel']='home';
s.contextData['language']='en';
s.contextData['region']='ch';
s.contextData['pageView']=1;
```

## Set Context Data Variables

This Action does what it says on the tin: it allows you to set contextData to any value, including the value of a Data Element.

## Set Context Data from Data Layer

Configure the Action with the name of your data layer variable (underneath windows!), and it'll read the whole thing and turn it into contextData variables.

*Note*: this can lead to pretty long tracking call URLs, depending on the size and depth of your data layer.

### Example

Consider the following data layer:

```js
window.digitalData = {
    'page': {
        'pageInfo': {
            'pageName': 'Home',
            'language': 'en'
        }
    },
    'events': [
        {
            'name': 'Page View'
        },
        {
            'name': 'Tab Change',
            'source': 'main tabs',
            'tab selected': 'map'
        }
    ]
}
```

The Action would turn this into the following contextData variables:

```js
s.contextData['page.pageInfo.pageName'] = 'Home';
s.contextData['page.pageInfo.language'] = 'en';
s.contextData['event.0.name'] = 'Page View';
s.contextData['event.1.name'] = 'Tab change';
s.contextData['event.1.source'] = 'main tabs';
s.contextData['event.1.tab selected'] = 'map';
```

## Notes

All Actions allow you to set a namespace for your contextData.

Setting a namespace is highly recommended. It makes sure there will be no clashes with what other people set, and it'll be easier to find your contextData in the Processing Rule interface.
