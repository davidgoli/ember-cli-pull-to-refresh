import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'pull-to-refresh-parent',
  threshold: 50,
  _startY: 0,
  _lastY: 0,

  touchStart(e) {
    this.set('_startY', e.pageY);
    this.set('_lastY', e.pageY);
  },

  touchMove(e) {
    const currentY = e.pageY;
    const dy = currentY - this.get('_startY');

    this.set('_lastY', e.pageY);
    this.$('.pull-to-refresh-child').attr('style', `top: ${dy}px;`);
  },

  touchEnd() {
    const dy = this.get('_lastY') - this.get('_startY');
    const top = dy >= this.get('threshold') ? this.get('threshold') : 0;

    this.$('.pull-to-refresh-child').attr('style', `top: ${top}px;`);
    this.set('_startY', undefined);
  }
});
