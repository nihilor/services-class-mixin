# services-class-mixin

A mixin for a simple, reusable Services implementation in Javascript.

## What?

Services share functionality between different components of an application. The components can offer their own services or consume services provided by other components.

## How?

Any component, that offers a service, is a provider. The offered service is identified by a unique name, making it possible to invoke a specific service. A component, that uses a service, is a consumer. Provider and consumer are not directly connected. Instead the consumer provides the service name to call and the required arguments. The `services-class-mixin` works as an intermediary, that maintains the list of offered services and exchanges the data between provider and consumer.

Extending a class from `ServicesClassMixin`:

```javascript
const ServicesClassMixin = require('services-class-mixin/index.class')
class AClass extends ServicesClassMixin {}
let   anObject = new AClass()
```

Compose a class by assigning the object properties:

```javascript
const servicesMixin = require('services-class-mixin/index.object')
class AClass {}
Object.assign(AClass.prototype, servicesMixin)
let   anObject = new AClass()
```

Compose an object by assigning the object properties:

```javascript
const servicesMixin = require('services-class-mixin/index.object')
let   anObject = {}
Object.assign(anObject, servicesMixin)
```

Please note the difference between assigning the services mixin to a class or to an object. For classes you have to add the properties to `prototype`.

```javascript
class AClass {}
Object.assign(AClass.prototype, servicesMixin)

let   anObject = {}
Object.assign(anObject, servicesMixin)
```

## Install

The mixin is available, installable and manageable via NPM.

```shell
npm install services-class-mixin --save
```

## API

### Register a service

To register a service, call `service`, specify the services name and provide a callback:

```javascript
register (serviceName, serviceCallback, [...serviceParams]): serviceId
```

`register()` returns the service id to explicitly identify the service. This id is a Javascript symbol and must be stored in a variable.

*Optional:* You may provide additional parameters for the service that will be passed through the callback of the service.

```javascript
let loginServiceId  = obj.register('login', (username, password) => console.log(`Login with '${username}' and '${password}'.`))
let logoutServiceId = obj.register('logout', username => console.log(`Logging out '${username}'.`), 'force')
```

Regard that only the latest registered service will be invoked, even if multiple providers offer the same service. This makes it possible to define fallback or default services.

### Call a service

To consume a service, call `service` or its shortforms `sv`. Provide the service name as the first argument and the required data as additional arguments.

```javascript
service (serviceName, ...callParams): any
sv      (serviceName, ...callParams): any
```

`service()` and `sv()` return the result of the service call.

```javascript
let loggedIn = obj.service('login', 'theUsername', 'thePassword')
if (obj.sv('login', 'theUsername', 'thePassword')) { ... }
```

### Unregister a service

It's also possible to remove a previously registered service. Call `unregister`, provide the service id returned by `register` and also provide the service name. The service name wouldn't be necessary, but serves as an additional locking mechanism to prevent accidental deletion. 

```javascript
unregister (serviceId, serviceName)
```

`unregister` doesn't return a value.

```javascript
ev.unregister(serviceId, 'login')
```

## Example

In `./examples/account.js` you will find a very simple example for account management. The example is not representative, but explains the functionality of Services. First of all the script creates a subscription to `click`, providing a callback that simply logs the received value. In the second step it creates an subscription to `input`, provides an additional parameter with the value `email` and logs the received values to the console. Last but not least, the both subscriptions will be revoked, so the finally emitted events won't trigger any output.

```javascript
const ServiceClassMixin = require('../index.class.js')
class Account extends ServiceClassMixin {}
let   account = new Account()

//  register a service for 'login'
let loginServiceId = account.register('login', (username, password) => {
    return username === 'test' && password === 'cowa'
})

//  call service
account.sv('login', 'test', 'cowa')
//  --> returns true

//  register a second service for 'login'
//  Now the preferred service because registered latest!`
let secondLoginServiceId = account.register('login', (username, password) => {
    return username === 'test' && password === 'bunga'
})

//  call service
account.sv('login', 'test', 'cowa')
//  --> returns false, because password has to be bunga
account.sv('login', 'test', 'bunga')
//  --> returns true

//  unregister the second service
account.unregister(secondLoginServiceId, 'login')

//  call service
account.sv('login', 'test', 'cowa')
//  --> returns true
account.sv('login', 'test', 'bunga')
//  --> returns false

//  register service with contextual options
account.register('logout', (username, opts) => { console.log({ username, opts }) }, { forced: true, logOutAll: true })
account.sv('logout', 'theUsername')
```

## Todo

1. Add an option for prioritization when registering services to manually rearrange multiple services.

## LICENSE

MIT License

Copyright (c) 2020 Mark Lubkowitz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
