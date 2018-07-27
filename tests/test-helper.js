import resolver from './helpers/resolver';
import {
  setResolver
} from '@ember/test-helpers';
import { start } from 'ember-cli-qunit';

(function fnBindPolyfill() {
  if (typeof Function.prototype.bind === 'function') {
    return;
  }

  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      throw new TypeError(
        "Function.prototype.bind - what is trying to be bound is not callable"
      );
    }

    let aArgs = Array.prototype.slice.call(arguments, 1);
    let fToBind = this;
    let FNOP = function () {};
    let fBound = function () {
      let thisObj = (this instanceof FNOP && oThis) ? this : oThis;
      let args = aArgs.concat(Array.prototype.slice.call(arguments));
      fToBind.apply(thisObj, args);
    };

    FNOP.prototype = this.prototype;
    fBound.prototype = new FNOP();
  };
})();

setResolver(resolver);
start();
