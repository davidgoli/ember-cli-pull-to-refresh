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
    this.render(hbs`{{#pull-to-refresh}}<div class="pull-to-refresh-child"/>{{/pull-to-refresh}}`);
  },
  teardown() {
    Ember.run(App, 'destroy');
  }
});

test('rendering', function (assert) {
  assert.equal(this.$().length, 1);
  assert.equal(this.$().attr('style'), undefined);
  assert.equal(this.$('.pull-to-refresh-child').length, 1);
});

test('pulling down', function (assert) {
  this.$('.pull-to-refresh-child').trigger(touchEventY('touchstart', 80));
  this.$('.pull-to-refresh-child').trigger(touchEventY('touchmove', 90));

  assert.equal(this.$('.pull-to-refresh-child').attr('style'), 'top: 10px;');
});

test('letting go', function (assert) {
  this.$('.pull-to-refresh-child').trigger(touchEventY('touchstart', 80));
  this.$('.pull-to-refresh-child').trigger(touchEventY('touchmove', 90));

  assert.equal(this.$('.pull-to-refresh-child').attr('style'), 'top: 10px;');

  this.$('.pull-to-refresh-child').trigger(touchEventY('touchend', 0));

  assert.equal(this.$('.pull-to-refresh-child').attr('style'), 'top: 0px;');
});
