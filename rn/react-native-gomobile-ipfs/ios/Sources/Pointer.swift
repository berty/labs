//
//  Pointer.swift
//  GomobileIpfs
//
//  Created by Yehor Popovych on 10/24/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation
import GomobileIPFS

public enum PointeeError: Error {
    case badPointerValue(String)
    case badIntegerPointer(UInt)
}

public protocol Pointee: class {
    var pointer: String { get }
    
    static func unretained(_ pointer: String) throws -> Self
    static func retained(_ pointer: String) throws -> Self
}

extension Pointee {
    public var pointer: String {
        let pointer = Unmanaged.passRetained(self).toOpaque()
        let int = UInt(bitPattern: pointer)
        return String(int, radix: 16)
    }
    
    public static func unretained(_ pointer: String) throws -> Self {
        guard let int = UInt(pointer, radix: 16) else {
            throw PointeeError.badPointerValue(pointer)
        }
        guard let pointer = UnsafeMutableRawPointer(bitPattern: int) else {
            throw PointeeError.badIntegerPointer(int)
        }
        return Unmanaged<Self>.fromOpaque(pointer).takeUnretainedValue()
    }
    
    public static func retained(_ pointer: String) throws -> Self {
        guard let int = UInt(pointer, radix: 16) else {
            throw PointeeError.badPointerValue(pointer)
        }
        guard let pointer = UnsafeMutableRawPointer(bitPattern: int) else {
            throw PointeeError.badIntegerPointer(int)
        }
        return Unmanaged<Self>.fromOpaque(pointer).takeRetainedValue()
    }
}

extension IPFS: Pointee {}
extension RequestBuilder: Pointee {}
