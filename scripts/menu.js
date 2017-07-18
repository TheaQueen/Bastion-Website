/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function () {
  'use strict';

  /**
   * Class constructor for dropdown MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */

  var MaterialMenu = function MaterialMenu(element) {
    this.element_ = element;

    // Initialize instance.
    this.init();
  };
  window['MaterialMenu'] = MaterialMenu;

  /**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
  MaterialMenu.prototype.Constant_ = {
    // Total duration of the menu animation.
    TRANSITION_DURATION_SECONDS: 0.3,
    // The fraction of the total duration we want to use for menu item animations.
    TRANSITION_DURATION_FRACTION: 0.8,
    // How long the menu stays open after choosing an option (so the user can see
    // the ripple).
    CLOSE_TIMEOUT: 150
  };

  /**
   * Keycodes, for code readability.
   *
   * @enum {number}
   * @private
   */
  MaterialMenu.prototype.Keycodes_ = {
    ENTER: 13,
    ESCAPE: 27,
    SPACE: 32,
    UP_ARROW: 38,
    DOWN_ARROW: 40
  };

  /**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {string}
   * @private
   */
  MaterialMenu.prototype.CssClasses_ = {
    CONTAINER: 'mdl-menu__container',
    OUTLINE: 'mdl-menu__outline',
    ITEM: 'mdl-menu__item',
    ITEM_RIPPLE_CONTAINER: 'mdl-menu__item-ripple-container',
    RIPPLE_EFFECT: 'mdl-js-ripple-effect',
    RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
    RIPPLE: 'mdl-ripple',
    // Statuses
    IS_UPGRADED: 'is-upgraded',
    IS_VISIBLE: 'is-visible',
    IS_ANIMATING: 'is-animating',
    // Alignment options
    BOTTOM_LEFT: 'mdl-menu--bottom-left', // This is the default.
    BOTTOM_RIGHT: 'mdl-menu--bottom-right',
    TOP_LEFT: 'mdl-menu--top-left',
    TOP_RIGHT: 'mdl-menu--top-right',
    UNALIGNED: 'mdl-menu--unaligned'
  };

  /**
   * Initialize element.
   */
  MaterialMenu.prototype.init = function () {
    if (this.element_) {
      // Create container for the menu.
      var container = document.createElement('div');
      container.classList.add(this.CssClasses_.CONTAINER);
      this.element_.parentElement.insertBefore(container, this.element_);
      this.element_.parentElement.removeChild(this.element_);
      container.appendChild(this.element_);
      this.container_ = container;

      // Create outline for the menu (shadow and background).
      var outline = document.createElement('div');
      outline.classList.add(this.CssClasses_.OUTLINE);
      this.outline_ = outline;
      container.insertBefore(outline, this.element_);

      // Find the "for" element and bind events to it.
      var forElId = this.element_.getAttribute('for') || this.element_.getAttribute('data-mdl-for');
      var forEl = null;
      if (forElId) {
        forEl = document.getElementById(forElId);
        if (forEl) {
          this.forElement_ = forEl;
          forEl.addEventListener('click', this.handleForClick_.bind(this));
          forEl.addEventListener('keydown', this.handleForKeyboardEvent_.bind(this));
        }
      }

      var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM);
      this.boundItemKeydown_ = this.handleItemKeyboardEvent_.bind(this);
      this.boundItemClick_ = this.handleItemClick_.bind(this);
      for (var i = 0; i < items.length; i++) {
        // Add a listener to each menu item.
        items[i].addEventListener('click', this.boundItemClick_);
        // Add a tab index to each menu item.
        items[i].tabIndex = '-1';
        // Add a keyboard listener to each menu item.
        items[i].addEventListener('keydown', this.boundItemKeydown_);
      }

      // Add ripple classes to each item, if the user has enabled ripples.
      if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
        this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);

        for (i = 0; i < items.length; i++) {
          var item = items[i];

          var rippleContainer = document.createElement('span');
          rippleContainer.classList.add(this.CssClasses_.ITEM_RIPPLE_CONTAINER);

          var ripple = document.createElement('span');
          ripple.classList.add(this.CssClasses_.RIPPLE);
          rippleContainer.appendChild(ripple);

          item.appendChild(rippleContainer);
          item.classList.add(this.CssClasses_.RIPPLE_EFFECT);
        }
      }

      // Copy alignment classes to the container, so the outline can use them.
      if (this.element_.classList.contains(this.CssClasses_.BOTTOM_LEFT)) {
        this.outline_.classList.add(this.CssClasses_.BOTTOM_LEFT);
      }
      if (this.element_.classList.contains(this.CssClasses_.BOTTOM_RIGHT)) {
        this.outline_.classList.add(this.CssClasses_.BOTTOM_RIGHT);
      }
      if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT)) {
        this.outline_.classList.add(this.CssClasses_.TOP_LEFT);
      }
      if (this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
        this.outline_.classList.add(this.CssClasses_.TOP_RIGHT);
      }
      if (this.element_.classList.contains(this.CssClasses_.UNALIGNED)) {
        this.outline_.classList.add(this.CssClasses_.UNALIGNED);
      }

      container.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  };

  /**
   * Handles a click on the "for" element, by positioning the menu and then
   * toggling it.
   *
   * @param {Event} evt The event that fired.
   * @private
   */
  MaterialMenu.prototype.handleForClick_ = function (evt) {
    if (this.element_ && this.forElement_) {
      var rect = this.forElement_.getBoundingClientRect();
      var forRect = this.forElement_.parentElement.getBoundingClientRect();

      if (this.element_.classList.contains(this.CssClasses_.UNALIGNED)) {
        // Do not position the menu automatically. Requires the developer to
        // manually specify position.
      } else if (this.element_.classList.contains(this.CssClasses_.BOTTOM_RIGHT)) {
        // Position below the "for" element, aligned to its right.
        this.container_.style.right = forRect.right - rect.right + 'px';
        this.container_.style.top = this.forElement_.offsetTop + this.forElement_.offsetHeight + 'px';
      } else if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT)) {
        // Position above the "for" element, aligned to its left.
        this.container_.style.left = this.forElement_.offsetLeft + 'px';
        this.container_.style.bottom = forRect.bottom - rect.top + 'px';
      } else if (this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
        // Position above the "for" element, aligned to its right.
        this.container_.style.right = forRect.right - rect.right + 'px';
        this.container_.style.bottom = forRect.bottom - rect.top + 'px';
      } else {
        // Default: position below the "for" element, aligned to its left.
        this.container_.style.left = this.forElement_.offsetLeft + 'px';
        this.container_.style.top = this.forElement_.offsetTop + this.forElement_.offsetHeight + 'px';
      }
    }

    this.toggle(evt);
  };

  /**
   * Handles a keyboard event on the "for" element.
   *
   * @param {Event} evt The event that fired.
   * @private
   */
  MaterialMenu.prototype.handleForKeyboardEvent_ = function (evt) {
    if (this.element_ && this.container_ && this.forElement_) {
      var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM + ':not([disabled])');

      if (items && items.length > 0 && this.container_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
        if (evt.keyCode === this.Keycodes_.UP_ARROW) {
          evt.preventDefault();
          items[items.length - 1].focus();
        } else if (evt.keyCode === this.Keycodes_.DOWN_ARROW) {
          evt.preventDefault();
          items[0].focus();
        }
      }
    }
  };

  /**
   * Handles a keyboard event on an item.
   *
   * @param {Event} evt The event that fired.
   * @private
   */
  MaterialMenu.prototype.handleItemKeyboardEvent_ = function (evt) {
    if (this.element_ && this.container_) {
      var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM + ':not([disabled])');

      if (items && items.length > 0 && this.container_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
        var currentIndex = Array.prototype.slice.call(items).indexOf(evt.target);

        if (evt.keyCode === this.Keycodes_.UP_ARROW) {
          evt.preventDefault();
          if (currentIndex > 0) {
            items[currentIndex - 1].focus();
          } else {
            items[items.length - 1].focus();
          }
        } else if (evt.keyCode === this.Keycodes_.DOWN_ARROW) {
          evt.preventDefault();
          if (items.length > currentIndex + 1) {
            items[currentIndex + 1].focus();
          } else {
            items[0].focus();
          }
        } else if (evt.keyCode === this.Keycodes_.SPACE || evt.keyCode === this.Keycodes_.ENTER) {
          evt.preventDefault();
          // Send mousedown and mouseup to trigger ripple.
          var e = new MouseEvent('mousedown');
          evt.target.dispatchEvent(e);
          e = new MouseEvent('mouseup');
          evt.target.dispatchEvent(e);
          // Send click.
          evt.target.click();
        } else if (evt.keyCode === this.Keycodes_.ESCAPE) {
          evt.preventDefault();
          this.hide();
        }
      }
    }
  };

  /**
   * Handles a click event on an item.
   *
   * @param {Event} evt The event that fired.
   * @private
   */
  MaterialMenu.prototype.handleItemClick_ = function (evt) {
    if (evt.target.hasAttribute('disabled')) {
      evt.stopPropagation();
    } else {
      // Wait some time before closing menu, so the user can see the ripple.
      this.closing_ = true;
      window.setTimeout(function (evt) {
        this.hide();
        this.closing_ = false;
      }.bind(this), /** @type {number} */this.Constant_.CLOSE_TIMEOUT);
    }
  };

  /**
   * Calculates the initial clip (for opening the menu) or final clip (for closing
   * it), and applies it. This allows us to animate from or to the correct point,
   * that is, the point it's aligned to in the "for" element.
   *
   * @param {number} height Height of the clip rectangle
   * @param {number} width Width of the clip rectangle
   * @private
   */
  MaterialMenu.prototype.applyClip_ = function (height, width) {
    if (this.element_.classList.contains(this.CssClasses_.UNALIGNED)) {
      // Do not clip.
      this.element_.style.clip = '';
    } else if (this.element_.classList.contains(this.CssClasses_.BOTTOM_RIGHT)) {
      // Clip to the top right corner of the menu.
      this.element_.style.clip = 'rect(0 ' + width + 'px ' + '0 ' + width + 'px)';
    } else if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT)) {
      // Clip to the bottom left corner of the menu.
      this.element_.style.clip = 'rect(' + height + 'px 0 ' + height + 'px 0)';
    } else if (this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
      // Clip to the bottom right corner of the menu.
      this.element_.style.clip = 'rect(' + height + 'px ' + width + 'px ' + height + 'px ' + width + 'px)';
    } else {
      // Default: do not clip (same as clipping to the top left corner).
      this.element_.style.clip = '';
    }
  };

  /**
   * Cleanup function to remove animation listeners.
   *
   * @param {Event} evt
   * @private
   */

  MaterialMenu.prototype.removeAnimationEndListener_ = function (evt) {
    evt.target.classList.remove(MaterialMenu.prototype.CssClasses_.IS_ANIMATING);
  };

  /**
   * Adds an event listener to clean up after the animation ends.
   *
   * @private
   */
  MaterialMenu.prototype.addAnimationEndListener_ = function () {
    this.element_.addEventListener('transitionend', this.removeAnimationEndListener_);
    this.element_.addEventListener('webkitTransitionEnd', this.removeAnimationEndListener_);
  };

  /**
   * Displays the menu.
   *
   * @public
   */
  MaterialMenu.prototype.show = function (evt) {
    if (this.element_ && this.container_ && this.outline_) {
      // Measure the inner element.
      var height = this.element_.getBoundingClientRect().height;
      var width = this.element_.getBoundingClientRect().width;

      // Apply the inner element's size to the container and outline.
      this.container_.style.width = width + 'px';
      this.container_.style.height = height + 'px';
      this.outline_.style.width = width + 'px';
      this.outline_.style.height = height + 'px';

      var transitionDuration = this.Constant_.TRANSITION_DURATION_SECONDS * this.Constant_.TRANSITION_DURATION_FRACTION;

      // Calculate transition delays for individual menu items, so that they fade
      // in one at a time.
      var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM);
      for (var i = 0; i < items.length; i++) {
        var itemDelay = null;
        if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT) || this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
          itemDelay = (height - items[i].offsetTop - items[i].offsetHeight) / height * transitionDuration + 's';
        } else {
          itemDelay = items[i].offsetTop / height * transitionDuration + 's';
        }
        items[i].style.transitionDelay = itemDelay;
      }

      // Apply the initial clip to the text before we start animating.
      this.applyClip_(height, width);

      // Wait for the next frame, turn on animation, and apply the final clip.
      // Also make it visible. This triggers the transitions.
      window.requestAnimationFrame(function () {
        this.element_.classList.add(this.CssClasses_.IS_ANIMATING);
        this.element_.style.clip = 'rect(0 ' + width + 'px ' + height + 'px 0)';
        this.container_.classList.add(this.CssClasses_.IS_VISIBLE);
      }.bind(this));

      // Clean up after the animation is complete.
      this.addAnimationEndListener_();

      // Add a click listener to the document, to close the menu.
      var callback = function (e) {
        // Check to see if the document is processing the same event that
        // displayed the menu in the first place. If so, do nothing.
        // Also check to see if the menu is in the process of closing itself, and
        // do nothing in that case.
        // Also check if the clicked element is a menu item
        // if so, do nothing.
        if (e !== evt && !this.closing_ && e.target.parentNode !== this.element_) {
          document.removeEventListener('click', callback);
          this.hide();
        }
      }.bind(this);
      document.addEventListener('click', callback);
    }
  };
  MaterialMenu.prototype['show'] = MaterialMenu.prototype.show;

  /**
   * Hides the menu.
   *
   * @public
   */
  MaterialMenu.prototype.hide = function () {
    if (this.element_ && this.container_ && this.outline_) {
      var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM);

      // Remove all transition delays; menu items fade out concurrently.
      for (var i = 0; i < items.length; i++) {
        items[i].style.removeProperty('transition-delay');
      }

      // Measure the inner element.
      var rect = this.element_.getBoundingClientRect();
      var height = rect.height;
      var width = rect.width;

      // Turn on animation, and apply the final clip. Also make invisible.
      // This triggers the transitions.
      this.element_.classList.add(this.CssClasses_.IS_ANIMATING);
      this.applyClip_(height, width);
      this.container_.classList.remove(this.CssClasses_.IS_VISIBLE);

      // Clean up after the animation is complete.
      this.addAnimationEndListener_();
    }
  };
  MaterialMenu.prototype['hide'] = MaterialMenu.prototype.hide;

  /**
   * Displays or hides the menu, depending on current state.
   *
   * @public
   */
  MaterialMenu.prototype.toggle = function (evt) {
    if (this.container_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
      this.hide();
    } else {
      this.show(evt);
    }
  };
  MaterialMenu.prototype['toggle'] = MaterialMenu.prototype.toggle;

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: MaterialMenu,
    classAsString: 'MaterialMenu',
    cssClass: 'mdl-js-menu',
    widget: true
  });
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1lbnUuanMiXSwibmFtZXMiOlsiTWF0ZXJpYWxNZW51IiwiZWxlbWVudCIsImVsZW1lbnRfIiwiaW5pdCIsIndpbmRvdyIsInByb3RvdHlwZSIsIkNvbnN0YW50XyIsIlRSQU5TSVRJT05fRFVSQVRJT05fU0VDT05EUyIsIlRSQU5TSVRJT05fRFVSQVRJT05fRlJBQ1RJT04iLCJDTE9TRV9USU1FT1VUIiwiS2V5Y29kZXNfIiwiRU5URVIiLCJFU0NBUEUiLCJTUEFDRSIsIlVQX0FSUk9XIiwiRE9XTl9BUlJPVyIsIkNzc0NsYXNzZXNfIiwiQ09OVEFJTkVSIiwiT1VUTElORSIsIklURU0iLCJJVEVNX1JJUFBMRV9DT05UQUlORVIiLCJSSVBQTEVfRUZGRUNUIiwiUklQUExFX0lHTk9SRV9FVkVOVFMiLCJSSVBQTEUiLCJJU19VUEdSQURFRCIsIklTX1ZJU0lCTEUiLCJJU19BTklNQVRJTkciLCJCT1RUT01fTEVGVCIsIkJPVFRPTV9SSUdIVCIsIlRPUF9MRUZUIiwiVE9QX1JJR0hUIiwiVU5BTElHTkVEIiwiY29udGFpbmVyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwicGFyZW50RWxlbWVudCIsImluc2VydEJlZm9yZSIsInJlbW92ZUNoaWxkIiwiYXBwZW5kQ2hpbGQiLCJjb250YWluZXJfIiwib3V0bGluZSIsIm91dGxpbmVfIiwiZm9yRWxJZCIsImdldEF0dHJpYnV0ZSIsImZvckVsIiwiZ2V0RWxlbWVudEJ5SWQiLCJmb3JFbGVtZW50XyIsImFkZEV2ZW50TGlzdGVuZXIiLCJoYW5kbGVGb3JDbGlja18iLCJiaW5kIiwiaGFuZGxlRm9yS2V5Ym9hcmRFdmVudF8iLCJpdGVtcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJib3VuZEl0ZW1LZXlkb3duXyIsImhhbmRsZUl0ZW1LZXlib2FyZEV2ZW50XyIsImJvdW5kSXRlbUNsaWNrXyIsImhhbmRsZUl0ZW1DbGlja18iLCJpIiwibGVuZ3RoIiwidGFiSW5kZXgiLCJjb250YWlucyIsIml0ZW0iLCJyaXBwbGVDb250YWluZXIiLCJyaXBwbGUiLCJldnQiLCJyZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiZm9yUmVjdCIsInN0eWxlIiwicmlnaHQiLCJ0b3AiLCJvZmZzZXRUb3AiLCJvZmZzZXRIZWlnaHQiLCJsZWZ0Iiwib2Zmc2V0TGVmdCIsImJvdHRvbSIsInRvZ2dsZSIsImtleUNvZGUiLCJwcmV2ZW50RGVmYXVsdCIsImZvY3VzIiwiY3VycmVudEluZGV4IiwiQXJyYXkiLCJzbGljZSIsImNhbGwiLCJpbmRleE9mIiwidGFyZ2V0IiwiZSIsIk1vdXNlRXZlbnQiLCJkaXNwYXRjaEV2ZW50IiwiY2xpY2siLCJoaWRlIiwiaGFzQXR0cmlidXRlIiwic3RvcFByb3BhZ2F0aW9uIiwiY2xvc2luZ18iLCJzZXRUaW1lb3V0IiwiYXBwbHlDbGlwXyIsImhlaWdodCIsIndpZHRoIiwiY2xpcCIsInJlbW92ZUFuaW1hdGlvbkVuZExpc3RlbmVyXyIsInJlbW92ZSIsImFkZEFuaW1hdGlvbkVuZExpc3RlbmVyXyIsInNob3ciLCJ0cmFuc2l0aW9uRHVyYXRpb24iLCJpdGVtRGVsYXkiLCJ0cmFuc2l0aW9uRGVsYXkiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJjYWxsYmFjayIsInBhcmVudE5vZGUiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicmVtb3ZlUHJvcGVydHkiLCJjb21wb25lbnRIYW5kbGVyIiwicmVnaXN0ZXIiLCJjb25zdHJ1Y3RvciIsImNsYXNzQXNTdHJpbmciLCJjc3NDbGFzcyIsIndpZGdldCJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLENBQUMsWUFBVztBQUNWOztBQUVBOzs7Ozs7Ozs7QUFRQSxNQUFJQSxlQUFlLFNBQVNBLFlBQVQsQ0FBc0JDLE9BQXRCLEVBQStCO0FBQ2hELFNBQUtDLFFBQUwsR0FBZ0JELE9BQWhCOztBQUVBO0FBQ0EsU0FBS0UsSUFBTDtBQUNELEdBTEQ7QUFNQUMsU0FBTyxjQUFQLElBQXlC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LFFBQUksS0FBS3pCLFVBQUwsQ0FBZ0JOLFNBQWhCLENBQTBCMkIsUUFBMUIsQ0FBbUMsS0FBSzlDLFdBQUwsQ0FBaUJTLFVBQXBELENBQUosRUFBcUU7QUFDbkUsV0FBS21FLElBQUw7QUFDRCxLQUZELE1BRU87QUFDTCxXQUFLWSxJQUFMLENBQVV0QyxHQUFWO0FBQ0Q7QUFDRixHQU5EO0FBT0FsRSxlQUFhSyxTQUFiLENBQXVCLFFBQXZCLElBQW1DTCxhQUFhSyxTQUFiLENBQXVCeUUsTUFBMUQ7O0FBRUE7QUFDQTtBQUNBbUMsbUJBQWlCQyxRQUFqQixDQUEwQjtBQUN4QkMsaUJBQWFuSCxZQURXO0FBRXhCb0gsbUJBQWUsY0FGUztBQUd4QkMsY0FBVSxhQUhjO0FBSXhCQyxZQUFRO0FBSmdCLEdBQTFCO0FBTUQsQ0FoZEQiLCJmaWxlIjoibWVudS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE1IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvKipcbiAgICogQ2xhc3MgY29uc3RydWN0b3IgZm9yIGRyb3Bkb3duIE1ETCBjb21wb25lbnQuXG4gICAqIEltcGxlbWVudHMgTURMIGNvbXBvbmVudCBkZXNpZ24gcGF0dGVybiBkZWZpbmVkIGF0OlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vamFzb25tYXllcy9tZGwtY29tcG9uZW50LWRlc2lnbi1wYXR0ZXJuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRoYXQgd2lsbCBiZSB1cGdyYWRlZC5cbiAgICovXG4gIHZhciBNYXRlcmlhbE1lbnUgPSBmdW5jdGlvbiBNYXRlcmlhbE1lbnUoZWxlbWVudCkge1xuICAgIHRoaXMuZWxlbWVudF8gPSBlbGVtZW50O1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBpbnN0YW5jZS5cbiAgICB0aGlzLmluaXQoKTtcbiAgfTtcbiAgd2luZG93WydNYXRlcmlhbE1lbnUnXSA9IE1hdGVyaWFsTWVudTtcblxuICAvKipcbiAgICogU3RvcmUgY29uc3RhbnRzIGluIG9uZSBwbGFjZSBzbyB0aGV5IGNhbiBiZSB1cGRhdGVkIGVhc2lseS5cbiAgICpcbiAgICogQGVudW0ge3N0cmluZyB8IG51bWJlcn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsTWVudS5wcm90b3R5cGUuQ29uc3RhbnRfID0ge1xuICAgIC8vIFRvdGFsIGR1cmF0aW9uIG9mIHRoZSBtZW51IGFuaW1hdGlvbi5cbiAgICBUUkFOU0lUSU9OX0RVUkFUSU9OX1NFQ09ORFM6IDAuMyxcbiAgICAvLyBUaGUgZnJhY3Rpb24gb2YgdGhlIHRvdGFsIGR1cmF0aW9uIHdlIHdhbnQgdG8gdXNlIGZvciBtZW51IGl0ZW0gYW5pbWF0aW9ucy5cbiAgICBUUkFOU0lUSU9OX0RVUkFUSU9OX0ZSQUNUSU9OOiAwLjgsXG4gICAgLy8gSG93IGxvbmcgdGhlIG1lbnUgc3RheXMgb3BlbiBhZnRlciBjaG9vc2luZyBhbiBvcHRpb24gKHNvIHRoZSB1c2VyIGNhbiBzZWVcbiAgICAvLyB0aGUgcmlwcGxlKS5cbiAgICBDTE9TRV9USU1FT1VUOiAxNTBcbiAgfTtcblxuICAvKipcbiAgICogS2V5Y29kZXMsIGZvciBjb2RlIHJlYWRhYmlsaXR5LlxuICAgKlxuICAgKiBAZW51bSB7bnVtYmVyfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxNZW51LnByb3RvdHlwZS5LZXljb2Rlc18gPSB7XG4gICAgRU5URVI6IDEzLFxuICAgIEVTQ0FQRTogMjcsXG4gICAgU1BBQ0U6IDMyLFxuICAgIFVQX0FSUk9XOiAzOCxcbiAgICBET1dOX0FSUk9XOiA0MFxuICB9O1xuXG4gIC8qKlxuICAgKiBTdG9yZSBzdHJpbmdzIGZvciBjbGFzcyBuYW1lcyBkZWZpbmVkIGJ5IHRoaXMgY29tcG9uZW50IHRoYXQgYXJlIHVzZWQgaW5cbiAgICogSmF2YVNjcmlwdC4gVGhpcyBhbGxvd3MgdXMgdG8gc2ltcGx5IGNoYW5nZSBpdCBpbiBvbmUgcGxhY2Ugc2hvdWxkIHdlXG4gICAqIGRlY2lkZSB0byBtb2RpZnkgYXQgYSBsYXRlciBkYXRlLlxuICAgKlxuICAgKiBAZW51bSB7c3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxNZW51LnByb3RvdHlwZS5Dc3NDbGFzc2VzXyA9IHtcbiAgICBDT05UQUlORVI6ICdtZGwtbWVudV9fY29udGFpbmVyJyxcbiAgICBPVVRMSU5FOiAnbWRsLW1lbnVfX291dGxpbmUnLFxuICAgIElURU06ICdtZGwtbWVudV9faXRlbScsXG4gICAgSVRFTV9SSVBQTEVfQ09OVEFJTkVSOiAnbWRsLW1lbnVfX2l0ZW0tcmlwcGxlLWNvbnRhaW5lcicsXG4gICAgUklQUExFX0VGRkVDVDogJ21kbC1qcy1yaXBwbGUtZWZmZWN0JyxcbiAgICBSSVBQTEVfSUdOT1JFX0VWRU5UUzogJ21kbC1qcy1yaXBwbGUtZWZmZWN0LS1pZ25vcmUtZXZlbnRzJyxcbiAgICBSSVBQTEU6ICdtZGwtcmlwcGxlJyxcbiAgICAvLyBTdGF0dXNlc1xuICAgIElTX1VQR1JBREVEOiAnaXMtdXBncmFkZWQnLFxuICAgIElTX1ZJU0lCTEU6ICdpcy12aXNpYmxlJyxcbiAgICBJU19BTklNQVRJTkc6ICdpcy1hbmltYXRpbmcnLFxuICAgIC8vIEFsaWdubWVudCBvcHRpb25zXG4gICAgQk9UVE9NX0xFRlQ6ICdtZGwtbWVudS0tYm90dG9tLWxlZnQnLCAgLy8gVGhpcyBpcyB0aGUgZGVmYXVsdC5cbiAgICBCT1RUT01fUklHSFQ6ICdtZGwtbWVudS0tYm90dG9tLXJpZ2h0JyxcbiAgICBUT1BfTEVGVDogJ21kbC1tZW51LS10b3AtbGVmdCcsXG4gICAgVE9QX1JJR0hUOiAnbWRsLW1lbnUtLXRvcC1yaWdodCcsXG4gICAgVU5BTElHTkVEOiAnbWRsLW1lbnUtLXVuYWxpZ25lZCdcbiAgfTtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBlbGVtZW50LlxuICAgKi9cbiAgTWF0ZXJpYWxNZW51LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuZWxlbWVudF8pIHtcbiAgICAgIC8vIENyZWF0ZSBjb250YWluZXIgZm9yIHRoZSBtZW51LlxuICAgICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5DT05UQUlORVIpO1xuICAgICAgdGhpcy5lbGVtZW50Xy5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShjb250YWluZXIsIHRoaXMuZWxlbWVudF8pO1xuICAgICAgdGhpcy5lbGVtZW50Xy5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudF8pO1xuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudF8pO1xuICAgICAgdGhpcy5jb250YWluZXJfID0gY29udGFpbmVyO1xuXG4gICAgICAvLyBDcmVhdGUgb3V0bGluZSBmb3IgdGhlIG1lbnUgKHNoYWRvdyBhbmQgYmFja2dyb3VuZCkuXG4gICAgICB2YXIgb3V0bGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgb3V0bGluZS5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uT1VUTElORSk7XG4gICAgICB0aGlzLm91dGxpbmVfID0gb3V0bGluZTtcbiAgICAgIGNvbnRhaW5lci5pbnNlcnRCZWZvcmUob3V0bGluZSwgdGhpcy5lbGVtZW50Xyk7XG5cbiAgICAgIC8vIEZpbmQgdGhlIFwiZm9yXCIgZWxlbWVudCBhbmQgYmluZCBldmVudHMgdG8gaXQuXG4gICAgICB2YXIgZm9yRWxJZCA9IHRoaXMuZWxlbWVudF8uZ2V0QXR0cmlidXRlKCdmb3InKSB8fFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uZ2V0QXR0cmlidXRlKCdkYXRhLW1kbC1mb3InKTtcbiAgICAgIHZhciBmb3JFbCA9IG51bGw7XG4gICAgICBpZiAoZm9yRWxJZCkge1xuICAgICAgICBmb3JFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGZvckVsSWQpO1xuICAgICAgICBpZiAoZm9yRWwpIHtcbiAgICAgICAgICB0aGlzLmZvckVsZW1lbnRfID0gZm9yRWw7XG4gICAgICAgICAgZm9yRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhhbmRsZUZvckNsaWNrXy5iaW5kKHRoaXMpKTtcbiAgICAgICAgICBmb3JFbC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJyxcbiAgICAgICAgICAgICAgdGhpcy5oYW5kbGVGb3JLZXlib2FyZEV2ZW50Xy5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgaXRlbXMgPSB0aGlzLmVsZW1lbnRfLnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICsgdGhpcy5Dc3NDbGFzc2VzXy5JVEVNKTtcbiAgICAgIHRoaXMuYm91bmRJdGVtS2V5ZG93bl8gPSB0aGlzLmhhbmRsZUl0ZW1LZXlib2FyZEV2ZW50Xy5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5ib3VuZEl0ZW1DbGlja18gPSB0aGlzLmhhbmRsZUl0ZW1DbGlja18uYmluZCh0aGlzKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gQWRkIGEgbGlzdGVuZXIgdG8gZWFjaCBtZW51IGl0ZW0uXG4gICAgICAgIGl0ZW1zW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5ib3VuZEl0ZW1DbGlja18pO1xuICAgICAgICAvLyBBZGQgYSB0YWIgaW5kZXggdG8gZWFjaCBtZW51IGl0ZW0uXG4gICAgICAgIGl0ZW1zW2ldLnRhYkluZGV4ID0gJy0xJztcbiAgICAgICAgLy8gQWRkIGEga2V5Ym9hcmQgbGlzdGVuZXIgdG8gZWFjaCBtZW51IGl0ZW0uXG4gICAgICAgIGl0ZW1zW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmJvdW5kSXRlbUtleWRvd25fKTtcbiAgICAgIH1cblxuICAgICAgLy8gQWRkIHJpcHBsZSBjbGFzc2VzIHRvIGVhY2ggaXRlbSwgaWYgdGhlIHVzZXIgaGFzIGVuYWJsZWQgcmlwcGxlcy5cbiAgICAgIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLlJJUFBMRV9FRkZFQ1QpKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLlJJUFBMRV9JR05PUkVfRVZFTlRTKTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgaXRlbSA9IGl0ZW1zW2ldO1xuXG4gICAgICAgICAgdmFyIHJpcHBsZUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICByaXBwbGVDb250YWluZXIuY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklURU1fUklQUExFX0NPTlRBSU5FUik7XG5cbiAgICAgICAgICB2YXIgcmlwcGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgIHJpcHBsZS5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uUklQUExFKTtcbiAgICAgICAgICByaXBwbGVDb250YWluZXIuYXBwZW5kQ2hpbGQocmlwcGxlKTtcblxuICAgICAgICAgIGl0ZW0uYXBwZW5kQ2hpbGQocmlwcGxlQ29udGFpbmVyKTtcbiAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5SSVBQTEVfRUZGRUNUKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBDb3B5IGFsaWdubWVudCBjbGFzc2VzIHRvIHRoZSBjb250YWluZXIsIHNvIHRoZSBvdXRsaW5lIGNhbiB1c2UgdGhlbS5cbiAgICAgIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLkJPVFRPTV9MRUZUKSkge1xuICAgICAgICB0aGlzLm91dGxpbmVfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5CT1RUT01fTEVGVCk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5CT1RUT01fUklHSFQpKSB7XG4gICAgICAgIHRoaXMub3V0bGluZV8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLkJPVFRPTV9SSUdIVCk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5UT1BfTEVGVCkpIHtcbiAgICAgICAgdGhpcy5vdXRsaW5lXy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uVE9QX0xFRlQpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uVE9QX1JJR0hUKSkge1xuICAgICAgICB0aGlzLm91dGxpbmVfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5UT1BfUklHSFQpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uVU5BTElHTkVEKSkge1xuICAgICAgICB0aGlzLm91dGxpbmVfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5VTkFMSUdORUQpO1xuICAgICAgfVxuXG4gICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklTX1VQR1JBREVEKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgYSBjbGljayBvbiB0aGUgXCJmb3JcIiBlbGVtZW50LCBieSBwb3NpdGlvbmluZyB0aGUgbWVudSBhbmQgdGhlblxuICAgKiB0b2dnbGluZyBpdC5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZ0IFRoZSBldmVudCB0aGF0IGZpcmVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxNZW51LnByb3RvdHlwZS5oYW5kbGVGb3JDbGlja18gPSBmdW5jdGlvbihldnQpIHtcbiAgICBpZiAodGhpcy5lbGVtZW50XyAmJiB0aGlzLmZvckVsZW1lbnRfKSB7XG4gICAgICB2YXIgcmVjdCA9IHRoaXMuZm9yRWxlbWVudF8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICB2YXIgZm9yUmVjdCA9IHRoaXMuZm9yRWxlbWVudF8ucGFyZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uVU5BTElHTkVEKSkge1xuICAgICAgICAvLyBEbyBub3QgcG9zaXRpb24gdGhlIG1lbnUgYXV0b21hdGljYWxseS4gUmVxdWlyZXMgdGhlIGRldmVsb3BlciB0b1xuICAgICAgICAvLyBtYW51YWxseSBzcGVjaWZ5IHBvc2l0aW9uLlxuICAgICAgfSBlbHNlIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyhcbiAgICAgICAgICB0aGlzLkNzc0NsYXNzZXNfLkJPVFRPTV9SSUdIVCkpIHtcbiAgICAgICAgLy8gUG9zaXRpb24gYmVsb3cgdGhlIFwiZm9yXCIgZWxlbWVudCwgYWxpZ25lZCB0byBpdHMgcmlnaHQuXG4gICAgICAgIHRoaXMuY29udGFpbmVyXy5zdHlsZS5yaWdodCA9IChmb3JSZWN0LnJpZ2h0IC0gcmVjdC5yaWdodCkgKyAncHgnO1xuICAgICAgICB0aGlzLmNvbnRhaW5lcl8uc3R5bGUudG9wID1cbiAgICAgICAgICAgIHRoaXMuZm9yRWxlbWVudF8ub2Zmc2V0VG9wICsgdGhpcy5mb3JFbGVtZW50Xy5vZmZzZXRIZWlnaHQgKyAncHgnO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLlRPUF9MRUZUKSkge1xuICAgICAgICAvLyBQb3NpdGlvbiBhYm92ZSB0aGUgXCJmb3JcIiBlbGVtZW50LCBhbGlnbmVkIHRvIGl0cyBsZWZ0LlxuICAgICAgICB0aGlzLmNvbnRhaW5lcl8uc3R5bGUubGVmdCA9IHRoaXMuZm9yRWxlbWVudF8ub2Zmc2V0TGVmdCArICdweCc7XG4gICAgICAgIHRoaXMuY29udGFpbmVyXy5zdHlsZS5ib3R0b20gPSAoZm9yUmVjdC5ib3R0b20gLSByZWN0LnRvcCkgKyAncHgnO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLlRPUF9SSUdIVCkpIHtcbiAgICAgICAgLy8gUG9zaXRpb24gYWJvdmUgdGhlIFwiZm9yXCIgZWxlbWVudCwgYWxpZ25lZCB0byBpdHMgcmlnaHQuXG4gICAgICAgIHRoaXMuY29udGFpbmVyXy5zdHlsZS5yaWdodCA9IChmb3JSZWN0LnJpZ2h0IC0gcmVjdC5yaWdodCkgKyAncHgnO1xuICAgICAgICB0aGlzLmNvbnRhaW5lcl8uc3R5bGUuYm90dG9tID0gKGZvclJlY3QuYm90dG9tIC0gcmVjdC50b3ApICsgJ3B4JztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIERlZmF1bHQ6IHBvc2l0aW9uIGJlbG93IHRoZSBcImZvclwiIGVsZW1lbnQsIGFsaWduZWQgdG8gaXRzIGxlZnQuXG4gICAgICAgIHRoaXMuY29udGFpbmVyXy5zdHlsZS5sZWZ0ID0gdGhpcy5mb3JFbGVtZW50Xy5vZmZzZXRMZWZ0ICsgJ3B4JztcbiAgICAgICAgdGhpcy5jb250YWluZXJfLnN0eWxlLnRvcCA9XG4gICAgICAgICAgICB0aGlzLmZvckVsZW1lbnRfLm9mZnNldFRvcCArIHRoaXMuZm9yRWxlbWVudF8ub2Zmc2V0SGVpZ2h0ICsgJ3B4JztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnRvZ2dsZShldnQpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGVzIGEga2V5Ym9hcmQgZXZlbnQgb24gdGhlIFwiZm9yXCIgZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZ0IFRoZSBldmVudCB0aGF0IGZpcmVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxNZW51LnByb3RvdHlwZS5oYW5kbGVGb3JLZXlib2FyZEV2ZW50XyA9IGZ1bmN0aW9uKGV2dCkge1xuICAgIGlmICh0aGlzLmVsZW1lbnRfICYmIHRoaXMuY29udGFpbmVyXyAmJiB0aGlzLmZvckVsZW1lbnRfKSB7XG4gICAgICB2YXIgaXRlbXMgPSB0aGlzLmVsZW1lbnRfLnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICsgdGhpcy5Dc3NDbGFzc2VzXy5JVEVNICtcbiAgICAgICAgJzpub3QoW2Rpc2FibGVkXSknKTtcblxuICAgICAgaWYgKGl0ZW1zICYmIGl0ZW1zLmxlbmd0aCA+IDAgJiZcbiAgICAgICAgICB0aGlzLmNvbnRhaW5lcl8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfVklTSUJMRSkpIHtcbiAgICAgICAgaWYgKGV2dC5rZXlDb2RlID09PSB0aGlzLktleWNvZGVzXy5VUF9BUlJPVykge1xuICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGl0ZW1zW2l0ZW1zLmxlbmd0aCAtIDFdLmZvY3VzKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZ0LmtleUNvZGUgPT09IHRoaXMuS2V5Y29kZXNfLkRPV05fQVJST1cpIHtcbiAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBpdGVtc1swXS5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGVzIGEga2V5Ym9hcmQgZXZlbnQgb24gYW4gaXRlbS5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZ0IFRoZSBldmVudCB0aGF0IGZpcmVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxNZW51LnByb3RvdHlwZS5oYW5kbGVJdGVtS2V5Ym9hcmRFdmVudF8gPSBmdW5jdGlvbihldnQpIHtcbiAgICBpZiAodGhpcy5lbGVtZW50XyAmJiB0aGlzLmNvbnRhaW5lcl8pIHtcbiAgICAgIHZhciBpdGVtcyA9IHRoaXMuZWxlbWVudF8ucXVlcnlTZWxlY3RvckFsbCgnLicgKyB0aGlzLkNzc0NsYXNzZXNfLklURU0gK1xuICAgICAgICAnOm5vdChbZGlzYWJsZWRdKScpO1xuXG4gICAgICBpZiAoaXRlbXMgJiYgaXRlbXMubGVuZ3RoID4gMCAmJlxuICAgICAgICAgIHRoaXMuY29udGFpbmVyXy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5JU19WSVNJQkxFKSkge1xuICAgICAgICB2YXIgY3VycmVudEluZGV4ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoaXRlbXMpLmluZGV4T2YoZXZ0LnRhcmdldCk7XG5cbiAgICAgICAgaWYgKGV2dC5rZXlDb2RlID09PSB0aGlzLktleWNvZGVzXy5VUF9BUlJPVykge1xuICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGlmIChjdXJyZW50SW5kZXggPiAwKSB7XG4gICAgICAgICAgICBpdGVtc1tjdXJyZW50SW5kZXggLSAxXS5mb2N1cygpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpdGVtc1tpdGVtcy5sZW5ndGggLSAxXS5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChldnQua2V5Q29kZSA9PT0gdGhpcy5LZXljb2Rlc18uRE9XTl9BUlJPVykge1xuICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGlmIChpdGVtcy5sZW5ndGggPiBjdXJyZW50SW5kZXggKyAxKSB7XG4gICAgICAgICAgICBpdGVtc1tjdXJyZW50SW5kZXggKyAxXS5mb2N1cygpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpdGVtc1swXS5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChldnQua2V5Q29kZSA9PT0gdGhpcy5LZXljb2Rlc18uU1BBQ0UgfHxcbiAgICAgICAgICAgICAgZXZ0LmtleUNvZGUgPT09IHRoaXMuS2V5Y29kZXNfLkVOVEVSKSB7XG4gICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgLy8gU2VuZCBtb3VzZWRvd24gYW5kIG1vdXNldXAgdG8gdHJpZ2dlciByaXBwbGUuXG4gICAgICAgICAgdmFyIGUgPSBuZXcgTW91c2VFdmVudCgnbW91c2Vkb3duJyk7XG4gICAgICAgICAgZXZ0LnRhcmdldC5kaXNwYXRjaEV2ZW50KGUpO1xuICAgICAgICAgIGUgPSBuZXcgTW91c2VFdmVudCgnbW91c2V1cCcpO1xuICAgICAgICAgIGV2dC50YXJnZXQuZGlzcGF0Y2hFdmVudChlKTtcbiAgICAgICAgICAvLyBTZW5kIGNsaWNrLlxuICAgICAgICAgIGV2dC50YXJnZXQuY2xpY2soKTtcbiAgICAgICAgfSBlbHNlIGlmIChldnQua2V5Q29kZSA9PT0gdGhpcy5LZXljb2Rlc18uRVNDQVBFKSB7XG4gICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgYSBjbGljayBldmVudCBvbiBhbiBpdGVtLlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBldnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbE1lbnUucHJvdG90eXBlLmhhbmRsZUl0ZW1DbGlja18gPSBmdW5jdGlvbihldnQpIHtcbiAgICBpZiAoZXZ0LnRhcmdldC5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJykpIHtcbiAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gV2FpdCBzb21lIHRpbWUgYmVmb3JlIGNsb3NpbmcgbWVudSwgc28gdGhlIHVzZXIgY2FuIHNlZSB0aGUgcmlwcGxlLlxuICAgICAgdGhpcy5jbG9zaW5nXyA9IHRydWU7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbihldnQpIHtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIHRoaXMuY2xvc2luZ18gPSBmYWxzZTtcbiAgICAgIH0uYmluZCh0aGlzKSwgLyoqIEB0eXBlIHtudW1iZXJ9ICovICh0aGlzLkNvbnN0YW50Xy5DTE9TRV9USU1FT1VUKSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSBpbml0aWFsIGNsaXAgKGZvciBvcGVuaW5nIHRoZSBtZW51KSBvciBmaW5hbCBjbGlwIChmb3IgY2xvc2luZ1xuICAgKiBpdCksIGFuZCBhcHBsaWVzIGl0LiBUaGlzIGFsbG93cyB1cyB0byBhbmltYXRlIGZyb20gb3IgdG8gdGhlIGNvcnJlY3QgcG9pbnQsXG4gICAqIHRoYXQgaXMsIHRoZSBwb2ludCBpdCdzIGFsaWduZWQgdG8gaW4gdGhlIFwiZm9yXCIgZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCBIZWlnaHQgb2YgdGhlIGNsaXAgcmVjdGFuZ2xlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCBXaWR0aCBvZiB0aGUgY2xpcCByZWN0YW5nbGVcbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsTWVudS5wcm90b3R5cGUuYXBwbHlDbGlwXyA9IGZ1bmN0aW9uKGhlaWdodCwgd2lkdGgpIHtcbiAgICBpZiAodGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5VTkFMSUdORUQpKSB7XG4gICAgICAvLyBEbyBub3QgY2xpcC5cbiAgICAgIHRoaXMuZWxlbWVudF8uc3R5bGUuY2xpcCA9ICcnO1xuICAgIH0gZWxzZSBpZiAodGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5CT1RUT01fUklHSFQpKSB7XG4gICAgICAvLyBDbGlwIHRvIHRoZSB0b3AgcmlnaHQgY29ybmVyIG9mIHRoZSBtZW51LlxuICAgICAgdGhpcy5lbGVtZW50Xy5zdHlsZS5jbGlwID1cbiAgICAgICAgICAncmVjdCgwICcgKyB3aWR0aCArICdweCAnICsgJzAgJyArIHdpZHRoICsgJ3B4KSc7XG4gICAgfSBlbHNlIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLlRPUF9MRUZUKSkge1xuICAgICAgLy8gQ2xpcCB0byB0aGUgYm90dG9tIGxlZnQgY29ybmVyIG9mIHRoZSBtZW51LlxuICAgICAgdGhpcy5lbGVtZW50Xy5zdHlsZS5jbGlwID1cbiAgICAgICAgICAncmVjdCgnICsgaGVpZ2h0ICsgJ3B4IDAgJyArIGhlaWdodCArICdweCAwKSc7XG4gICAgfSBlbHNlIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLlRPUF9SSUdIVCkpIHtcbiAgICAgIC8vIENsaXAgdG8gdGhlIGJvdHRvbSByaWdodCBjb3JuZXIgb2YgdGhlIG1lbnUuXG4gICAgICB0aGlzLmVsZW1lbnRfLnN0eWxlLmNsaXAgPSAncmVjdCgnICsgaGVpZ2h0ICsgJ3B4ICcgKyB3aWR0aCArICdweCAnICtcbiAgICAgICAgICBoZWlnaHQgKyAncHggJyArIHdpZHRoICsgJ3B4KSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIERlZmF1bHQ6IGRvIG5vdCBjbGlwIChzYW1lIGFzIGNsaXBwaW5nIHRvIHRoZSB0b3AgbGVmdCBjb3JuZXIpLlxuICAgICAgdGhpcy5lbGVtZW50Xy5zdHlsZS5jbGlwID0gJyc7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBDbGVhbnVwIGZ1bmN0aW9uIHRvIHJlbW92ZSBhbmltYXRpb24gbGlzdGVuZXJzLlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBldnRcbiAgICogQHByaXZhdGVcbiAgICovXG5cbiAgTWF0ZXJpYWxNZW51LnByb3RvdHlwZS5yZW1vdmVBbmltYXRpb25FbmRMaXN0ZW5lcl8gPSBmdW5jdGlvbihldnQpIHtcbiAgICBldnQudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoTWF0ZXJpYWxNZW51LnByb3RvdHlwZS5Dc3NDbGFzc2VzXy5JU19BTklNQVRJTkcpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBZGRzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIGNsZWFuIHVwIGFmdGVyIHRoZSBhbmltYXRpb24gZW5kcy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsTWVudS5wcm90b3R5cGUuYWRkQW5pbWF0aW9uRW5kTGlzdGVuZXJfID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5lbGVtZW50Xy5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgdGhpcy5yZW1vdmVBbmltYXRpb25FbmRMaXN0ZW5lcl8pO1xuICAgIHRoaXMuZWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcignd2Via2l0VHJhbnNpdGlvbkVuZCcsIHRoaXMucmVtb3ZlQW5pbWF0aW9uRW5kTGlzdGVuZXJfKTtcbiAgfTtcblxuICAvKipcbiAgICogRGlzcGxheXMgdGhlIG1lbnUuXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIE1hdGVyaWFsTWVudS5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uKGV2dCkge1xuICAgIGlmICh0aGlzLmVsZW1lbnRfICYmIHRoaXMuY29udGFpbmVyXyAmJiB0aGlzLm91dGxpbmVfKSB7XG4gICAgICAvLyBNZWFzdXJlIHRoZSBpbm5lciBlbGVtZW50LlxuICAgICAgdmFyIGhlaWdodCA9IHRoaXMuZWxlbWVudF8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuICAgICAgdmFyIHdpZHRoID0gdGhpcy5lbGVtZW50Xy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcblxuICAgICAgLy8gQXBwbHkgdGhlIGlubmVyIGVsZW1lbnQncyBzaXplIHRvIHRoZSBjb250YWluZXIgYW5kIG91dGxpbmUuXG4gICAgICB0aGlzLmNvbnRhaW5lcl8uc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XG4gICAgICB0aGlzLmNvbnRhaW5lcl8uc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcbiAgICAgIHRoaXMub3V0bGluZV8uc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XG4gICAgICB0aGlzLm91dGxpbmVfLnN0eWxlLmhlaWdodCA9IGhlaWdodCArICdweCc7XG5cbiAgICAgIHZhciB0cmFuc2l0aW9uRHVyYXRpb24gPSB0aGlzLkNvbnN0YW50Xy5UUkFOU0lUSU9OX0RVUkFUSU9OX1NFQ09ORFMgKlxuICAgICAgICAgIHRoaXMuQ29uc3RhbnRfLlRSQU5TSVRJT05fRFVSQVRJT05fRlJBQ1RJT047XG5cbiAgICAgIC8vIENhbGN1bGF0ZSB0cmFuc2l0aW9uIGRlbGF5cyBmb3IgaW5kaXZpZHVhbCBtZW51IGl0ZW1zLCBzbyB0aGF0IHRoZXkgZmFkZVxuICAgICAgLy8gaW4gb25lIGF0IGEgdGltZS5cbiAgICAgIHZhciBpdGVtcyA9IHRoaXMuZWxlbWVudF8ucXVlcnlTZWxlY3RvckFsbCgnLicgKyB0aGlzLkNzc0NsYXNzZXNfLklURU0pO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgaXRlbURlbGF5ID0gbnVsbDtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uVE9QX0xFRlQpIHx8XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLlRPUF9SSUdIVCkpIHtcbiAgICAgICAgICBpdGVtRGVsYXkgPSAoKGhlaWdodCAtIGl0ZW1zW2ldLm9mZnNldFRvcCAtIGl0ZW1zW2ldLm9mZnNldEhlaWdodCkgL1xuICAgICAgICAgICAgICBoZWlnaHQgKiB0cmFuc2l0aW9uRHVyYXRpb24pICsgJ3MnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1EZWxheSA9IChpdGVtc1tpXS5vZmZzZXRUb3AgLyBoZWlnaHQgKiB0cmFuc2l0aW9uRHVyYXRpb24pICsgJ3MnO1xuICAgICAgICB9XG4gICAgICAgIGl0ZW1zW2ldLnN0eWxlLnRyYW5zaXRpb25EZWxheSA9IGl0ZW1EZWxheTtcbiAgICAgIH1cblxuICAgICAgLy8gQXBwbHkgdGhlIGluaXRpYWwgY2xpcCB0byB0aGUgdGV4dCBiZWZvcmUgd2Ugc3RhcnQgYW5pbWF0aW5nLlxuICAgICAgdGhpcy5hcHBseUNsaXBfKGhlaWdodCwgd2lkdGgpO1xuXG4gICAgICAvLyBXYWl0IGZvciB0aGUgbmV4dCBmcmFtZSwgdHVybiBvbiBhbmltYXRpb24sIGFuZCBhcHBseSB0aGUgZmluYWwgY2xpcC5cbiAgICAgIC8vIEFsc28gbWFrZSBpdCB2aXNpYmxlLiBUaGlzIHRyaWdnZXJzIHRoZSB0cmFuc2l0aW9ucy5cbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklTX0FOSU1BVElORyk7XG4gICAgICAgIHRoaXMuZWxlbWVudF8uc3R5bGUuY2xpcCA9ICdyZWN0KDAgJyArIHdpZHRoICsgJ3B4ICcgKyBoZWlnaHQgKyAncHggMCknO1xuICAgICAgICB0aGlzLmNvbnRhaW5lcl8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklTX1ZJU0lCTEUpO1xuICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgYWZ0ZXIgdGhlIGFuaW1hdGlvbiBpcyBjb21wbGV0ZS5cbiAgICAgIHRoaXMuYWRkQW5pbWF0aW9uRW5kTGlzdGVuZXJfKCk7XG5cbiAgICAgIC8vIEFkZCBhIGNsaWNrIGxpc3RlbmVyIHRvIHRoZSBkb2N1bWVudCwgdG8gY2xvc2UgdGhlIG1lbnUuXG4gICAgICB2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgZG9jdW1lbnQgaXMgcHJvY2Vzc2luZyB0aGUgc2FtZSBldmVudCB0aGF0XG4gICAgICAgIC8vIGRpc3BsYXllZCB0aGUgbWVudSBpbiB0aGUgZmlyc3QgcGxhY2UuIElmIHNvLCBkbyBub3RoaW5nLlxuICAgICAgICAvLyBBbHNvIGNoZWNrIHRvIHNlZSBpZiB0aGUgbWVudSBpcyBpbiB0aGUgcHJvY2VzcyBvZiBjbG9zaW5nIGl0c2VsZiwgYW5kXG4gICAgICAgIC8vIGRvIG5vdGhpbmcgaW4gdGhhdCBjYXNlLlxuICAgICAgICAvLyBBbHNvIGNoZWNrIGlmIHRoZSBjbGlja2VkIGVsZW1lbnQgaXMgYSBtZW51IGl0ZW1cbiAgICAgICAgLy8gaWYgc28sIGRvIG5vdGhpbmcuXG4gICAgICAgIGlmIChlICE9PSBldnQgJiYgIXRoaXMuY2xvc2luZ18gJiYgZS50YXJnZXQucGFyZW50Tm9kZSAhPT0gdGhpcy5lbGVtZW50Xykge1xuICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2FsbGJhY2spO1xuICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcyk7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH07XG4gIE1hdGVyaWFsTWVudS5wcm90b3R5cGVbJ3Nob3cnXSA9IE1hdGVyaWFsTWVudS5wcm90b3R5cGUuc2hvdztcblxuICAvKipcbiAgICogSGlkZXMgdGhlIG1lbnUuXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIE1hdGVyaWFsTWVudS5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmVsZW1lbnRfICYmIHRoaXMuY29udGFpbmVyXyAmJiB0aGlzLm91dGxpbmVfKSB7XG4gICAgICB2YXIgaXRlbXMgPSB0aGlzLmVsZW1lbnRfLnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICsgdGhpcy5Dc3NDbGFzc2VzXy5JVEVNKTtcblxuICAgICAgLy8gUmVtb3ZlIGFsbCB0cmFuc2l0aW9uIGRlbGF5czsgbWVudSBpdGVtcyBmYWRlIG91dCBjb25jdXJyZW50bHkuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGl0ZW1zW2ldLnN0eWxlLnJlbW92ZVByb3BlcnR5KCd0cmFuc2l0aW9uLWRlbGF5Jyk7XG4gICAgICB9XG5cbiAgICAgIC8vIE1lYXN1cmUgdGhlIGlubmVyIGVsZW1lbnQuXG4gICAgICB2YXIgcmVjdCA9IHRoaXMuZWxlbWVudF8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICB2YXIgaGVpZ2h0ID0gcmVjdC5oZWlnaHQ7XG4gICAgICB2YXIgd2lkdGggPSByZWN0LndpZHRoO1xuXG4gICAgICAvLyBUdXJuIG9uIGFuaW1hdGlvbiwgYW5kIGFwcGx5IHRoZSBmaW5hbCBjbGlwLiBBbHNvIG1ha2UgaW52aXNpYmxlLlxuICAgICAgLy8gVGhpcyB0cmlnZ2VycyB0aGUgdHJhbnNpdGlvbnMuXG4gICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JU19BTklNQVRJTkcpO1xuICAgICAgdGhpcy5hcHBseUNsaXBfKGhlaWdodCwgd2lkdGgpO1xuICAgICAgdGhpcy5jb250YWluZXJfLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5Dc3NDbGFzc2VzXy5JU19WSVNJQkxFKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgYWZ0ZXIgdGhlIGFuaW1hdGlvbiBpcyBjb21wbGV0ZS5cbiAgICAgIHRoaXMuYWRkQW5pbWF0aW9uRW5kTGlzdGVuZXJfKCk7XG4gICAgfVxuICB9O1xuICBNYXRlcmlhbE1lbnUucHJvdG90eXBlWydoaWRlJ10gPSBNYXRlcmlhbE1lbnUucHJvdG90eXBlLmhpZGU7XG5cbiAgLyoqXG4gICAqIERpc3BsYXlzIG9yIGhpZGVzIHRoZSBtZW51LCBkZXBlbmRpbmcgb24gY3VycmVudCBzdGF0ZS5cbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgTWF0ZXJpYWxNZW51LnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbihldnQpIHtcbiAgICBpZiAodGhpcy5jb250YWluZXJfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLklTX1ZJU0lCTEUpKSB7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaG93KGV2dCk7XG4gICAgfVxuICB9O1xuICBNYXRlcmlhbE1lbnUucHJvdG90eXBlWyd0b2dnbGUnXSA9IE1hdGVyaWFsTWVudS5wcm90b3R5cGUudG9nZ2xlO1xuXG4gIC8vIFRoZSBjb21wb25lbnQgcmVnaXN0ZXJzIGl0c2VsZi4gSXQgY2FuIGFzc3VtZSBjb21wb25lbnRIYW5kbGVyIGlzIGF2YWlsYWJsZVxuICAvLyBpbiB0aGUgZ2xvYmFsIHNjb3BlLlxuICBjb21wb25lbnRIYW5kbGVyLnJlZ2lzdGVyKHtcbiAgICBjb25zdHJ1Y3RvcjogTWF0ZXJpYWxNZW51LFxuICAgIGNsYXNzQXNTdHJpbmc6ICdNYXRlcmlhbE1lbnUnLFxuICAgIGNzc0NsYXNzOiAnbWRsLWpzLW1lbnUnLFxuICAgIHdpZGdldDogdHJ1ZVxuICB9KTtcbn0pKCk7XG4iXX0=
