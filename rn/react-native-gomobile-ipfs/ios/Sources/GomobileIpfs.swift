//
//  GomobileIpfs.swift
//  GomobileIpfs
//
//  Created by Yehor Popovych on 10/24/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation
import GomobileIPFS

@objc(GomobileIpfs)
public class GomobileIpfs: NSObject {
    
    @objc(ipfsCreate:internalStorage:resolve:reject:)
    public func ipfsCreate(
        repoPath:         String,
        internalStorage:  Bool,
        resolve:          RCTPromiseResolveBlock,
        reject:           RCTPromiseRejectBlock
    ) {
        tryReact(resolve: resolve, reject: reject) {
            try IPFS(repoPath).pointer
        }
    }
    
    @objc(ipfsStart:resolve:reject:)
    public func ipfsStart(
      pointer:          String,
      resolve:          RCTPromiseResolveBlock,
      reject:           RCTPromiseRejectBlock
    ) {
        tryReact(resolve: resolve, reject: reject) {
            try IPFS.unretained(pointer).start()
        }
    }
    
    @objc(ipfsStop:resolve:reject:)
    public func ipfsStop(
      pointer:          String,
      resolve:          RCTPromiseResolveBlock,
      reject:           RCTPromiseRejectBlock
    ) {
        tryReact(resolve: resolve, reject: reject) {
            try IPFS.unretained(pointer).stop()
        }
    }
    
    @objc(ipfsRestart:resolve:reject:)
    public func ipfsRestart(
      pointer:          String,
      resolve:          RCTPromiseResolveBlock,
      reject:           RCTPromiseRejectBlock
    ) {
        tryReact(resolve: resolve, reject: reject) {
            try IPFS.unretained(pointer).restart()
        }
    }
    
    @objc(ipfsFree:resolve:reject:)
    public func ipfsFree(
      pointer:          String,
      resolve:          RCTPromiseResolveBlock,
      reject:           RCTPromiseRejectBlock
    ) {
        tryReact(resolve: resolve, reject: reject) {
            let _ = try IPFS.retained(pointer)
            return nil
        }
    }
    
    @objc(ipfsIsStarted:resolve:reject:)
    public func ipfsIsStarted(
      pointer:          String,
      resolve:          RCTPromiseResolveBlock,
      reject:           RCTPromiseRejectBlock
    ) {
        tryReact(resolve: resolve, reject: reject) {
            try IPFS.unretained(pointer).isStarted()
        }
    }
    
    @objc(ipfsGetConfig:resolve:reject:)
    public func ipfsGetConfig(
      pointer:          String,
      resolve:          RCTPromiseResolveBlock,
      reject:           RCTPromiseRejectBlock
    ) {
        tryReact(resolve: resolve, reject: reject) {
            try IPFS.unretained(pointer).getConfig()
        }
    }
    
    @objc(ipfsSetConfig:config:resolve:reject:)
    public func ipfsSetConfig(
      pointer:          String,
      config:           [String: Any]?,
      resolve:          RCTPromiseResolveBlock,
      reject:           RCTPromiseRejectBlock
    ) {
        tryReact(resolve: resolve, reject: reject) {
            try IPFS.unretained(pointer).setConfig(config)
        }
    }
    
    @objc(ipfsGetConfigKey:key:resolve:reject:)
    public func ipfsGetConfigKey(
      pointer:          String,
      key:              String,
      resolve:          RCTPromiseResolveBlock,
      reject:           RCTPromiseRejectBlock
    ) {
        tryReact(resolve: resolve, reject: reject) {
            try IPFS.unretained(pointer).getConfigKey(key)
        }
    }
    
    @objc(ipfsSetConfigKey:key:value:resolve:reject:)
    public func ipfsSetConfigKey(
      pointer:          String,
      key:              String,
      value:            [String: Any],
      resolve:          RCTPromiseResolveBlock,
      reject:           RCTPromiseRejectBlock
    ) {
        tryReact(resolve: resolve, reject: reject) {
            try IPFS.unretained(pointer).setConfigKey(key, value)
        }
    }
    
    @objc(ipfsEnablePubsubExperiment:resolve:reject:)
    public func ipfsEnablePubsubExperiment(
      pointer:          String,
      resolve:          RCTPromiseResolveBlock,
      reject:           RCTPromiseRejectBlock
    ) {
        tryReact(resolve: resolve, reject: reject) {
            try IPFS.unretained(pointer).enablePubsubExperiment()
        }
    }
    
    @objc(ipfsEnableNamesysPubsub:resolve:reject:)
    public func ipfsEnableNamesysPubsub(
      pointer:          String,
      resolve:          RCTPromiseResolveBlock,
      reject:           RCTPromiseRejectBlock
    ) {
        tryReact(resolve: resolve, reject: reject) {
            try IPFS.unretained(pointer).enableNamesysPubsub()
        }
    }
    
    @objc(ipfsSetDNSPair:secondary:resolve:reject:)
    public func ipfsSetDNSPair(
      primary:          String,
      secondary:        String,
      resolve:          RCTPromiseResolveBlock,
      reject:           RCTPromiseRejectBlock
    ) {
        tryReact(resolve: resolve, reject: reject) {
            IPFS.setDNSPair(primary, secondary)
        }
    }
    
