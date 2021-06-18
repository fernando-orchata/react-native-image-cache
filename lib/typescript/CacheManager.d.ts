import { Config, DownloadOptions } from './types';
export declare class CacheEntry {
    source: string;
    options: DownloadOptions;
    cacheKey: string;
    downloadPromise: Promise<string | undefined> | undefined;
    pathResolved: boolean;
    constructor(source: string, options: DownloadOptions, cacheKey: string);
    getPath(): Promise<string | undefined>;
    private download;
}
export default class CacheManager {
    static defaultConfig: Config;
    static config: Config;
    get config(): Config;
    set config(newConfig: Config);
    static entries: {
        [uri: string]: CacheEntry;
    };
    static get(source: string, options: DownloadOptions, cacheKey: string): CacheEntry;
    static clearCache(): Promise<void>;
    static removeCacheEntry(entry: string): Promise<void>;
    static getCacheSize(): Promise<number>;
}
