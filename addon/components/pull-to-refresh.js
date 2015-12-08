import Ember from 'ember';

export default Ember.Component.extend({
  threshold: 50,
  _startY: 0,

  touchStart(e) {
    this.set('_startY', e.pageY);
  },

  touchMove(e) {
    let dy = e.pageY - this.get('_startY');
    this.$().attr('style', `top: ${dy}px;`);
  }
});
