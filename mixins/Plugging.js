import { __classPrivateFieldGet, __classPrivateFieldSet, __decorate } from "tslib";
import { property, state } from 'lit/decorators.js';
const pluginTags = new Map();
/**
 * Hashes `uri` using cyrb64 analogous to
 * https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js .
 * @returns a valid customElement tagName containing the URI hash.
 */
export function pluginTag(uri) {
    if (!pluginTags.has(uri)) {
        /* eslint-disable no-bitwise */
        let h1 = 0xdeadbeef;
        let h2 = 0x41c6ce57;
        /* eslint-disable-next-line no-plusplus */
        for (let i = 0, ch; i < uri.length; i++) {
            ch = uri.charCodeAt(i);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 =
            Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
                Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 =
            Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
                Math.imul(h1 ^ (h1 >>> 13), 3266489909);
        pluginTags.set(uri, `oscd-p${(h2 >>> 0).toString(16).padStart(8, '0') +
            (h1 >>> 0).toString(16).padStart(8, '0')}`);
        /* eslint-enable no-bitwise */
    }
    return pluginTags.get(uri);
}
export function Plugging(Base) {
    var _PluggingElement_loadedPlugins, _PluggingElement_plugins;
    class PluggingElement extends Base {
        constructor() {
            super(...arguments);
            _PluggingElement_loadedPlugins.set(this, new Map());
            _PluggingElement_plugins.set(this, { menu: [], editor: [] });
        }
        get loadedPlugins() {
            return __classPrivateFieldGet(this, _PluggingElement_loadedPlugins, "f");
        }
        get plugins() {
            return __classPrivateFieldGet(this, _PluggingElement_plugins, "f");
        }
        set plugins(plugins) {
            Object.values(plugins).forEach(kind => kind.forEach(plugin => {
                const tagName = pluginTag(plugin.src);
                if (this.loadedPlugins.has(tagName))
                    return;
                __classPrivateFieldGet(this, _PluggingElement_loadedPlugins, "f").set(tagName, plugin);
                if (customElements.get(tagName))
                    return;
                import(plugin.src).then(mod => customElements.define(tagName, mod.default));
            }));
            __classPrivateFieldSet(this, _PluggingElement_plugins, { menu: [], editor: [], ...plugins }, "f");
            this.requestUpdate();
        }
    }
    _PluggingElement_loadedPlugins = new WeakMap(), _PluggingElement_plugins = new WeakMap();
    __decorate([
        state()
    ], PluggingElement.prototype, "loadedPlugins", null);
    __decorate([
        property({ type: Object })
    ], PluggingElement.prototype, "plugins", null);
    return PluggingElement;
}
//# sourceMappingURL=Plugging.js.map