    @objc(ipfsGetAbsoluteRepoPath:resolve:reject:)
    public func ipfsGetAbsoluteRepoPath(
      pointer:          String,
      resolve:          RCTPromiseResolveBlock,
      reject:           RCTPromiseRejectBlock
    ) {
        tryReact(resolve: resolve, reject: reject) {
            try IPFS.unretained(pointer).getAbsoluteRepoPath()
        }
    }
    
    @objc(ipfsNewRequest:command:resolve:reject:)
    public func ipfsNewRequest(
      pointer:          String,
      command:          String,
      resolve:          RCTPromiseResolveBlock,
      reject:           RCTPromiseRejectBlock
    ) {
        tryReact(resolve: resolve, reject: reject) {
            try IPFS.unretained(pointer).newRequest(command).pointer
        }
    }
    
    @objc(requestBuilderWithArgument:argument:resolve:reject:)
    public func requestBuilderWithArgument(
      pointer:          String,
      argument:         String,
      resolve:          RCTPromiseResolveBlock,
      reject:           RCTPromiseRejectBlock
    ) {
        tryReact(resolve: resolve, reject: reject) {
            try RequestBuilder.retained(pointer).with(argument: argument).pointer
        }
    }
    
    @objc(requestBuilderWithOption:option:type:value:resolve:reject:)
    public func requestBuilderWithOption(
      pointer:          String,
      option:           String,
      type:             String,
      value:            Any,
      resolve:          RCTPromiseResolveBlock,
      reject:           RCTPromiseRejectBlock
    ) {
        tryReact(resolve: resolve, reject: reject) {
            var requestOption: RequestOption
            switch type {
            case "b", "B":
                guard let val = value as? Bool else {
                    throw RequestOptionError.badValue(type, value)
                }
                requestOption = .bool(val)
            case "s", "S":
                guard let val = value as? String else {
                    throw RequestOptionError.badValue(type, value)
                }
                requestOption = .string(val)
            case "d", "D":
                guard let val = value as? String else {
                    throw RequestOptionError.badValue(type, value)
                }
                guard let data = Data(base64Encoded: val) else {
                    throw RequestOptionError.badValue(type, val)
                }
                requestOption = .bytes(data)
            default: throw RequestOptionError.badType(type)
            }
            return try RequestBuilder
                .retained(pointer)
                .with(option: option, value: requestOption)
                .pointer
        }
    }
    
    @objc(requestBuilderWithBody:type:body:resolve:reject:)
    public func requestBuilderWithBody(
      pointer:          String,
      type:             String,
      body:             Any,
      resolve:          RCTPromiseResolveBlock,
      reject:           RCTPromiseRejectBlock
    ) {
        tryReact(resolve: resolve, reject: reject) {
            var requestBody: RequestBody
            switch type {
            case "s", "S":
                guard let val = body as? String else {
                    throw RequestOptionError.badValue(type, body)
                }
                requestBody = .string(val)
            case "d", "D":
                guard let val = body as? String else {
                    throw RequestOptionError.badValue(type, body)
                }
                guard let data = Data(base64Encoded: val) else {
                    throw RequestOptionError.badValue(type, val)
                }
                requestBody = .bytes(data)
            default: throw RequestOptionError.badType(type)
            }
            return try RequestBuilder
                .retained(pointer)
                .with(body: requestBody)
                .pointer
        }
    }
    
    @objc(requestBuilderWithHeader:header:value:resolve:reject:)
    public func requestBuilderWithHeader(
      pointer:          String,
      header:           String,
      value:            String,
      resolve:          RCTPromiseResolveBlock,
      reject:           RCTPromiseRejectBlock
    ) {
        tryReact(resolve: resolve, reject: reject) {
            try RequestBuilder
                .retained(pointer)
                .with(header: header, value: value)
                .pointer
        }
    }
    
    @objc(requestBuilderSend:resolve:reject:)
    public func requestBuilderSend(
      pointer:          String,
      resolve:          RCTPromiseResolveBlock,
      reject:           RCTPromiseRejectBlock
    ) {
        tryReact(resolve: resolve, reject: reject) {
            let data = try RequestBuilder.unretained(pointer).send()
            return data.base64EncodedString()
        }
    }
    
    @objc(requestBuilderSendToDict:resolve:reject:)
    public func requestBuilderSendToDict(
      pointer:          String,
      resolve:          RCTPromiseResolveBlock,
      reject:           RCTPromiseRejectBlock
    ) {
        tryReact(resolve: resolve, reject: reject) {
            try RequestBuilder.unretained(pointer).sendToDict()
        }
    }
    
    @objc(requestBuilderFree:resolve:reject:)
    public func requestBuilderFree(
      pointer:          String,
      resolve:          RCTPromiseResolveBlock,
      reject:           RCTPromiseRejectBlock
    ) {
        tryReact(resolve: resolve, reject: reject) {
            let _ = try RequestBuilder.retained(pointer)
            return nil
        }
    }
    
    @objc static func requiresMainQueueSetup() -> Bool {
      return false
    }
}
