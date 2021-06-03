import Component from '@ember/component';
import { observer, computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { once } from '@ember/runloop';

import jQuery from 'jquery';
import { normalizeEvent } from 'ember-jquery-legacy';

export default Component.extend({
  classNames: 'pull-to-refresh-parent',
  classNameBindings: ['refreshing', 'pulling'],
  scrollable: undefined,
  disableMouseEvents: false,
  threshold: 50,
  refreshing: false,
  _startY: undefined,
  _lastY: undefined,

  init() {
    this._super();
    this.guid = guidFor(this);
  },

  touchStart(e) {
    const nativeEvent = normalizeEvent(e);
    const y = nativeEvent.targetTouches[0].pageY;
    this._start(y);
  },

  mouseDown(e) {
    if (this.get('disableMouseEvents')) {
      return;
    }

    const y = e.pageY;
    this._start(y);
  },

  _start(y) {
    if (this.get('refreshing') || !this._canPullDown()) {
      return;
    }

    this.setProperties({
      _startY: y,
      _lastY: y
    });
  },


  touchMove(e) {
    const nativeEvent = normalizeEvent(e);
    const y = nativeEvent.targetTouches[0].pageY;
    this._move(y);
  },

  mouseMove(e) {
    const y = e.pageY;
    this._move(y);
  },

  _move(y) {
    if (this.get('refreshing') || !this.get('_startY')) {
      return;
    }

    this.set('_lastY', y);

    if (!this.get('pulling')) {
      return;
    }

    const dy = Math.min(
      this.get('_dy'),
      (this.get('threshold') * 2)
    );

    this._setTop(dy);
  },

  touchEnd() {
    this._end();
  },

  mouseUp() {
    this._end();
  },

  mouseLeave() {
    this._end();
  },

  _end() {
    if (!this.get('_startY')) {
      return;
    }

    const threshold = this.get('threshold');
    const refreshing = this.get('_dy') >= threshold;

    once(() => {
      this.setProperties({
        _startY: undefined,
        _lastY: undefined,
        refreshing: refreshing
      });

      this._reset();
    });

    if (refreshing) {
      this.sendAction('refresh');
    }
  },

  _reset: observer('refreshing', function () {
    let top = 0;
    if (this.get('refreshing')) {
      top = this.get('threshold');
    }

    this._setTop(top);
  }),

  _setTop(y) {
    let ptrChild = this.element.querySelector('.pull-to-refresh-child');

    if (ptrChild) {
      ptrChild.style.transform = `translate3d(0, ${y}px, 0)`;
    }
  },

  _dy: computed('_lastY', '_startY', function () {
    return this.get('_lastY') - this.get('_startY');
  }),

  // _canPullDown() {
  //   let scrollable = this.get('_scrollableEl');

  //   if (!scrollable) {
  //     scrollable = this.element.querySelector(this.get('scrollable'));

  //     if (scrollable) {
  //       this.set('_scrollableEl', scrollable);
  //     }
  //   }

  //   return (!scrollable || scrollable.scrollTop === 0);
  // },

  _canPullDown() {
    let scrollable = this.get('_scrollableEl');

    if (!scrollable) {
      scrollable = jQuery(this.get('scrollable'));

      if (scrollable.length > 0) {
        this.set('_scrollableEl', scrollable);
      }
    }

    return (scrollable.length === 0 ||
      scrollable.scrollTop() === 0);
  },

  pulling: computed('_startY', '_dy', function () {
    return this.get('_startY') && this._canPullDown() && this.get('_dy') > 0;
  })
});
