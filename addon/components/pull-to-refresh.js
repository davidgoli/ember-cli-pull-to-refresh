import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'pull-to-refresh-parent',
  classNameBindings: ['loading'],
  threshold: 50,
  loading: false,
  _startY: 0,
  _lastY: 0,

  touchStart(e) {
    if (this.get('loading')) {
      return;
    }

    this.set('_startY', e.pageY);
    this.set('_lastY', e.pageY);
  },

  touchMove(e) {
    if (this.get('loading')) {
      return;
    }

    const currentY = e.pageY;
    const dy = currentY - this.get('_startY');

    this.set('_lastY', e.pageY);
    this.$('.pull-to-refresh-child').attr('style', `top: ${dy}px;`);
  },

  touchEnd() {
    const dy = this.get('_lastY') - this.get('_startY');
    const threshold = this.get('threshold');
    const loading = dy >= threshold;
    const top = loading ? threshold : 0;

    this.$('.pull-to-refresh-child').attr('style', `top: ${top}px;`);
    this.set('_startY', undefined);
    this.set('_lastY', undefined);
    this.set('loading', loading);
  }
});
