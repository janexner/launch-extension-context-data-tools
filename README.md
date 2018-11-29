# Context Data Tools

Provides Actions and some tools to let you use contextData variables for tracking.

The Extension provides two Actions:

1. Copy to Context Data Variables
2. Set Context Data Variables

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
