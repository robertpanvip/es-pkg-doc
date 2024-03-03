export interface CookieParseOptions {
    decode?(value: string): string;
}

export interface CookieSerializeOptions {
    domain?: string | undefined;
    encode?(value: string | number | boolean): string;
    expires?: Date | undefined;
    httpOnly?: boolean | undefined;
    maxAge?: number | undefined;
    partitioned?: boolean | undefined;
    path?: string | undefined;
    priority?: "low" | "medium" | "high" | undefined;
    sameSite?: true | false | "lax" | "strict" | "none" | undefined;
    secure?: boolean | undefined;
}

// Module exports.
export function parse(str?: string, options?: CookieParseOptions): Record<string, string> {
    if (typeof str !== 'string') {
        throw new TypeError('argument str must be a string');
    }

    const obj: Record<string, any> = {};
    const opt = options || {};
    const dec = opt.decode || decode;

    let index = 0;
    while (index < str.length) {
        const eqIdx = str.indexOf('=', index);

        // no more cookie pairs
        if (eqIdx === -1) {
            break;
        }

        let endIdx = str.indexOf(';', index);

        if (endIdx === -1) {
            endIdx = str.length;
        } else if (endIdx < eqIdx) {
            // backtrack on prior semicolon
            index = str.lastIndexOf(';', eqIdx - 1) + 1;
            continue;
        }

        const key = str.slice(index, eqIdx).trim();

        // only assign once
        if (undefined === obj[key]) {
            const val = str.slice(eqIdx + 1, endIdx).trim();

            // quoted values
            if (val.charCodeAt(0) === 0x22) {
                obj[key] = val.slice(1, -1);
            } else {
                obj[key] = tryDecode(val, dec);
            }
        }

        index = endIdx + 1;
    }

    return obj;
}
// eslint-disable-next-line no-control-regex
const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
// Serialize data into a cookie header.
export function serialize(name: string, val: string | number | boolean, options?: CookieSerializeOptions): string {
    const opt = options || {};
    const enc = opt.encode || encode;

    if (typeof enc !== 'function') {
        throw new TypeError('option encode is invalid');
    }

    if (!fieldContentRegExp.test(name)) {
        throw new TypeError('argument name is invalid');
    }

    const value = enc(val);

    if (value && !fieldContentRegExp.test(value)) {
        throw new TypeError('argument val is invalid');
    }

    let str = name + '=' + value;

    if (null != opt.maxAge) {
        const maxAge = opt.maxAge - 0;

        if (isNaN(maxAge) || !isFinite(maxAge)) {
            throw new TypeError('option maxAge is invalid');
        }

        str += '; Max-Age=' + Math.floor(maxAge);
    }

    if (opt.domain) {
        if (!fieldContentRegExp.test(opt.domain)) {
            throw new TypeError('option domain is invalid');
        }

        str += '; Domain=' + opt.domain;
    }

    if (opt.path) {
        if (!fieldContentRegExp.test(opt.path)) {
            throw new TypeError('option path is invalid');
        }

        str += '; Path=' + opt.path;
    }

    if (opt.expires) {
        const expires = opt.expires;

        if (!isDate(expires) || isNaN(expires.valueOf())) {
            throw new TypeError('option expires is invalid');
        }

        str += '; Expires=' + expires.toUTCString();
    }

    if (opt.httpOnly) {
        str += '; HttpOnly';
    }

    if (opt.secure) {
        str += '; Secure';
    }

    if (opt.partitioned) {
        str += '; Partitioned';
    }

    if (opt.priority) {
        const priority = typeof opt.priority === 'string' ? opt.priority.toLowerCase() : opt.priority;

        switch (priority) {
            case 'low':
                str += '; Priority=Low';
                break;
            case 'medium':
                str += '; Priority=Medium';
                break;
            case 'high':
                str += '; Priority=High';
                break;
            default:
                throw new TypeError('option priority is invalid');
        }
    }

    if (opt.sameSite) {
        const sameSite = typeof opt.sameSite === 'string' ? opt.sameSite.toLowerCase() : opt.sameSite;

        switch (sameSite) {
            case true:
                str += '; SameSite=Strict';
                break;
            case 'lax':
                str += '; SameSite=Lax';
                break;
            case 'strict':
                str += '; SameSite=Strict';
                break;
            case 'none':
                str += '; SameSite=None';
                break;
            default:
                throw new TypeError('option sameSite is invalid');
        }
    }

    return str;
}

// ... Rest of the code

// Helper functions
function decode(str: string): string {
    return str.indexOf('%') !== -1 ? decodeURIComponent(str) : str;
}

function encode(val: string | number | boolean): string {
    return encodeURIComponent(val);
}
const __toString = Object.prototype.toString
function isDate(val: any): val is Date {
    return __toString.call(val) === '[object Date]' || val instanceof Date;
}

function tryDecode(str: string, decode: (str: string) => string): string {
    try {
        return decode(str);
    } catch (e) {
        return str;
    }
}