import { test, moduleForComponent } from 'ember-qunit';
import startApp from '../helpers/start-app';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

var App;

function touchEventY(type, y) {
  return new $.Event(type, {
    pageY: y,
    originalEvent: {
      touches: [{
        pageY: y
      }]
    }
  });
}

moduleForComponent('pull-to-refresh', 'PullToRefresh', {
  integration: true,
  setup() {
    App = startApp();
    this.render(hbs`{{pull-to-refresh}}`);
  },
  teardown() {
    Ember.run(App, 'destroy');
  }
});

test('pulling down', function (assert) {
  assert.equal(this.$().length, 1);
  assert.equal(this.$().attr('style'), undefined);

  this.$('div').trigger(touchEventY('touchstart', 80));
  this.$('div').trigger(touchEventY('touchmove', 90));

  assert.equal(this.$('div').attr('style'), 'top: 10px;');
});

test('letting go', function (assert) {
  this.$('div').trigger(touchEventY('touchstart', 80));
  this.$('div').trigger(touchEventY('touchmove', 90));

  assert.equal(this.$('div').attr('style'), 'top: 10px;');

  this.$('div').trigger(touchEventY('touchend', 0));

  assert.equal(this.$('div').attr('style'), 'top: 0px;');
});
