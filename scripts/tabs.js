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
   * Class constructor for Tabs MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {Element} element The element that will be upgraded.
   */

  var MaterialTabs = function MaterialTabs(element) {
    // Stores the HTML element.
    this.element_ = element;

    // Initialize instance.
    this.init();
  };
  window['MaterialTabs'] = MaterialTabs;

  /**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string}
   * @private
   */
  MaterialTabs.prototype.Constant_ = {
    // None at the moment.
  };

  /**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {string}
   * @private
   */
  MaterialTabs.prototype.CssClasses_ = {
    TAB_CLASS: 'mdl-tabs__tab',
    PANEL_CLASS: 'mdl-tabs__panel',
    ACTIVE_CLASS: 'is-active',
    UPGRADED_CLASS: 'is-upgraded',

    MDL_JS_RIPPLE_EFFECT: 'mdl-js-ripple-effect',
    MDL_RIPPLE_CONTAINER: 'mdl-tabs__ripple-container',
    MDL_RIPPLE: 'mdl-ripple',
    MDL_JS_RIPPLE_EFFECT_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events'
  };

  /**
   * Handle clicks to a tabs component
   *
   * @private
   */
  MaterialTabs.prototype.initTabs_ = function () {
    if (this.element_.classList.contains(this.CssClasses_.MDL_JS_RIPPLE_EFFECT)) {
      this.element_.classList.add(this.CssClasses_.MDL_JS_RIPPLE_EFFECT_IGNORE_EVENTS);
    }

    // Select element tabs, document panels
    this.tabs_ = this.element_.querySelectorAll('.' + this.CssClasses_.TAB_CLASS);
    this.panels_ = this.element_.querySelectorAll('.' + this.CssClasses_.PANEL_CLASS);

    // Create new tabs for each tab element
    for (var i = 0; i < this.tabs_.length; i++) {
      new MaterialTab(this.tabs_[i], this);
    }

    this.element_.classList.add(this.CssClasses_.UPGRADED_CLASS);
  };

  /**
   * Reset tab state, dropping active classes
   *
   * @private
   */
  MaterialTabs.prototype.resetTabState_ = function () {
    for (var k = 0; k < this.tabs_.length; k++) {
      this.tabs_[k].classList.remove(this.CssClasses_.ACTIVE_CLASS);
    }
  };

  /**
   * Reset panel state, droping active classes
   *
   * @private
   */
  MaterialTabs.prototype.resetPanelState_ = function () {
    for (var j = 0; j < this.panels_.length; j++) {
      this.panels_[j].classList.remove(this.CssClasses_.ACTIVE_CLASS);
    }
  };

  /**
   * Initialize element.
   */
  MaterialTabs.prototype.init = function () {
    if (this.element_) {
      this.initTabs_();
    }
  };

  /**
   * Constructor for an individual tab.
   *
   * @constructor
   * @param {Element} tab The HTML element for the tab.
   * @param {MaterialTabs} ctx The MaterialTabs object that owns the tab.
   */
  function MaterialTab(tab, ctx) {
    if (tab) {
      if (ctx.element_.classList.contains(ctx.CssClasses_.MDL_JS_RIPPLE_EFFECT)) {
        var rippleContainer = document.createElement('span');
        rippleContainer.classList.add(ctx.CssClasses_.MDL_RIPPLE_CONTAINER);
        rippleContainer.classList.add(ctx.CssClasses_.MDL_JS_RIPPLE_EFFECT);
        var ripple = document.createElement('span');
        ripple.classList.add(ctx.CssClasses_.MDL_RIPPLE);
        rippleContainer.appendChild(ripple);
        tab.appendChild(rippleContainer);
      }

      tab.addEventListener('click', function (e) {
        if (tab.getAttribute('href').charAt(0) === '#') {
          e.preventDefault();
          var href = tab.href.split('#')[1];
          var panel = ctx.element_.querySelector('#' + href);
          ctx.resetTabState_();
          ctx.resetPanelState_();
          tab.classList.add(ctx.CssClasses_.ACTIVE_CLASS);
          panel.classList.add(ctx.CssClasses_.ACTIVE_CLASS);
        }
      });
    }
  }

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: MaterialTabs,
    classAsString: 'MaterialTabs',
    cssClass: 'mdl-js-tabs'
  });
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRhYnMuanMiXSwibmFtZXMiOlsiTWF0ZXJpYWxUYWJzIiwiZWxlbWVudCIsImVsZW1lbnRfIiwiaW5pdCIsIndpbmRvdyIsInByb3RvdHlwZSIsIkNvbnN0YW50XyIsIkNzc0NsYXNzZXNfIiwiVEFCX0NMQVNTIiwiUEFORUxfQ0xBU1MiLCJBQ1RJVkVfQ0xBU1MiLCJVUEdSQURFRF9DTEFTUyIsIk1ETF9KU19SSVBQTEVfRUZGRUNUIiwiTURMX1JJUFBMRV9DT05UQUlORVIiLCJNRExfUklQUExFIiwiTURMX0pTX1JJUFBMRV9FRkZFQ1RfSUdOT1JFX0VWRU5UUyIsImluaXRUYWJzXyIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwiYWRkIiwidGFic18iLCJxdWVyeVNlbGVjdG9yQWxsIiwicGFuZWxzXyIsImkiLCJsZW5ndGgiLCJNYXRlcmlhbFRhYiIsInJlc2V0VGFiU3RhdGVfIiwiayIsInJlbW92ZSIsInJlc2V0UGFuZWxTdGF0ZV8iLCJqIiwidGFiIiwiY3R4IiwicmlwcGxlQ29udGFpbmVyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwicmlwcGxlIiwiYXBwZW5kQ2hpbGQiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsImdldEF0dHJpYnV0ZSIsImNoYXJBdCIsInByZXZlbnREZWZhdWx0IiwiaHJlZiIsInNwbGl0IiwicGFuZWwiLCJxdWVyeVNlbGVjdG9yIiwiY29tcG9uZW50SGFuZGxlciIsInJlZ2lzdGVyIiwiY29uc3RydWN0b3IiLCJjbGFzc0FzU3RyaW5nIiwiY3NzQ2xhc3MiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxDQUFDLFlBQVc7QUFDVjs7QUFFQTs7Ozs7Ozs7O0FBUUEsTUFBSUEsZUFBZSxTQUFTQSxZQUFULENBQXNCQyxPQUF0QixFQUErQjtBQUNoRDtBQUNBLFNBQUtDLFFBQUwsR0FBZ0JELE9BQWhCOztBQUVBO0FBQ0EsU0FBS0UsSUFBTDtBQUNELEdBTkQ7QUFPQUMsU0FBTyxjQUFQLElB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QWhCLENBQTBCRSxHQUExQixDQUE4QmEsSUFBSXpCLFdBQUosQ0FBZ0JLLG9CQUE5QztBQUNBLFlBQUl3QixTQUFTRixTQUFTQyxhQUFULENBQXVCLE1BQXZCLENBQWI7QUFDQUMsZUFBT25CLFNBQVAsQ0FBaUJFLEdBQWpCLENBQXFCYSxJQUFJekIsV0FBSixDQUFnQk8sVUFBckM7QUFDQW1CLHdCQUFnQkksV0FBaEIsQ0FBNEJELE1BQTVCO0FBQ0FMLFlBQUlNLFdBQUosQ0FBZ0JKLGVBQWhCO0FBQ0Q7O0FBRURGLFVBQUlPLGdCQUFKLENBQXFCLE9BQXJCLEVBQThCLFVBQVNDLENBQVQsRUFBWTtBQUN4QyxZQUFJUixJQUFJUyxZQUFKLENBQWlCLE1BQWpCLEVBQXlCQyxNQUF6QixDQUFnQyxDQUFoQyxNQUF1QyxHQUEzQyxFQUFnRDtBQUM5Q0YsWUFBRUcsY0FBRjtBQUNBLGNBQUlDLE9BQU9aLElBQUlZLElBQUosQ0FBU0MsS0FBVCxDQUFlLEdBQWYsRUFBb0IsQ0FBcEIsQ0FBWDtBQUNBLGNBQUlDLFFBQVFiLElBQUk5QixRQUFKLENBQWE0QyxhQUFiLENBQTJCLE1BQU1ILElBQWpDLENBQVo7QUFDQVgsY0FBSU4sY0FBSjtBQUNBTSxjQUFJSCxnQkFBSjtBQUNBRSxjQUFJZCxTQUFKLENBQWNFLEdBQWQsQ0FBa0JhLElBQUl6QixXQUFKLENBQWdCRyxZQUFsQztBQUNBbUMsZ0JBQU01QixTQUFOLENBQWdCRSxHQUFoQixDQUFvQmEsSUFBSXpCLFdBQUosQ0FBZ0JHLFlBQXBDO0FBQ0Q7QUFDRixPQVZEO0FBWUQ7QUFDRjs7QUFFRDtBQUNBO0FBQ0FxQyxtQkFBaUJDLFFBQWpCLENBQTBCO0FBQ3hCQyxpQkFBYWpELFlBRFc7QUFFeEJrRCxtQkFBZSxjQUZTO0FBR3hCQyxjQUFVO0FBSGMsR0FBMUI7QUFLRCxDQWxKRCIsImZpbGUiOiJ0YWJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTUgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qKlxuICAgKiBDbGFzcyBjb25zdHJ1Y3RvciBmb3IgVGFicyBNREwgY29tcG9uZW50LlxuICAgKiBJbXBsZW1lbnRzIE1ETCBjb21wb25lbnQgZGVzaWduIHBhdHRlcm4gZGVmaW5lZCBhdDpcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL2phc29ubWF5ZXMvbWRsLWNvbXBvbmVudC1kZXNpZ24tcGF0dGVyblxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRoYXQgd2lsbCBiZSB1cGdyYWRlZC5cbiAgICovXG4gIHZhciBNYXRlcmlhbFRhYnMgPSBmdW5jdGlvbiBNYXRlcmlhbFRhYnMoZWxlbWVudCkge1xuICAgIC8vIFN0b3JlcyB0aGUgSFRNTCBlbGVtZW50LlxuICAgIHRoaXMuZWxlbWVudF8gPSBlbGVtZW50O1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBpbnN0YW5jZS5cbiAgICB0aGlzLmluaXQoKTtcbiAgfTtcbiAgd2luZG93WydNYXRlcmlhbFRhYnMnXSA9IE1hdGVyaWFsVGFicztcblxuICAvKipcbiAgICogU3RvcmUgY29uc3RhbnRzIGluIG9uZSBwbGFjZSBzbyB0aGV5IGNhbiBiZSB1cGRhdGVkIGVhc2lseS5cbiAgICpcbiAgICogQGVudW0ge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsVGFicy5wcm90b3R5cGUuQ29uc3RhbnRfID0ge1xuICAgIC8vIE5vbmUgYXQgdGhlIG1vbWVudC5cbiAgfTtcblxuICAvKipcbiAgICogU3RvcmUgc3RyaW5ncyBmb3IgY2xhc3MgbmFtZXMgZGVmaW5lZCBieSB0aGlzIGNvbXBvbmVudCB0aGF0IGFyZSB1c2VkIGluXG4gICAqIEphdmFTY3JpcHQuIFRoaXMgYWxsb3dzIHVzIHRvIHNpbXBseSBjaGFuZ2UgaXQgaW4gb25lIHBsYWNlIHNob3VsZCB3ZVxuICAgKiBkZWNpZGUgdG8gbW9kaWZ5IGF0IGEgbGF0ZXIgZGF0ZS5cbiAgICpcbiAgICogQGVudW0ge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsVGFicy5wcm90b3R5cGUuQ3NzQ2xhc3Nlc18gPSB7XG4gICAgVEFCX0NMQVNTOiAnbWRsLXRhYnNfX3RhYicsXG4gICAgUEFORUxfQ0xBU1M6ICdtZGwtdGFic19fcGFuZWwnLFxuICAgIEFDVElWRV9DTEFTUzogJ2lzLWFjdGl2ZScsXG4gICAgVVBHUkFERURfQ0xBU1M6ICdpcy11cGdyYWRlZCcsXG5cbiAgICBNRExfSlNfUklQUExFX0VGRkVDVDogJ21kbC1qcy1yaXBwbGUtZWZmZWN0JyxcbiAgICBNRExfUklQUExFX0NPTlRBSU5FUjogJ21kbC10YWJzX19yaXBwbGUtY29udGFpbmVyJyxcbiAgICBNRExfUklQUExFOiAnbWRsLXJpcHBsZScsXG4gICAgTURMX0pTX1JJUFBMRV9FRkZFQ1RfSUdOT1JFX0VWRU5UUzogJ21kbC1qcy1yaXBwbGUtZWZmZWN0LS1pZ25vcmUtZXZlbnRzJ1xuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGUgY2xpY2tzIHRvIGEgdGFicyBjb21wb25lbnRcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsVGFicy5wcm90b3R5cGUuaW5pdFRhYnNfID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uTURMX0pTX1JJUFBMRV9FRkZFQ1QpKSB7XG4gICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQoXG4gICAgICAgIHRoaXMuQ3NzQ2xhc3Nlc18uTURMX0pTX1JJUFBMRV9FRkZFQ1RfSUdOT1JFX0VWRU5UUyk7XG4gICAgfVxuXG4gICAgLy8gU2VsZWN0IGVsZW1lbnQgdGFicywgZG9jdW1lbnQgcGFuZWxzXG4gICAgdGhpcy50YWJzXyA9IHRoaXMuZWxlbWVudF8ucXVlcnlTZWxlY3RvckFsbCgnLicgKyB0aGlzLkNzc0NsYXNzZXNfLlRBQl9DTEFTUyk7XG4gICAgdGhpcy5wYW5lbHNfID1cbiAgICAgICAgdGhpcy5lbGVtZW50Xy5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIHRoaXMuQ3NzQ2xhc3Nlc18uUEFORUxfQ0xBU1MpO1xuXG4gICAgLy8gQ3JlYXRlIG5ldyB0YWJzIGZvciBlYWNoIHRhYiBlbGVtZW50XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnRhYnNfLmxlbmd0aDsgaSsrKSB7XG4gICAgICBuZXcgTWF0ZXJpYWxUYWIodGhpcy50YWJzX1tpXSwgdGhpcyk7XG4gICAgfVxuXG4gICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uVVBHUkFERURfQ0xBU1MpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXNldCB0YWIgc3RhdGUsIGRyb3BwaW5nIGFjdGl2ZSBjbGFzc2VzXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbFRhYnMucHJvdG90eXBlLnJlc2V0VGFiU3RhdGVfID0gZnVuY3Rpb24oKSB7XG4gICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLnRhYnNfLmxlbmd0aDsgaysrKSB7XG4gICAgICB0aGlzLnRhYnNfW2tdLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5Dc3NDbGFzc2VzXy5BQ1RJVkVfQ0xBU1MpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogUmVzZXQgcGFuZWwgc3RhdGUsIGRyb3BpbmcgYWN0aXZlIGNsYXNzZXNcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsVGFicy5wcm90b3R5cGUucmVzZXRQYW5lbFN0YXRlXyA9IGZ1bmN0aW9uKCkge1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5wYW5lbHNfLmxlbmd0aDsgaisrKSB7XG4gICAgICB0aGlzLnBhbmVsc19bal0uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkNzc0NsYXNzZXNfLkFDVElWRV9DTEFTUyk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGVsZW1lbnQuXG4gICAqL1xuICBNYXRlcmlhbFRhYnMucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5lbGVtZW50Xykge1xuICAgICAgdGhpcy5pbml0VGFic18oKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBhbiBpbmRpdmlkdWFsIHRhYi5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gdGFiIFRoZSBIVE1MIGVsZW1lbnQgZm9yIHRoZSB0YWIuXG4gICAqIEBwYXJhbSB7TWF0ZXJpYWxUYWJzfSBjdHggVGhlIE1hdGVyaWFsVGFicyBvYmplY3QgdGhhdCBvd25zIHRoZSB0YWIuXG4gICAqL1xuICBmdW5jdGlvbiBNYXRlcmlhbFRhYih0YWIsIGN0eCkge1xuICAgIGlmICh0YWIpIHtcbiAgICAgIGlmIChjdHguZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKGN0eC5Dc3NDbGFzc2VzXy5NRExfSlNfUklQUExFX0VGRkVDVCkpIHtcbiAgICAgICAgdmFyIHJpcHBsZUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgcmlwcGxlQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoY3R4LkNzc0NsYXNzZXNfLk1ETF9SSVBQTEVfQ09OVEFJTkVSKTtcbiAgICAgICAgcmlwcGxlQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoY3R4LkNzc0NsYXNzZXNfLk1ETF9KU19SSVBQTEVfRUZGRUNUKTtcbiAgICAgICAgdmFyIHJpcHBsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgcmlwcGxlLmNsYXNzTGlzdC5hZGQoY3R4LkNzc0NsYXNzZXNfLk1ETF9SSVBQTEUpO1xuICAgICAgICByaXBwbGVDb250YWluZXIuYXBwZW5kQ2hpbGQocmlwcGxlKTtcbiAgICAgICAgdGFiLmFwcGVuZENoaWxkKHJpcHBsZUNvbnRhaW5lcik7XG4gICAgICB9XG5cbiAgICAgIHRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKHRhYi5nZXRBdHRyaWJ1dGUoJ2hyZWYnKS5jaGFyQXQoMCkgPT09ICcjJykge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB2YXIgaHJlZiA9IHRhYi5ocmVmLnNwbGl0KCcjJylbMV07XG4gICAgICAgICAgdmFyIHBhbmVsID0gY3R4LmVsZW1lbnRfLnF1ZXJ5U2VsZWN0b3IoJyMnICsgaHJlZik7XG4gICAgICAgICAgY3R4LnJlc2V0VGFiU3RhdGVfKCk7XG4gICAgICAgICAgY3R4LnJlc2V0UGFuZWxTdGF0ZV8oKTtcbiAgICAgICAgICB0YWIuY2xhc3NMaXN0LmFkZChjdHguQ3NzQ2xhc3Nlc18uQUNUSVZFX0NMQVNTKTtcbiAgICAgICAgICBwYW5lbC5jbGFzc0xpc3QuYWRkKGN0eC5Dc3NDbGFzc2VzXy5BQ1RJVkVfQ0xBU1MpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIH1cbiAgfVxuXG4gIC8vIFRoZSBjb21wb25lbnQgcmVnaXN0ZXJzIGl0c2VsZi4gSXQgY2FuIGFzc3VtZSBjb21wb25lbnRIYW5kbGVyIGlzIGF2YWlsYWJsZVxuICAvLyBpbiB0aGUgZ2xvYmFsIHNjb3BlLlxuICBjb21wb25lbnRIYW5kbGVyLnJlZ2lzdGVyKHtcbiAgICBjb25zdHJ1Y3RvcjogTWF0ZXJpYWxUYWJzLFxuICAgIGNsYXNzQXNTdHJpbmc6ICdNYXRlcmlhbFRhYnMnLFxuICAgIGNzc0NsYXNzOiAnbWRsLWpzLXRhYnMnXG4gIH0pO1xufSkoKTtcbiJdfQ==
