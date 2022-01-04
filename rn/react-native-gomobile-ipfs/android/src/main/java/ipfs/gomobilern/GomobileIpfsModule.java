package ipfs.gomobilern;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import ipfs.gomobile.android.IPFS;
import ipfs.gomobile.android.RequestBuilder;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;
import android.util.Base64;

import org.json.JSONObject;

import androidx.annotation.NonNull;

public class GomobileIpfsModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private final Map<String, Object> pointers;
    private final AtomicLong pointer;

    GomobileIpfsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.pointers = new HashMap<>();
        this.pointer = new AtomicLong();
    }

    @Override @NonNull
    public String getName() {
        return "GomobileIpfs";
    }

    @ReactMethod
    public void ipfsCreate(String repoPath, Boolean internalStorage, Promise promise) {
        tryReact(promise, () ->
            this.getPointer(new IPFS(this.reactContext, repoPath, internalStorage))
        );
    }

    @ReactMethod
    public void ipfsStart(String ptr, Promise promise) {
        tryReact(promise, () -> {
            IPFS ipfs = this.getUnretainedObject(ptr);
            ipfs.start();
            return null;
        });
    }

    @ReactMethod
    public void ipfsStop(String ptr, Promise promise) {
        tryReact(promise, () -> {
            IPFS ipfs = this.getUnretainedObject(ptr);
            ipfs.stop();
            return null;
        });
    }

    @ReactMethod
    public void ipfsRestart(String ptr, Promise promise) {
        tryReact(promise, () -> {
            IPFS ipfs = this.getUnretainedObject(ptr);
            ipfs.restart();
            return null;
        });
    }

    @ReactMethod
    public void ipfsFree(String ptr, Promise promise) {
        tryReact(promise, () -> {
            this.getRetainedObject(ptr);
            return null;
        });
    }

    @ReactMethod
    public void ipfsIsStarted(String ptr, Promise promise) {
        tryReact(promise, () -> {
            IPFS ipfs = this.getUnretainedObject(ptr);
            return ipfs.isStarted();
        });
    }

    @ReactMethod
    public void ipfsGetConfig(String ptr, Promise promise) {
        tryReact(promise, () -> {
            IPFS ipfs = this.getUnretainedObject(ptr);
            return MapHelpers.fromJsonObject(ipfs.getConfig());
        });
    }

    @ReactMethod
    public void ipfsSetConfig(String ptr, ReadableMap config, Promise promise) {
        tryReact(promise, () -> {
            IPFS ipfs = this.getUnretainedObject(ptr);
            ipfs.setConfig(MapHelpers.fromMap(config));
            return null;
        });
    }

    @ReactMethod
    public void ipfsGetConfigKey(String ptr, String key, Promise promise) {
        tryReact(promise, () -> {
            IPFS ipfs = this.getUnretainedObject(ptr);
            return MapHelpers.fromJsonObject(ipfs.getConfigKey(key));
        });
    }

    @ReactMethod
    public void ipfsSetConfigKey(String ptr, String key, ReadableMap config, Promise promise) {
        tryReact(promise, () -> {
            IPFS ipfs = this.getUnretainedObject(ptr);
            ipfs.setConfigKey(key, MapHelpers.fromMap(config));
            return null;
        });
    }

    @ReactMethod
    public void ipfsEnablePubsubExperiment(String ptr, Promise promise) {
        tryReact(promise, () -> {
            IPFS ipfs = this.getUnretainedObject(ptr);
            ipfs.enablePubsubExperiment();
            return null;
        });
    }

    @ReactMethod
    public void ipfsEnableNamesysPubsub(String ptr, Promise promise) {
        tryReact(promise, () -> {
            IPFS ipfs = this.getUnretainedObject(ptr);
            ipfs.enableNamesysPubsub();
            return null;
        });
    }

    @ReactMethod
    public void ipfsSetDNSPair(String primary, String secondary, Promise promise) {
        tryReact(promise, () -> {
            IPFS.setDNSPair(primary, secondary);
            return null;
        });
    }

    @ReactMethod
    public void ipfsGetAbsoluteRepoPath(String ptr, Promise promise) {
        tryReact(promise, () -> {
            IPFS ipfs = this.getUnretainedObject(ptr);
            return ipfs.getRepoAbsolutePath();
        });
    }

    @ReactMethod
    public void ipfsNewRequest(String ptr, String command, Promise promise) {
        tryReact(promise, () -> {
            IPFS ipfs = this.getUnretainedObject(ptr);
            RequestBuilder builder = ipfs.newRequest(command);
            return this.getPointer(builder);
        });
    }

    @ReactMethod
    public void requestBuilderWithArgument(String ptr, String argument, Promise promise) {
        tryReact(promise, () -> {
            RequestBuilder builder = this.getRetainedObject(ptr);
            return this.getPointer(builder.withArgument(argument));
        });
    }

    @ReactMethod
    public void requestBuilderWithOption(
            String ptr, String option, String type, Object value, Promise promise
    ) {
        tryReact(promise, () -> {
            RequestBuilder builder = this.getRetainedObject(ptr);
            switch (type) {
                case "B":
                case "b":
                    builder = builder.withOption(option, (Boolean) value);
                    break;
                case "S":
                case "s":
                    builder = builder.withOption(option, (String) value);
                    break;
                case "D":
                case "d":
                    byte[] data = Base64.decode((String) value, Base64.DEFAULT);
                    builder = builder.withOption(option, data);
                    break;
                default: throw new Error("Unknown option type: "+type);
            }
            return this.getPointer(builder);
        });
    }

    @ReactMethod
    public void requestBuilderWithBody(
            String ptr, String type, Object body, Promise promise
    ) {
        tryReact(promise, () -> {
            RequestBuilder builder = this.getRetainedObject(ptr);
            switch (type) {
                case "S":
                case "s":
                    builder = builder.withBody((String) body);
                    break;
                case "D":
                case "d":
                    byte[] data = Base64.decode((String) body, Base64.DEFAULT);
                    builder = builder.withBody(data);
                    break;
                default: throw new Error("Unknown option type: "+type);
            }
            return this.getPointer(builder);
        });
    }

    @ReactMethod
    public void requestBuilderWithHeader(String ptr, String header, String value, Promise promise) {
        tryReact(promise, () -> {
            RequestBuilder builder = this.getRetainedObject(ptr);
            return this.getPointer(builder.withHeader(header, value));
        });
    }

    @ReactMethod
    public void requestBuilderSend(String ptr, Promise promise) {
        tryReact(promise, () -> {
            RequestBuilder builder = this.getUnretainedObject(ptr);
            return Base64.encodeToString(builder.send(), Base64.NO_WRAP);
        });
    }

    @ReactMethod
    public void requestBuilderSendToDict(String ptr, Promise promise) {
        tryReact(promise, () -> {
            RequestBuilder builder = this.getUnretainedObject(ptr);
            ArrayList<JSONObject> list = builder.sendToJSONList();
            return list.size() > 0 ? MapHelpers.fromJsonObject(list.get(0)) : null;
        });
    }

    @ReactMethod
    public void requestBuilderFree(String ptr, Promise promise) {
        tryReact(promise, () -> {
            RequestBuilder builder = this.getRetainedObject(ptr);
            return null;
        });
    }

    private String getPointer(Object object) {
        long index = pointer.incrementAndGet();
        String ptr = Long.toHexString(index);
        pointers.put(ptr, object);
        return ptr;
    }

    private <T> T getRetainedObject(String ptr) throws Error, ClassCastException {
        T object = getUnretainedObject(ptr);
        pointers.remove(ptr);
        return object;
    }

    @SuppressWarnings("unchecked")
    private <T> T getUnretainedObject(String ptr) throws Error, ClassCastException {
        Object obj = pointers.get(ptr);
        if (obj == null) {
            throw new Error("Object not found: "+ptr);
        }
        return (T)obj;
    }

    private <T> void tryReact(Promise promise, ExceptionSupplier<T> lambda) {
        try {
            T val = lambda.get();
            promise.resolve(val);
        } catch (Throwable e) {
            promise.reject(e.getClass().getCanonicalName(), e);
        }
    }
}
