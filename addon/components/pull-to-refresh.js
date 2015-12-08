import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'pull-to-refresh-parent',
  classNameBindings: ['loading'],
  threshold: 50,
  loading: false,
  _startY: undefined,
  _lastY: undefined,

  touchStart(e) {
    this._start(e);
  },

  mouseDown(e) {
    this._start(e);
  },

  _start(e) {
    if (this.get('loading')) {
      return;
    }

    this.set('_startY', e.pageY);
    this.set('_lastY', e.pageY);
  },


  touchMove(e) {
    this._move(e);
  },

  mouseMove(e) {
    if (typeof this.get('_startY') === undefined) {
      return;
    }

    this._move(e);
  },

  _move(e) {
    if (this.get('loading')) {
      return;
    }

    this.set('_lastY', e.pageY);
    const dy = Math.min(
      this.get('_dy'),
      (this.get('threshold') * 2) + this.get('_startY')
    );

    this.$('.pull-to-refresh-child').attr('style', `top: ${dy}px;`);
  },

  touchEnd() {
    this._end();
  },

  mouseUp() {
    this._end();
  },

  mouseOut() {
    this._end();
  },

  _end() {
    const threshold = this.get('threshold');
    const loading = this.get('_dy') >= threshold;
    const top = loading ? threshold : 0;

    this.$('.pull-to-refresh-child').attr('style', `top: ${top}px;`);
    this.set('_startY', undefined);
    this.set('_lastY', undefined);
    this.set('loading', loading);
  },

  _dy: Ember.computed('_lastY', '_startY', function () {
    return this.get('_lastY') - this.get('_startY');
  })
});
