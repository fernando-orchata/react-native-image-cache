"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.CacheEntry = void 0;

var _sha = _interopRequireDefault(require("crypto-js/sha1"));

var _uniqueId = _interopRequireDefault(require("lodash/uniqueId"));

var _reactNativeFileAccess = require("react-native-file-access");

var _defaultConfiguration = _interopRequireDefault(require("./defaultConfiguration"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CacheEntry {
  constructor(source, options, cacheKey) {
    _defineProperty(this, "source", void 0);

    _defineProperty(this, "options", void 0);

    _defineProperty(this, "cacheKey", void 0);

    _defineProperty(this, "downloadPromise", void 0);

    _defineProperty(this, "pathResolved", false);

    this.source = source;
    this.options = options;
    this.cacheKey = cacheKey;
  }

  async getPath() {
    const {
      cacheKey
    } = this;
    const {
      path,
      exists,
      tmpPath
    } = await getCacheEntry(cacheKey);

    if (exists) {
      return path;
    }

    if (!this.downloadPromise) {
      this.pathResolved = false;
      this.downloadPromise = this.download(path, tmpPath);
    }

    if (this.downloadPromise && this.pathResolved) {
      this.pathResolved = false;
      this.downloadPromise = this.download(path, tmpPath);
    }

    return this.downloadPromise;
  }

  async download(path, tmpPath) {
    const {
      source,
      options
    } = this;

    if (source != null) {
      const result = await _reactNativeFileAccess.FileSystem.fetch(source, {
        path: tmpPath,
        ...options
      }); // If the image download failed, we don't cache anything

      if (result && result.status !== 200) {
        this.downloadPromise = undefined;
        return undefined;
      }

      await _reactNativeFileAccess.FileSystem.mv(tmpPath, path);
      this.pathResolved = true;
      return path;
    }

    return source;
  }

}

exports.CacheEntry = CacheEntry;

class CacheManager {
  get config() {
    return CacheManager.defaultConfig;
  }

  set config(newConfig) {
    CacheManager.defaultConfig = newConfig;
  }

  static get(source, options, cacheKey) {
    if (!CacheManager.entries[cacheKey]) {
      CacheManager.entries[cacheKey] = new CacheEntry(source, options, cacheKey);
      return CacheManager.entries[cacheKey];
    }

    return CacheManager.entries[cacheKey];
  }

  static async clearCache() {
    const files = await _reactNativeFileAccess.FileSystem.ls(CacheManager.config.baseDir);

    for (const file of files) {
      try {
        await _reactNativeFileAccess.FileSystem.unlink(`${CacheManager.config.baseDir}${file}`);
      } catch (e) {
        console.log(`error while clearing images cache, error: ${e}`);
      }
    }
  }

  static async removeCacheEntry(entry) {
    try {
      const file = await getCacheEntry(entry);
      const {
        path
      } = file;
      await _reactNativeFileAccess.FileSystem.unlink(path);
    } catch (e) {
      throw new Error('error while clearing image from cache');
    }
  }

  static async getCacheSize() {
    const result = await _reactNativeFileAccess.FileSystem.stat(CacheManager.config.baseDir);

    if (!result) {
      throw new Error(`${CacheManager.config.baseDir} not found`);
    }

    return result.size;
  }

}

exports.default = CacheManager;

_defineProperty(CacheManager, "defaultConfig", _defaultConfiguration.default);

_defineProperty(CacheManager, "config", void 0);

_defineProperty(CacheManager, "entries", {});

const getCacheEntry = async cacheKey => {
  const filename = cacheKey.substring(cacheKey.lastIndexOf('/'), cacheKey.indexOf('?') === -1 ? cacheKey.length : cacheKey.indexOf('?'));
  const ext = filename.indexOf('.') === -1 ? '.jpg' : filename.substring(filename.lastIndexOf('.'));
  const sha = (0, _sha.default)(cacheKey);
  const path = `${CacheManager.config.baseDir}${sha}${ext}`;
  const tmpPath = `${CacheManager.config.baseDir}${sha}-${(0, _uniqueId.default)()}${ext}`; // TODO: maybe we don't have to do this every time

  try {
    await _reactNativeFileAccess.FileSystem.mkdir(CacheManager.config.baseDir);
  } catch (e) {// do nothing
  }

  const exists = await _reactNativeFileAccess.FileSystem.exists(path);
  return {
    exists,
    path,
    tmpPath
  };
};
//# sourceMappingURL=CacheManager.js.map