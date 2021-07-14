

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function getObject(idx) { return heap[idx]; }

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
};

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);

            } else {
                state.a = a;
            }
        }
    };
    real.original = state;

    return real;
}
function __wbg_adapter_18(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hacfd31da543bfe26(arg0, arg1, addHeapObject(arg2));
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}
/**
* @returns {any}
*/
export function defaultTsConfig() {
    var ret = wasm.defaultTsConfig();
    return takeObject(ret);
}

/**
* @returns {any}
*/
export function defaultEsConfig() {
    var ret = wasm.defaultEsConfig();
    return takeObject(ret);
}

function __wbg_adapter_44(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen__convert__closures__invoke2_mut__h53f8005cc112e394(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

/**
*/
export class Parser {

    static __wrap(ptr) {
        const obj = Object.create(Parser.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_parser_free(ptr);
    }
    /**
    * @param {FileLoader} file_loader
    * @param {boolean} private_items
    */
    constructor(file_loader, private_items) {
        var ret = wasm.parser_new(addHeapObject(file_loader), private_items);
        return Parser.__wrap(ret);
    }
    /**
    * @param {string} file_name
    * @param {any} syntax
    * @param {string} source_code
    * @returns {any}
    */
    parseModule(file_name, syntax, source_code) {
        var ptr0 = passStringToWasm0(file_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = passStringToWasm0(source_code, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ret = wasm.parser_parseModule(this.ptr, ptr0, len0, addHeapObject(syntax), ptr1, len1);
        return takeObject(ret);
    }
    /**
    * @param {string} file_name
    * @returns {Promise<any>}
    */
    parse(file_name) {
        var ptr0 = passStringToWasm0(file_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.parser_parse(this.ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
    * @param {string} file_name
    * @param {any} syntax
    * @param {string} source_code
    * @returns {any}
    */
    parseSource(file_name, syntax, source_code) {
        var ptr0 = passStringToWasm0(file_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = passStringToWasm0(source_code, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ret = wasm.parser_parseSource(this.ptr, ptr0, len0, addHeapObject(syntax), ptr1, len1);
        return takeObject(ret);
    }
    /**
    * @param {string} file_name
    * @returns {Promise<any>}
    */
    parseWithReexports(file_name) {
        var ptr0 = passStringToWasm0(file_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.parser_parseWithReexports(this.ptr, ptr0, len0);
        return takeObject(ret);
    }
}

const imports = {
    __wbindgen_placeholder__: {
        __wbindgen_string_new: function(arg0, arg1) {
            var ret = getStringFromWasm0(arg0, arg1);
            return addHeapObject(ret);
        },
        __wbg_loadSourceCode_f21d4dcf1176e914: function() { return handleError(function (arg0, arg1, arg2) {
            var ret = getObject(arg0).loadSourceCode(getStringFromWasm0(arg1, arg2));
            return addHeapObject(ret);
        }, arguments) },
        __wbg_resolve_58d2ed8f0fd35b36: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
            var ret = getObject(arg1).resolve(getStringFromWasm0(arg2, arg3), getStringFromWasm0(arg4, arg5));
            var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            getInt32Memory0()[arg0 / 4 + 1] = len0;
            getInt32Memory0()[arg0 / 4 + 0] = ptr0;
        }, arguments) },
        __wbindgen_json_parse: function(arg0, arg1) {
            var ret = JSON.parse(getStringFromWasm0(arg0, arg1));
            return addHeapObject(ret);
        },
        __wbindgen_json_serialize: function(arg0, arg1) {
            const obj = getObject(arg1);
            var ret = JSON.stringify(obj === undefined ? null : obj);
            var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            getInt32Memory0()[arg0 / 4 + 1] = len0;
            getInt32Memory0()[arg0 / 4 + 0] = ptr0;
        },
        __wbindgen_object_drop_ref: function(arg0) {
            takeObject(arg0);
        },
        __wbg_error_4bb6c2a97407129a: function(arg0, arg1) {
            try {
                console.error(getStringFromWasm0(arg0, arg1));
            } finally {
                wasm.__wbindgen_free(arg0, arg1);
            }
        },
        __wbg_new_59cb74e423758ede: function() {
            var ret = new Error();
            return addHeapObject(ret);
        },
        __wbg_stack_558ba5917b466edd: function(arg0, arg1) {
            var ret = getObject(arg1).stack;
            var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            getInt32Memory0()[arg0 / 4 + 1] = len0;
            getInt32Memory0()[arg0 / 4 + 0] = ptr0;
        },
        __wbindgen_cb_drop: function(arg0) {
            const obj = takeObject(arg0).original;
            if (obj.cnt-- == 1) {
                obj.a = 0;
                return true;
            }
            var ret = false;
            return ret;
        },
        __wbg_get_b7bbf50adcc94294: function(arg0, arg1) {
            var ret = getObject(arg0)[arg1 >>> 0];
            return addHeapObject(ret);
        },
        __wbg_from_f4f6c9225e58242f: function(arg0) {
            var ret = Array.from(getObject(arg0));
            return addHeapObject(ret);
        },
        __wbg_message_e440fbd911a845a2: function(arg0) {
            var ret = getObject(arg0).message;
            return addHeapObject(ret);
        },
        __wbg_call_3fc07b7d5fc9022d: function() { return handleError(function (arg0, arg1, arg2) {
            var ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
            return addHeapObject(ret);
        }, arguments) },
        __wbg_new_c143a4f563f78c4e: function(arg0, arg1) {
            try {
                var state0 = {a: arg0, b: arg1};
                var cb0 = (arg0, arg1) => {
                    const a = state0.a;
                    state0.a = 0;
                    try {
                        return __wbg_adapter_44(a, state0.b, arg0, arg1);
                    } finally {
                        state0.a = a;
                    }
                };
                var ret = new Promise(cb0);
                return addHeapObject(ret);
            } finally {
                state0.a = state0.b = 0;
            }
        },
        __wbg_resolve_cae3d8f752f5db88: function(arg0) {
            var ret = Promise.resolve(getObject(arg0));
            return addHeapObject(ret);
        },
        __wbg_then_c2361a9d5c9a4fcb: function(arg0, arg1) {
            var ret = getObject(arg0).then(getObject(arg1));
            return addHeapObject(ret);
        },
        __wbg_then_6c9a4bf55755f9b8: function(arg0, arg1, arg2) {
            var ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
            return addHeapObject(ret);
        },
        __wbindgen_string_get: function(arg0, arg1) {
            const obj = getObject(arg1);
            var ret = typeof(obj) === 'string' ? obj : undefined;
            var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            getInt32Memory0()[arg0 / 4 + 1] = len0;
            getInt32Memory0()[arg0 / 4 + 0] = ptr0;
        },
        __wbindgen_throw: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbindgen_rethrow: function(arg0) {
            throw takeObject(arg0);
        },
        __wbindgen_closure_wrapper1708: function(arg0, arg1, arg2) {
            var ret = makeMutClosure(arg0, arg1, 78, __wbg_adapter_18);
            return addHeapObject(ret);
        },
    },

};

const wasm_url = new URL('bridge_bg.wasm', import.meta.url);
let wasmCode = '';
switch (wasm_url.protocol) {
    case 'file:':
    wasmCode = await Deno.readFile(wasm_url);
    break
    case 'https:':
    case 'http:':
    wasmCode = await (await fetch(wasm_url)).arrayBuffer();
    break
    default:
    throw new Error(`Unsupported protocol: ${wasm_url.protocol}`);
    break
}

const wasmInstance = (await WebAssembly.instantiate(wasmCode, imports)).instance;
const wasm = wasmInstance.exports;
