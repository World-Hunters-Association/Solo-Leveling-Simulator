/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable consistent-this */
/* eslint-disable func-names */
/* eslint-disable no-extend-native */

declare interface Number {
	clamp(min: number, max: number): number;
	mod(n: number): number;
	padZero(length: number): string;
}

/**
 * Returns a number whose value is limited to the given range.
 *
 * @method Number.prototype.clamp
 * @param {Number} min The lower boundary
 * @param {Number} max The upper boundary
 * @return {Number} A number in the range (min, max)
 */
Number.prototype.clamp = function (min: number, max: number): number {
	return Math.min(Math.max(this as number, min), max);
};

/**
 * Returns a modulo value which is always positive.
 *
 * @method Number.prototype.mod
 * @param {Number} n The divisor
 * @return {Number} A modulo value
 */
Number.prototype.mod = function (n: number): number {
	return (((this as number) % n) + n) % n;
};

/**
 * Makes a number string with leading zeros.
 *
 * @method Number.prototype.padZero
 * @param {Number} length The length of the output string
 * @return {String} A string with leading zeros
 */
Number.prototype.padZero = function (length: number): string {
	return String(this).padZero(length);
};

declare interface String {
	format(...args: any[]): string;
	padZero(length: number): string;
}

/**
 * Replaces %1, %2 and so on in the string to the arguments.
 *
 * @method String.prototype.format
 * @param {Any} ...args The objects to format
 * @return {String} A formatted string
 */
String.prototype.format = function (...args: any[]): string {
	return this.replace(/%([0-9]+)/g, (_s, n) => {
		return args[Number(n) - 1];
	});
};

/**
 * Makes a number string with leading zeros.
 *
 * @method String.prototype.padZero
 * @param {Number} length The length of the output string
 * @return {String} A string with leading zeros
 */
String.prototype.padZero = function (length: number): string {
	let s = this;
	while (s.length < length) {
		s = `0${s}`;
	}
	return s as string;
};

declare interface Array<T> {
	equals(array: T[]): boolean;
	clone(): T[];
	contains(element: T): boolean;
}

Object.defineProperties(Array.prototype, {
	/**
	 * Checks whether the two arrays are same.
	 *
	 * @method Array.prototype.equals
	 * @param {Array} array The array to compare to
	 * @return {Boolean} True if the two arrays are same
	 */
	equals: {
		enumerable: false,
		value(array: any[]): boolean {
			if (!array || this.length !== array.length) {
				return false;
			}
			for (let i = 0; i < this.length; i++) {
				if (this[i] instanceof Array && array[i] instanceof Array) {
					if (!this[i].equals(array[i])) {
						return false;
					}
				} else if (this[i] !== array[i]) {
					return false;
				}
			}
			return true;
		}
	},
	/**
	 * Makes a shallow copy of the array.
	 *
	 * @method Array.prototype.clone
	 * @return {Array} A shallow copy of the array
	 */
	clone: {
		enumerable: false,
		value() {
			return this.slice(0);
		}
	},
	/**
	 * Checks whether the array contains a given element.
	 *
	 * @method Array.prototype.contains
	 * @param {Any} element The element to search for
	 * @return {Boolean} True if the array contains a given element
	 */
	contains: {
		enumerable: false,
		value(element: any) {
			return this.indexOf(element) >= 0;
		}
	}
});

declare interface Math {
	randomInt(max: number): number;
}

/**
 * Generates a random integer in the range (0, max-1).
 *
 * @static
 * @method Math.randomInt
 * @param {Number} max The upper boundary (excluded)
 * @return {Number} A random integer
 */
Math.randomInt = (max: number): number => {
	return Math.floor(max * Math.random());
};
