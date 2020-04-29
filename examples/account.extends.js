const ServicesClassMixin = require('../index.class.js')
class Account extends ServicesClassMixin {}
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