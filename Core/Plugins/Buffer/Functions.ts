/**
 * https://github.com/ghosind/node-dynamic-buffer
 * 
 * MIT License
 * 
 * Copyright (c) 2022 Chen Su
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { DynamicBuffer } from './DynamicBuffer';

/**
 * Returns true if obj is a DynamicBuffer, false otherwise.
 *
 * ```js
 * import { isDynamicBuffer } from 'dynamic-buffer';
 *
 * const buf1 = new DynamicBuffer();
 * isDynamicBuffer(buf1); // true
 * const buf2 = Buffer.from('');
 * isDynamicBuffer(buf2); // false
 * ```
 */
export const isDynamicBuffer = (val: any) => val instanceof DynamicBuffer;

/**
 * Check the value is greater or equals to the minimum value, and less or equals to the maximum
 * value. It'll throw an error if the value is not in the range.
 *
 * @param field The field name.
 * @param value The value to check.
 * @param min The allowed minimum value (included) of this value.
 * @param max The allowed maximum value (included) of this value.
 */
export const checkBounds = (field: string, value: number, min: number, max: number) => {
    if (typeof value !== 'number') {
        throw new TypeError(`${field} must be a number`);
    }

    if (Number.isNaN(value) || value < min || value > max) {
        throw new RangeError(`${field} is out of bounds`);
    }
};

/**
 * Check the value in the required range, and throw an error if not satisfy the range requirement.
 *
 * @param field The field name.
 * @param value The value to check.
 * @param min The allowed minimum value (included) of this value.
 * @param max The allowed maximum value (included) of this value.
 */
export const checkRange = (field: string, value: number, min?: number, max?: number) => {
    if (typeof value !== 'number') {
        throw new TypeError(`${field} must be a number`);
    }

    const ranges: string[] = [];
    let isValid: boolean = true;

    if (min !== undefined) {
        ranges.push(`>= ${min}`);
        if (value < min) {
            isValid = false;
        }
    }

    if (max !== undefined) {
        ranges.push(`<= ${max}`);
        if (isValid && value > max) {
            isValid = false;
        }
    }

    if (!isValid || Number.isNaN(value)) {
        throw new RangeError(`The value of '${field
            }' is out of range. It must be ${ranges.join(' and ')
            }. Received ${value
            }`);
    }
};

/**
 * Swap two element in the buffer.
 */
export const swap = (buf: Buffer, i: number, j: number) => {
    const t = buf[i];
    // eslint-disable-next-line no-param-reassign
    buf[i] = buf[j];
    // eslint-disable-next-line no-param-reassign
    buf[j] = t;
};