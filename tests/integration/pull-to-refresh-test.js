import { test, moduleForComponent } from 'ember-qunit';
import startApp from '../helpers/start-app';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

var App;

function touchEvent(type, y) {
  return new Ember.$.Event(type, {
    originalEvent: {
      targetTouches: [{
        pageY: y
      }]
    }
  });
}

function mouseEvent(type, y) {
  return new Ember.$.Event(type, {
    pageY: y
  });
}

moduleForComponent('pull-to-refresh', 'PullToRefresh', {
  integration: true,
  setup(assert) {
    App = startApp();
    this.render(hbs`{{pull-to-refresh refresh='refresh' refreshing=refreshing}}`);

    this.gotRefreshAction = false;
    this.on('refresh', () => {
      this.gotRefreshAction = true;
    });

    this.pullDown = (start, end, type='touch') => {
      Ember.run(() => {
        let startEvent = type === 'touch' ?
          touchEvent('touchstart', start) : mouseEvent('mousedown', start);
        let moveEvent = type === 'touch' ?
          touchEvent('touchmove', end) : mouseEvent('mousemove', end);

        this.$('.pull-to-refresh-child').trigger(startEvent);
        this.$('.pull-to-refresh-child').trigger(moveEvent);
      });
    };

    this.letGo = (type='touch') => {
      Ember.run(() => {
        let endEvent = type === 'touch' ?
          touchEvent('touchend') : mouseEvent('mouseup');

        this.$('.pull-to-refresh-child').trigger(endEvent);
      });
    };

    this.moveOut = () => {
      Ember.run(() => {
        let endEvent = mouseEvent('mouseleave');

        this.$('.pull-to-refresh-child').trigger(endEvent);
      });
    };

    this.expectTop = (top) => {
      assert.equal(
        this.$('.pull-to-refresh-child').css('transform'),
        `matrix(1, 0, 0, 1, 0, ${top})`
      );
    };

    this.expectPulling = (pulling) => {
      let method = pulling ? 'ok' : 'notOk';
      assert[method](this.$('.pull-to-refresh-parent').hasClass('pulling'));
    };

    this.expectRefreshing = (refreshing) => {
      let method = refreshing ? 'ok' : 'notOk';
      assert[method](this.$('.pull-to-refresh-parent').hasClass('refreshing'));
      assert.equal(this.gotRefreshAction, refreshing, 'refresh action sent');

      assert.notOk(this.$('.pull-to-refresh-parent').hasClass('pulling'));
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

  this.expectPulling(true);
  this.expectTop(10);
});

test('letting go', function () {
  this.pullDown(80, 90);

  this.expectPulling(true);

  this.letGo();

  this.expectPulling(false);
  this.expectTop(0);
  this.expectRefreshing(false);
});

test('letting go with a mouse', function () {
  this.pullDown(80, 90, 'mouse');

  this.expectPulling(true);

  this.letGo('mouse');

  this.expectPulling(false);
  this.expectTop(0);
  this.expectRefreshing(false);
});

test('pulling down with a mouse, when not supported', function (assert) {
  this.render(hbs`{{pull-to-refresh disableMouseEvents=true}}`);
  this.pullDown(80, 90, 'mouse');
  this.expectPulling(false);

  assert.equal(this.$('.pull-to-refresh-child').attr('style'), undefined);
});

test('moving out with a mouse', function () {
  this.pullDown(80, 90, 'mouse');

  this.expectPulling(true);

  this.moveOut();

  this.expectPulling(false);
  this.expectTop(0);
  this.expectRefreshing(false);
});

test('snapping back', function () {
  this.pullDown(80, 180);

  this.expectPulling(true);

  this.letGo();

  this.expectPulling(false);
  this.expectTop(50);
  this.expectRefreshing(true);

  this.set('refreshing', false);
  this.expectTop(0);
});

test('pulling down when refreshing', function () {
  this.pullDown(80, 130);
  this.letGo();

  this.expectPulling(false);
  this.expectTop(50);
  this.expectRefreshing(true);

  this.pullDown(80, 200);

  this.expectPulling(false);
  this.expectTop(50);
  this.expectRefreshing(true);

  this.letGo();
  this.expectPulling(false);
  this.expectRefreshing(true);
});

test('overpulling', function () {
  this.pullDown(80, 380);
  this.expectTop(100);
  this.expectPulling(true);

  this.letGo();

  this.expectPulling(false);
  this.expectRefreshing(true);
});

test('pulling up', function (assert) {
  this.pullDown(80, 70);
  assert.equal(
    this.$('.pull-to-refresh-child').css('transform'),
    'none'
  );
  this.expectPulling(false);
});

test('when scrollable is not at the top', function (assert) {
  this.render(hbs`
              <div class="fixed-wrapper">
                <ul class="scroll-container">
                  {{#pull-to-refresh
                    refresh='refresh'
                    scrollable='.scroll-container'}}
                    hello
                  {{/pull-to-refresh}}
                </ul>
              </div>
              `);

  let scrollContainer = Ember.$('.scroll-container');
  this.$('.pull-to-refresh-child').css('height', '100px');
  Ember.$('.fixed-wrapper').css('overflow', 'hidden');
  scrollContainer.css({'height': '50px', 'overflow-y': 'scroll'});

  scrollContainer.scrollTop(20);

  this.pullDown(80, 90);
  assert.equal(
    this.$('.pull-to-refresh-child').css('transform'),
    'none'
  );
  this.expectPulling(false);
});
