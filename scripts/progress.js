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
   * Class constructor for Progress MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */

  var MaterialProgress = function MaterialProgress(element) {
    this.element_ = element;

    // Initialize instance.
    this.init();
  };
  window['MaterialProgress'] = MaterialProgress;

  /**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
  MaterialProgress.prototype.Constant_ = {};

  /**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {string}
   * @private
   */
  MaterialProgress.prototype.CssClasses_ = {
    INDETERMINATE_CLASS: 'mdl-progress__indeterminate'
  };

  /**
   * Set the current progress of the progressbar.
   *
   * @param {number} p Percentage of the progress (0-100)
   * @public
   */
  MaterialProgress.prototype.setProgress = function (p) {
    if (this.element_.classList.contains(this.CssClasses_.INDETERMINATE_CLASS)) {
      return;
    }

    this.progressbar_.style.width = p + '%';
  };
  MaterialProgress.prototype['setProgress'] = MaterialProgress.prototype.setProgress;

  /**
   * Set the current progress of the buffer.
   *
   * @param {number} p Percentage of the buffer (0-100)
   * @public
   */
  MaterialProgress.prototype.setBuffer = function (p) {
    this.bufferbar_.style.width = p + '%';
    this.auxbar_.style.width = 100 - p + '%';
  };
  MaterialProgress.prototype['setBuffer'] = MaterialProgress.prototype.setBuffer;

  /**
   * Initialize element.
   */
  MaterialProgress.prototype.init = function () {
    if (this.element_) {
      var el = document.createElement('div');
      el.className = 'progressbar bar bar1';
      this.element_.appendChild(el);
      this.progressbar_ = el;

      el = document.createElement('div');
      el.className = 'bufferbar bar bar2';
      this.element_.appendChild(el);
      this.bufferbar_ = el;

      el = document.createElement('div');
      el.className = 'auxbar bar bar3';
      this.element_.appendChild(el);
      this.auxbar_ = el;

      this.progressbar_.style.width = '0%';
      this.bufferbar_.style.width = '100%';
      this.auxbar_.style.width = '0%';

      this.element_.classList.add('is-upgraded');
    }
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: MaterialProgress,
    classAsString: 'MaterialProgress',
    cssClass: 'mdl-js-progress',
    widget: true
  });
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2dyZXNzLmpzIl0sIm5hbWVzIjpbIk1hdGVyaWFsUHJvZ3Jlc3MiLCJlbGVtZW50IiwiZWxlbWVudF8iLCJpbml0Iiwid2luZG93IiwicHJvdG90eXBlIiwiQ29uc3RhbnRfIiwiQ3NzQ2xhc3Nlc18iLCJJTkRFVEVSTUlOQVRFX0NMQVNTIiwic2V0UHJvZ3Jlc3MiLCJwIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJwcm9ncmVzc2Jhcl8iLCJzdHlsZSIsIndpZHRoIiwic2V0QnVmZmVyIiwiYnVmZmVyYmFyXyIsImF1eGJhcl8iLCJlbCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsImFwcGVuZENoaWxkIiwiYWRkIiwiY29tcG9uZW50SGFuZGxlciIsInJlZ2lzdGVyIiwiY29uc3RydWN0b3IiLCJjbGFzc0FzU3RyaW5nIiwiY3NzQ2xhc3MiLCJ3aWRnZXQiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxDQUFDLFlBQVc7QUFDVjs7QUFFQTs7Ozs7Ozs7O0FBUUEsTUFBSUEsbUJBQW1CLFNBQVNBLGdCQUFULENBQTBCQyxPQUExQixFQUFtQztBQUN4RCxTQUFLQyxRQUFMLEdBQWdCRCxPQUFoQjs7QUFFQTtBQUNBLFNBQUtFLElBQUw7QUFDRCxHQUxEO0FBTUFDLFNBQU8sa0JBQVAsSUFBNkJKLGdCQUE3Qjs7QUFFQTs7Ozs7O0FBTUFBLG1CQUFpQkssU0FBakIsQ0FBMkJDLFNBQTNCLEdBQXVDLEVBQXZDOztBQUdBOzs7Ozs7OztBQVFBTixtQkFBaUJLLFNBQWpCLENBQTJCRSxXQUEzQixHQUF5QztBQUN2Q0MseUJBQXFCO0FBRGtCLEdBQXpDOztBQUlBOzs7Ozs7QUFNQVIsbUJBQWlCSyxTQUFqQixDQUEyQkksV0FBM0IsR0FBeUMsVUFBU0MsQ0FBVCxFQUFZO0FBQ25ELFFBQUksS0FBS1IsUUFBTCxDQUFjUyxTQUFkLENBQXdCQyxRQUF4QixDQUFpQyxLQUFLTCxXQUFMLENBQWlCQyxtQkFBbEQsQ0FBSixFQUE0RTtBQUMxRTtBQUNEOztBQUVELFNBQUtLLFlBQUwsQ0FBa0JDLEtBQWxCLENBQXdCQyxLQUF4QixHQUFnQ0wsSUFBSSxHQUFwQztBQUNELEdBTkQ7QUFPQVYsbUJBQWlCSyxTQUFqQixDQUEyQixhQUEzQixJQUNJTCxpQkFBaUJLLFNBQWpCLENBQTJCSSxXQUQvQjs7QUFHQTs7Ozs7O0FBTUFULG1CQUFpQkssU0FBakIsQ0FBMkJXLFNBQTNCLEdBQXVDLFVBQVNOLENBQVQsRUFBWTtBQUNqRCxTQUFLTyxVQUFMLENBQWdCSCxLQUFoQixDQUFzQkMsS0FBdEIsR0FBOEJMLElBQUksR0FBbEM7QUFDQSxTQUFLUSxPQUFMLENBQWFKLEtBQWIsQ0FBbUJDLEtBQW5CLEdBQTRCLE1BQU1MLENBQVAsR0FBWSxHQUF2QztBQUNELEdBSEQ7QUFJQVYsbUJBQWlCSyxTQUFqQixDQUEyQixXQUEzQixJQUNJTCxpQkFBaUJLLFNBQWpCLENBQTJCVyxTQUQvQjs7QUFHQTs7O0FBR0FoQixtQkFBaUJLLFNBQWpCLENBQTJCRixJQUEzQixHQUFrQyxZQUFXO0FBQzNDLFFBQUksS0FBS0QsUUFBVCxFQUFtQjtBQUNqQixVQUFJaUIsS0FBS0MsU0FBU0MsYUFBVCxDQUF1QixLQUF2QixDQUFUO0FBQ0FGLFNBQUdHLFNBQUgsR0FBZSxzQkFBZjtBQUNBLFdBQUtwQixRQUFMLENBQWNxQixXQUFkLENBQTBCSixFQUExQjtBQUNBLFdBQUtOLFlBQUwsR0FBb0JNLEVBQXBCOztBQUVBQSxXQUFLQyxTQUFTQyxhQUFULENBQXVCLEtBQXZCLENBQUw7QUFDQUYsU0FBR0csU0FBSCxHQUFlLG9CQUFmO0FBQ0EsV0FBS3BCLFFBQUwsQ0FBY3FCLFdBQWQsQ0FBMEJKLEVBQTFCO0FBQ0EsV0FBS0YsVUFBTCxHQUFrQkUsRUFBbEI7O0FBRUFBLFdBQUtDLFNBQVNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBTDtBQUNBRixTQUFHRyxTQUFILEdBQWUsaUJBQWY7QUFDQSxXQUFLcEIsUUFBTCxDQUFjcUIsV0FBZCxDQUEwQkosRUFBMUI7QUFDQSxXQUFLRCxPQUFMLEdBQWVDLEVBQWY7O0FBRUEsV0FBS04sWUFBTCxDQUFrQkMsS0FBbEIsQ0FBd0JDLEtBQXhCLEdBQWdDLElBQWhDO0FBQ0EsV0FBS0UsVUFBTCxDQUFnQkgsS0FBaEIsQ0FBc0JDLEtBQXRCLEdBQThCLE1BQTlCO0FBQ0EsV0FBS0csT0FBTCxDQUFhSixLQUFiLENBQW1CQyxLQUFuQixHQUEyQixJQUEzQjs7QUFFQSxXQUFLYixRQUFMLENBQWNTLFNBQWQsQ0FBd0JhLEdBQXhCLENBQTRCLGFBQTVCO0FBQ0Q7QUFDRixHQXZCRDs7QUF5QkE7QUFDQTtBQUNBQyxtQkFBaUJDLFFBQWpCLENBQTBCO0FBQ3hCQyxpQkFBYTNCLGdCQURXO0FBRXhCNEIsbUJBQWUsa0JBRlM7QUFHeEJDLGNBQVUsaUJBSGM7QUFJeEJDLFlBQVE7QUFKZ0IsR0FBMUI7QUFNRCxDQXpHRCIsImZpbGUiOiJwcm9ncmVzcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE1IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvKipcbiAgICogQ2xhc3MgY29uc3RydWN0b3IgZm9yIFByb2dyZXNzIE1ETCBjb21wb25lbnQuXG4gICAqIEltcGxlbWVudHMgTURMIGNvbXBvbmVudCBkZXNpZ24gcGF0dGVybiBkZWZpbmVkIGF0OlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vamFzb25tYXllcy9tZGwtY29tcG9uZW50LWRlc2lnbi1wYXR0ZXJuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRoYXQgd2lsbCBiZSB1cGdyYWRlZC5cbiAgICovXG4gIHZhciBNYXRlcmlhbFByb2dyZXNzID0gZnVuY3Rpb24gTWF0ZXJpYWxQcm9ncmVzcyhlbGVtZW50KSB7XG4gICAgdGhpcy5lbGVtZW50XyA9IGVsZW1lbnQ7XG5cbiAgICAvLyBJbml0aWFsaXplIGluc3RhbmNlLlxuICAgIHRoaXMuaW5pdCgpO1xuICB9O1xuICB3aW5kb3dbJ01hdGVyaWFsUHJvZ3Jlc3MnXSA9IE1hdGVyaWFsUHJvZ3Jlc3M7XG5cbiAgLyoqXG4gICAqIFN0b3JlIGNvbnN0YW50cyBpbiBvbmUgcGxhY2Ugc28gdGhleSBjYW4gYmUgdXBkYXRlZCBlYXNpbHkuXG4gICAqXG4gICAqIEBlbnVtIHtzdHJpbmcgfCBudW1iZXJ9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbFByb2dyZXNzLnByb3RvdHlwZS5Db25zdGFudF8gPSB7XG4gIH07XG5cbiAgLyoqXG4gICAqIFN0b3JlIHN0cmluZ3MgZm9yIGNsYXNzIG5hbWVzIGRlZmluZWQgYnkgdGhpcyBjb21wb25lbnQgdGhhdCBhcmUgdXNlZCBpblxuICAgKiBKYXZhU2NyaXB0LiBUaGlzIGFsbG93cyB1cyB0byBzaW1wbHkgY2hhbmdlIGl0IGluIG9uZSBwbGFjZSBzaG91bGQgd2VcbiAgICogZGVjaWRlIHRvIG1vZGlmeSBhdCBhIGxhdGVyIGRhdGUuXG4gICAqXG4gICAqIEBlbnVtIHtzdHJpbmd9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbFByb2dyZXNzLnByb3RvdHlwZS5Dc3NDbGFzc2VzXyA9IHtcbiAgICBJTkRFVEVSTUlOQVRFX0NMQVNTOiAnbWRsLXByb2dyZXNzX19pbmRldGVybWluYXRlJ1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGN1cnJlbnQgcHJvZ3Jlc3Mgb2YgdGhlIHByb2dyZXNzYmFyLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gcCBQZXJjZW50YWdlIG9mIHRoZSBwcm9ncmVzcyAoMC0xMDApXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIE1hdGVyaWFsUHJvZ3Jlc3MucHJvdG90eXBlLnNldFByb2dyZXNzID0gZnVuY3Rpb24ocCkge1xuICAgIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLklOREVURVJNSU5BVEVfQ0xBU1MpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5wcm9ncmVzc2Jhcl8uc3R5bGUud2lkdGggPSBwICsgJyUnO1xuICB9O1xuICBNYXRlcmlhbFByb2dyZXNzLnByb3RvdHlwZVsnc2V0UHJvZ3Jlc3MnXSA9XG4gICAgICBNYXRlcmlhbFByb2dyZXNzLnByb3RvdHlwZS5zZXRQcm9ncmVzcztcblxuICAvKipcbiAgICogU2V0IHRoZSBjdXJyZW50IHByb2dyZXNzIG9mIHRoZSBidWZmZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBwIFBlcmNlbnRhZ2Ugb2YgdGhlIGJ1ZmZlciAoMC0xMDApXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIE1hdGVyaWFsUHJvZ3Jlc3MucHJvdG90eXBlLnNldEJ1ZmZlciA9IGZ1bmN0aW9uKHApIHtcbiAgICB0aGlzLmJ1ZmZlcmJhcl8uc3R5bGUud2lkdGggPSBwICsgJyUnO1xuICAgIHRoaXMuYXV4YmFyXy5zdHlsZS53aWR0aCA9ICgxMDAgLSBwKSArICclJztcbiAgfTtcbiAgTWF0ZXJpYWxQcm9ncmVzcy5wcm90b3R5cGVbJ3NldEJ1ZmZlciddID1cbiAgICAgIE1hdGVyaWFsUHJvZ3Jlc3MucHJvdG90eXBlLnNldEJ1ZmZlcjtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBlbGVtZW50LlxuICAgKi9cbiAgTWF0ZXJpYWxQcm9ncmVzcy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmVsZW1lbnRfKSB7XG4gICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGVsLmNsYXNzTmFtZSA9ICdwcm9ncmVzc2JhciBiYXIgYmFyMSc7XG4gICAgICB0aGlzLmVsZW1lbnRfLmFwcGVuZENoaWxkKGVsKTtcbiAgICAgIHRoaXMucHJvZ3Jlc3NiYXJfID0gZWw7XG5cbiAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBlbC5jbGFzc05hbWUgPSAnYnVmZmVyYmFyIGJhciBiYXIyJztcbiAgICAgIHRoaXMuZWxlbWVudF8uYXBwZW5kQ2hpbGQoZWwpO1xuICAgICAgdGhpcy5idWZmZXJiYXJfID0gZWw7XG5cbiAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBlbC5jbGFzc05hbWUgPSAnYXV4YmFyIGJhciBiYXIzJztcbiAgICAgIHRoaXMuZWxlbWVudF8uYXBwZW5kQ2hpbGQoZWwpO1xuICAgICAgdGhpcy5hdXhiYXJfID0gZWw7XG5cbiAgICAgIHRoaXMucHJvZ3Jlc3NiYXJfLnN0eWxlLndpZHRoID0gJzAlJztcbiAgICAgIHRoaXMuYnVmZmVyYmFyXy5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICAgIHRoaXMuYXV4YmFyXy5zdHlsZS53aWR0aCA9ICcwJSc7XG5cbiAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCgnaXMtdXBncmFkZWQnKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gVGhlIGNvbXBvbmVudCByZWdpc3RlcnMgaXRzZWxmLiBJdCBjYW4gYXNzdW1lIGNvbXBvbmVudEhhbmRsZXIgaXMgYXZhaWxhYmxlXG4gIC8vIGluIHRoZSBnbG9iYWwgc2NvcGUuXG4gIGNvbXBvbmVudEhhbmRsZXIucmVnaXN0ZXIoe1xuICAgIGNvbnN0cnVjdG9yOiBNYXRlcmlhbFByb2dyZXNzLFxuICAgIGNsYXNzQXNTdHJpbmc6ICdNYXRlcmlhbFByb2dyZXNzJyxcbiAgICBjc3NDbGFzczogJ21kbC1qcy1wcm9ncmVzcycsXG4gICAgd2lkZ2V0OiB0cnVlXG4gIH0pO1xufSkoKTtcbiJdfQ==
