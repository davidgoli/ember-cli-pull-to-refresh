import { test, moduleForComponent } from 'ember-qunit';
import startApp from '../helpers/start-app';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

var App;

function touchEvent(type, y) {
  return new $.Event(type, {
    originalEvent: {
      targetTouches: [{
        pageY: y
      }]
    }
  });
}

function mouseEvent(type, y) {
  return new $.Event(type, {
    pageY: y
  });
}

moduleForComponent('pull-to-refresh', 'PullToRefresh', {
  integration: true,
  setup(assert) {
    App = startApp();
    this.render(hbs`{{pull-to-refresh refresh='refresh'}}`);

    this.gotRefreshAction = false;
    this.on('refresh', () => {
      this.gotRefreshAction = true;
    });

    this.pullDown = (start, end, type='touch') => {
      let startEvent = type === 'touch' ?
        touchEvent('touchstart', start) : mouseEvent('mousedown', start);
      let moveEvent = type === 'touch' ?
        touchEvent('touchmove', end) : mouseEvent('mousemove', end);

      this.$('.pull-to-refresh-child').trigger(startEvent);
      this.$('.pull-to-refresh-child').trigger(moveEvent);
    };

    this.letGo = (type='touch') => {
      let endEvent = type === 'touch' ?
        touchEvent('touchend') : mouseEvent('mouseup');

      this.$('.pull-to-refresh-child').trigger(endEvent);
    };

    this.moveOut = () => {
      let endEvent = mouseEvent('mouseleave');
      this.$('.pull-to-refresh-child').trigger(endEvent);
    };

    this.expectTop = (top) => {
      assert.equal(
        this.$('.pull-to-refresh-child').attr('style'),
        `-webkit-transform: translateY(${top}px); transform: translateY(${top}px);`
      );
    };

    this.expectRefreshing = (refreshing) => {
      let method = refreshing ? 'ok' : 'notOk';
      assert[method](this.$('.pull-to-refresh-parent').hasClass('refreshing'));
      assert.equal(this.gotRefreshAction, refreshing, 'refresh action sent');
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
  assert.equal(this.$('.pull-to-refresh-child').attr('style'), undefined);
});

test('pulling down', function () {
  this.pullDown(80, 90);

  this.expectTop(10);
});

test('letting go', function () {
  this.pullDown(80, 90);

  this.letGo();

  this.expectTop(0);
  this.expectRefreshing(false);
});

test('letting go with a mouse', function () {
  this.pullDown(80, 90, 'mouse');

  this.letGo('mouse');

  this.expectTop(0);
  this.expectRefreshing(false);
});

test('pulling down with a mouse, when not supported', function (assert) {
  this.render(hbs`{{pull-to-refresh disableMouseEvents=true}}`);
  this.pullDown(80, 90, 'mouse');

  assert.equal(this.$('.pull-to-refresh-child').attr('style'), undefined);
});

test('moving out with a mouse', function () {
  this.pullDown(80, 90, 'mouse');

  this.moveOut();

  this.expectTop(0);
  this.expectRefreshing(false);
});

test('snapping back', function () {
  this.pullDown(80, 180);

  this.letGo();

  this.expectTop(0);
  this.expectRefreshing(true);
});

test('pulling down when refreshing', function () {
  this.pullDown(80, 130);
  this.letGo();
  this.expectTop(0);
  this.expectRefreshing(true);

  this.pullDown(80, 200);
  this.expectTop(0);
  this.expectRefreshing(true);

  this.letGo();
  this.expectRefreshing(true);
});

test('overpulling', function () {
  this.pullDown(80, 280);
  this.expectTop(180);

  this.letGo();

  this.expectRefreshing(true);
});
