//
//  ReactTry.swift
//  GomobileIpfs
//
//  Created by Yehor Popovych on 10/24/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation
import GomobileIPFS

public enum RequestOptionError: Error {
    case badType(String)
    case badValue(String, Any)
}

func tryReact(
    resolve: RCTPromiseResolveBlock,
    reject: RCTPromiseRejectBlock,
    cb: @escaping () throws -> Any?
) {
    do {
        try resolve(cb())
    } catch let e as NSError {
        reject("\(e.code)", e.userInfo.description, e)
    }
}
