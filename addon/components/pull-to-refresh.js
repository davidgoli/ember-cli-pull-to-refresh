import Ember from 'ember';
import jQuery from 'jquery';

export default Ember.Component.extend({
  classNames: 'pull-to-refresh-parent',
  classNameBindings: ['refreshing', 'pulling'],
  scrollable: undefined,
  disableMouseEvents: false,
  threshold: 50,
  refreshing: false,
  _startY: undefined,
  _lastY: undefined,

  touchStart(e) {
    const y = e.originalEvent.targetTouches[0].pageY;
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
    const y = e.originalEvent.targetTouches[0].pageY;
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

    this._setTop(0);
    this.setProperties({
      _startY: undefined,
      _lastY: undefined,
      refreshing: refreshing
    });

    if (refreshing) {
      this.sendAction('refresh');
    }
  },

  _setTop(y) {
    this.$('.pull-to-refresh-child')
      .css('transform', `translate3d(0, ${y}px, 0)`);
  },

  _dy: Ember.computed('_lastY', '_startY', function () {
    return this.get('_lastY') - this.get('_startY');
  }),

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

  pulling: Ember.computed('_startY', '_dy', function () {
    return this.get('_startY') && this._canPullDown() && this.get('_dy') > 0;
  })
});
