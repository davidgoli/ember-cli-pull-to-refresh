import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'pull-to-refresh-parent',
  threshold: 50,
  _startY: 0,

  touchStart(e) {
    this.set('_startY', e.pageY);
  },

  touchMove(e) {
    let dy = e.pageY - this.get('_startY');
    this.$('.pull-to-refresh-child').attr('style', `top: ${dy}px;`);
  },

  touchEnd() {
    this.$('.pull-to-refresh-child').attr('style', 'top: 0px;');
    this.set('_startY', undefined);
  }
});
