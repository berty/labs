package ipfs.gomobilern;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.Iterator;

class MapHelpers {
    private static JSONArray fromArray(ReadableArray array) throws Exception {
        JSONArray json = new JSONArray();
        for (int i = 0; i < array.size(); i++) {
            switch (array.getType(i)) {
                case Array:
                    ReadableArray rarr = array.getArray(i);
                    json.put(rarr == null ? JSONObject.NULL : fromArray(rarr));
                    break;
                case Map:
                    ReadableMap rmap = array.getMap(i);
                    json.put(rmap == null ? JSONObject.NULL : fromMap(rmap));
                    break;
                case Boolean:
                    json.put(array.getBoolean(i));
                    break;
                case Null:
                    json.put(JSONObject.NULL);
                    break;
                case Number:
                    json.put(array.getDouble(i));
                    break;
                case String:
                    json.put(array.getString(i));
                    break;
            }
        }
        return json;
    }

    static JSONObject fromMap(ReadableMap map) throws Exception {
        JSONObject object = new JSONObject();
        ReadableMapKeySetIterator iterator = map.keySetIterator();
        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            switch (map.getType(key)) {
                case Map:
                    ReadableMap rmap = map.getMap(key);
                    object.put(key, rmap == null ? JSONObject.NULL : fromMap(rmap));
                    break;
                case Array:
                    ReadableArray rarr = map.getArray(key);
                    object.put(key, rarr == null ? JSONObject.NULL : fromArray(rarr));
                    break;
                case Null:
                    object.put(key, JSONObject.NULL);
                    break;
                case Number:
                    object.put(key, map.getDouble(key));
                    break;
                case Boolean:
                    object.put(key, map.getBoolean(key));
                    break;
                case String:
                    object.put(key, map.getString(key));
                    break;
            }
        }
        return object;
    }

    private static WritableArray fromJsonArray(JSONArray json) throws Exception {
        WritableArray array = Arguments.createArray();
        for (int i = 0; i < json.length(); i++) {
            Object obj = json.get(i);
            if (obj == JSONObject.NULL || obj == null) {
                array.pushNull();
            } else if (obj instanceof Integer) {
                array.pushInt((Integer) obj);
            } else if (obj instanceof Long) {
                array.pushDouble((Long) obj);
            } else if (obj instanceof Double) {
                array.pushDouble((Double) obj);
            } else if (obj instanceof Float) {
                array.pushDouble((Float) obj);
            } else if (obj instanceof Boolean) {
                array.pushBoolean((Boolean) obj);
            } else if (obj instanceof String) {
                array.pushString((String) obj);
            } else if (obj instanceof JSONArray) {
                array.pushArray(fromJsonArray((JSONArray) obj));
            } else if (obj instanceof JSONObject) {
                array.pushMap(fromJsonObject((JSONObject) obj));
            }
        }
        return array;
    }

    static WritableMap fromJsonObject(JSONObject json) throws Exception {
        WritableMap map = Arguments.createMap();
        Iterator<String> iterator = json.keys();
        while (iterator.hasNext()) {
            String key = iterator.next();
            Object obj = json.get(key);
            if (obj == JSONObject.NULL || obj == null) {
                map.putNull(key);
            } else if (obj instanceof Integer) {
                map.putInt(key, (Integer) obj);
            } else if (obj instanceof Long) {
                map.putDouble(key, (Long) obj);
            } else if (obj instanceof Double) {
                map.putDouble(key, (Double) obj);
            } else if (obj instanceof Float) {
                map.putDouble(key, (Float) obj);
            } else if (obj instanceof Boolean) {
                map.putBoolean(key, (Boolean) obj);
            } else if (obj instanceof String) {
                map.putString(key, (String) obj);
            } else if (obj instanceof JSONArray) {
                map.putArray(key, fromJsonArray((JSONArray) obj));
            } else if (obj instanceof JSONObject) {
                map.putMap(key, fromJsonObject((JSONObject) obj));
            }
        }
        return map;
    }
}
