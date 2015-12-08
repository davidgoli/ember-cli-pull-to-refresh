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
  setup(assert) {
    App = startApp();
    this.render(hbs`{{#pull-to-refresh}}<div class="pull-to-refresh-child"/>{{/pull-to-refresh}}`);

    this.pullDown = (start, end) => {
      this.$('.pull-to-refresh-child').trigger(touchEventY('touchstart', start));
      this.$('.pull-to-refresh-child').trigger(touchEventY('touchmove', end));
    };

    this.letGo = () => {
      this.$('.pull-to-refresh-child').trigger(touchEventY('touchend', 0));
    };

    this.expectTop = (top) => {
      assert.equal(this.$('.pull-to-refresh-child').attr('style'), `top: ${top}px;`);
    };
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

test('pulling down', function () {
  this.pullDown(80, 90);

  this.expectTop(10);
});

test('letting go', function () {
  this.pullDown(80, 90);

  this.letGo();

  this.expectTop(0);
});

test('snapping back', function () {
  this.pullDown(80, 180);

  this.letGo();

  this.expectTop(50);
});
