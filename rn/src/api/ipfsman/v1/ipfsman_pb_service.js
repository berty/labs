// package: ipfsman.v1
// file: ipfsman/v1/ipfsman.proto

var ipfsman_v1_ipfsman_pb = require('../../ipfsman/v1/ipfsman_pb')
var grpc = require('@improbable-eng/grpc-web').grpc

var IPFSManagerService = (function () {
	function IPFSManagerService() {}
	IPFSManagerService.serviceName = 'ipfsman.v1.IPFSManagerService'
	return IPFSManagerService
})()

IPFSManagerService.StartNode = {
	methodName: 'StartNode',
	service: IPFSManagerService,
	requestStream: false,
	responseStream: false,
	requestType: ipfsman_v1_ipfsman_pb.StartNodeRequest,
	responseType: ipfsman_v1_ipfsman_pb.StartNodeResponse,
}

IPFSManagerService.StopNode = {
	methodName: 'StopNode',
	service: IPFSManagerService,
	requestStream: false,
	responseStream: false,
	requestType: ipfsman_v1_ipfsman_pb.StopNodeRequest,
	responseType: ipfsman_v1_ipfsman_pb.StopNodeResponse,
}

exports.IPFSManagerService = IPFSManagerService

function IPFSManagerServiceClient(serviceHost, options) {
	this.serviceHost = serviceHost
	this.options = options || {}
}

IPFSManagerServiceClient.prototype.startNode = function startNode(
	requestMessage,
	metadata,
	callback,
) {
	if (arguments.length === 2) {
		callback = arguments[1]
	}
	var client = grpc.unary(IPFSManagerService.StartNode, {
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

IPFSManagerServiceClient.prototype.stopNode = function stopNode(
	requestMessage,
	metadata,
	callback,
) {
	if (arguments.length === 2) {
		callback = arguments[1]
	}
	var client = grpc.unary(IPFSManagerService.StopNode, {
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

exports.IPFSManagerServiceClient = IPFSManagerServiceClient
