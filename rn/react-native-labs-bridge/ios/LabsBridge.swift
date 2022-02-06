import Labs
import Foundation

@objc(LabsBridge)
class LabsBridge: NSObject, RCTInvalidating {
    var started = false
    var labs = LabsLabs()
    var mutex = PThreadMutex()
    
    @objc(start:withRejecter:)
    func start(resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        mutex.sync_same_file(execute: {
            guard !started else {
                resolve(false)
                return
            }
            
            let conf = LabsNewConfig()
            
            let errptr = NSErrorPointer(nil)
            let instance = LabsNewLabs(conf, errptr)!
            let err = errptr?.pointee
            guard err == nil else {
                reject("new_labs", err?.description, nil)
                return  
            }
            
            labs = instance
            started = true
            resolve(true)
        })
    }
    
    func invalidate() {
        mutex.sync_same_file(execute: {
            guard started else {
                return
            }
            
            started = false
            do {
                try labs.close()
            } catch (_) {
                
            }
        })
    }
}

// https://www.cocoawithlove.com/blog/2016/06/02/threads-and-mutexes.html

public class PThreadMutex {
    var mutex = pthread_mutex_t()
   
    public init() {
        pthread_mutex_init(&mutex, nil)
    }

    deinit {
        pthread_mutex_destroy(&mutex)
    }
    
    public func sync<R>(execute: () throws -> R) rethrows -> R {
        pthread_mutex_lock(&mutex)
        defer { pthread_mutex_unlock(&mutex) }
        return try execute()
    }
}

public extension PThreadMutex {
    func sync_generic_param<T, R>(_ p: inout T, execute: (inout T) -> R) -> R {
        pthread_mutex_lock(&mutex)
        defer { pthread_mutex_unlock(&mutex) }
        return execute(&p)
    }
}

private extension PThreadMutex {
    func sync_same_file<R>(execute: () throws -> R) rethrows -> R {
        pthread_mutex_lock(&mutex)
        defer { pthread_mutex_unlock(&mutex) }
        return try execute()
    }
}
