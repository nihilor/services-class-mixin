let errorMessages = {
    1:  `.register() expects at least two arguments, the service name and the service callback.`,
    2:  '.register() expects a string for the event name.',
    3:  '.register() expects a function for the subscription callback.',
    10: '.unregister() expects exactly two arguments, the servuce id and the service name.',
    11: '.unregister() expects a symbol for the service id.',
    12: '.unregister() expects a string for the service name.',
    20: '.service() expects at least one argument, the service name.',
    21: '.service() expects a string for the service name.'
}

class ServicesClassMixin {
    _serviceRegistry = {}

    register (serviceName, serviceCallback, ...serviceParams) {
        //  check
        if (arguments.length < 2)
            throw new Error(errorMessages[1])
        if (typeof arguments[0] !== 'string')
            throw new TypeError(errorMessages[2])
        if (typeof arguments[1] !== 'function')
            throw new TypeError(errorMessages[3])

        //  register service
        if (serviceName in this._serviceRegistry === false)
            this._serviceRegistry[serviceName] = []

        //  add service
        let serviceId = Symbol(`Registration for the service '${serviceName}'`)
        this._serviceRegistry[serviceName].unshift({
            id: serviceId,
            fn: serviceCallback,
            pr: serviceParams
        })

        return serviceId
    }

    unregister (serviceId, serviceName) {
        //  check
        if (arguments.length !== 2)
            throw new Error(errorMessages[10])
        if (typeof arguments[0] !== 'symbol')
            throw new TypeError(errorMessages[11])
        if (typeof arguments[1] !== 'string')
            throw new TypeError(errorMessages[12])
        
        //  remove service
        if (serviceName in this._serviceRegistry)
            this._serviceRegistry[serviceName] = this._serviceRegistry[serviceName].filter(service => service.id !== serviceId)
    }

    sv () {
        return this.service.apply(this, arguments)
    }

    service (serviceName, ...callParams) {
        //  check
        if (arguments.length < 1)
            throw new Error(errorMessages[20])
        if (typeof arguments[0] !== 'string')
            throw new TypeError(errorMessages[21])

        //   check for service
        if (serviceName in this._serviceRegistry === false)
            return false
        if (this._serviceRegistry[serviceName].length <= 0)
            return false

        let service = this._serviceRegistry[serviceName][0]
        return service.fn.apply(this, [].concat(callParams, service.pr))
    }
}

module.exports = ServicesClassMixin