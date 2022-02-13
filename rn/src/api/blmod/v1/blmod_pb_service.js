// package: blmod.v1
// file: blmod/v1/blmod.proto

var blmod_v1_blmod_pb = require('../../blmod/v1/blmod_pb')
var grpc = require('@improbable-eng/grpc-web').grpc

var LabsModulesService = (function () {
	function LabsModulesService() {}
	LabsModulesService.serviceName = 'blmod.v1.LabsModulesService'
	return LabsModulesService
})()

LabsModulesService.AllModules = {
	methodName: 'AllModules',
	service: LabsModulesService,
	requestStream: false,
	responseStream: false,
	requestType: blmod_v1_blmod_pb.AllModulesRequest,
	responseType: blmod_v1_blmod_pb.AllModulesResponse,
}

LabsModulesService.RunModule = {
	methodName: 'RunModule',
	service: LabsModulesService,
	requestStream: true,
	responseStream: true,
	requestType: blmod_v1_blmod_pb.RunModuleRequest,
	responseType: blmod_v1_blmod_pb.RunModuleResponse,
}

exports.LabsModulesService = LabsModulesService

function LabsModulesServiceClient(serviceHost, options) {
	this.serviceHost = serviceHost
	this.options = options || {}
}

LabsModulesServiceClient.prototype.allModules = function allModules(
	requestMessage,
	metadata,
	callback,
) {
	if (arguments.length === 2) {
		callback = arguments[1]
	}
	var client = grpc.unary(LabsModulesService.AllModules, {
		request: requestMessage,
		host: this.serviceHost,
		metadata: metadata,
		transport: this.options.transport,
		debug: this.options.debug,
		onEnd: function (response) {
			if (callback) {
				if (response.status !== grpc.Code.OK) {
					var err = new Error(response.statusMessage)
					err.code = response.status
					err.metadata = response.trailers
					callback(err, null)
				} else {
					callback(null, response.message)
				}
			}
		},
	})
	return {
		cancel: function () {
			callback = null
			client.close()
		},
	}
}

LabsModulesServiceClient.prototype.runModule = function runModule(metadata) {
	var listeners = {
		data: [],
		end: [],
		status: [],
	}
	var client = grpc.client(LabsModulesService.RunModule, {
		host: this.serviceHost,
		metadata: metadata,
		transport: this.options.transport,
	})
	client.onEnd(function (status, statusMessage, trailers) {
		listeners.status.forEach(function (handler) {
			handler({ code: status, details: statusMessage, metadata: trailers })
		})
		listeners.end.forEach(function (handler) {
			handler({ code: status, details: statusMessage, metadata: trailers })
		})
		listeners = null
	})
	client.onMessage(function (message) {
		listeners.data.forEach(function (handler) {
			handler(message)
		})
	})
	client.start(metadata)
	return {
		on: function (type, handler) {
			listeners[type].push(handler)
			return this
		},
		write: function (requestMessage) {
			client.send(requestMessage)
			return this
		},
		end: function () {
			client.finishSend()
		},
		cancel: function () {
			listeners = null
			client.close()
		},
	}
}

exports.LabsModulesServiceClient = LabsModulesServiceClient
