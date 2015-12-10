import Ember from 'ember';
import jQuery from 'jquery';

export default Ember.Component.extend({
  classNames: 'pull-to-refresh-parent',
  classNameBindings: ['refreshing', 'pulling'],
  scrollable: undefined,
  disableMouseEvents: false,
  threshold: 50,
  refreshing: false,
  pulling: false,
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
    if (this.get('refreshing')) {
      return;
    }

    let scrollable = jQuery(this.get('scrollable'));
    if (scrollable && scrollable.scrollTop() > 0) {
      return;
    }

    this.setProperties({
      _startY: y,
      _lastY: y,
      pulling: true
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
    if (this.get('refreshing') || !this.get('pulling')) {
      return;
    }

    this.set('_lastY', y);

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
    if (!this.get('pulling')) {
      return;
    }

    const threshold = this.get('threshold');
    const refreshing = this.get('_dy') >= threshold;

    this._setTop(0);
    this.setProperties({
      _startY: undefined,
      _lastY: undefined,
      refreshing: refreshing,
      pulling: false
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
  })
});
