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
   * Class constructor for Data Table Card MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {Element} element The element that will be upgraded.
   */

  var MaterialDataTable = function MaterialDataTable(element) {
    this.element_ = element;

    // Initialize instance.
    this.init();
  };

  window['MaterialDataTable'] = MaterialDataTable;

  /**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
  MaterialDataTable.prototype.Constant_ = {
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
  MaterialDataTable.prototype.CssClasses_ = {
    DATA_TABLE: 'mdl-data-table',
    SELECTABLE: 'mdl-data-table--selectable',
    SELECT_ELEMENT: 'mdl-data-table__select',
    IS_SELECTED: 'is-selected',
    IS_UPGRADED: 'is-upgraded'
  };

  /**
   * Generates and returns a function that toggles the selection state of a
   * single row (or multiple rows).
   *
   * @param {Element} checkbox Checkbox that toggles the selection state.
   * @param {Element} row Row to toggle when checkbox changes.
   * @param {(Array<Object>|NodeList)=} opt_rows Rows to toggle when checkbox changes.
   * @private
   */
  MaterialDataTable.prototype.selectRow_ = function (checkbox, row, opt_rows) {
    if (row) {
      return function () {
        if (checkbox.checked) {
          row.classList.add(this.CssClasses_.IS_SELECTED);
        } else {
          row.classList.remove(this.CssClasses_.IS_SELECTED);
        }
      }.bind(this);
    }

    if (opt_rows) {
      return function () {
        var i;
        var el;
        if (checkbox.checked) {
          for (i = 0; i < opt_rows.length; i++) {
            el = opt_rows[i].querySelector('td').querySelector('.mdl-checkbox');
            el['MaterialCheckbox'].check();
            opt_rows[i].classList.add(this.CssClasses_.IS_SELECTED);
          }
        } else {
          for (i = 0; i < opt_rows.length; i++) {
            el = opt_rows[i].querySelector('td').querySelector('.mdl-checkbox');
            el['MaterialCheckbox'].uncheck();
            opt_rows[i].classList.remove(this.CssClasses_.IS_SELECTED);
          }
        }
      }.bind(this);
    }
  };

  /**
   * Creates a checkbox for a single or or multiple rows and hooks up the
   * event handling.
   *
   * @param {Element} row Row to toggle when checkbox changes.
   * @param {(Array<Object>|NodeList)=} opt_rows Rows to toggle when checkbox changes.
   * @private
   */
  MaterialDataTable.prototype.createCheckbox_ = function (row, opt_rows) {
    var label = document.createElement('label');
    var labelClasses = ['mdl-checkbox', 'mdl-js-checkbox', 'mdl-js-ripple-effect', this.CssClasses_.SELECT_ELEMENT];
    label.className = labelClasses.join(' ');
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('mdl-checkbox__input');

    if (row) {
      checkbox.checked = row.classList.contains(this.CssClasses_.IS_SELECTED);
      checkbox.addEventListener('change', this.selectRow_(checkbox, row));
    } else if (opt_rows) {
      checkbox.addEventListener('change', this.selectRow_(checkbox, null, opt_rows));
    }

    label.appendChild(checkbox);
    componentHandler.upgradeElement(label, 'MaterialCheckbox');
    return label;
  };

  /**
   * Initialize element.
   */
  MaterialDataTable.prototype.init = function () {
    if (this.element_) {
      var firstHeader = this.element_.querySelector('th');
      var bodyRows = Array.prototype.slice.call(this.element_.querySelectorAll('tbody tr'));
      var footRows = Array.prototype.slice.call(this.element_.querySelectorAll('tfoot tr'));
      var rows = bodyRows.concat(footRows);

      if (this.element_.classList.contains(this.CssClasses_.SELECTABLE)) {
        var th = document.createElement('th');
        var headerCheckbox = this.createCheckbox_(null, rows);
        th.appendChild(headerCheckbox);
        firstHeader.parentElement.insertBefore(th, firstHeader);

        for (var i = 0; i < rows.length; i++) {
          var firstCell = rows[i].querySelector('td');
          if (firstCell) {
            var td = document.createElement('td');
            if (rows[i].parentNode.nodeName.toUpperCase() === 'TBODY') {
              var rowCheckbox = this.createCheckbox_(rows[i]);
              td.appendChild(rowCheckbox);
            }
            rows[i].insertBefore(td, firstCell);
          }
        }
        this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
      }
    }
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: MaterialDataTable,
    classAsString: 'MaterialDataTable',
    cssClass: 'mdl-js-data-table'
  });
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhdGEtdGFibGUuanMiXSwibmFtZXMiOlsiTWF0ZXJpYWxEYXRhVGFibGUiLCJlbGVtZW50IiwiZWxlbWVudF8iLCJpbml0Iiwid2luZG93IiwicHJvdG90eXBlIiwiQ29uc3RhbnRfIiwiQ3NzQ2xhc3Nlc18iLCJEQVRBX1RBQkxFIiwiU0VMRUNUQUJMRSIsIlNFTEVDVF9FTEVNRU5UIiwiSVNfU0VMRUNURUQiLCJJU19VUEdSQURFRCIsInNlbGVjdFJvd18iLCJjaGVja2JveCIsInJvdyIsIm9wdF9yb3dzIiwiY2hlY2tlZCIsImNsYXNzTGlzdCIsImFkZCIsInJlbW92ZSIsImJpbmQiLCJpIiwiZWwiLCJsZW5ndGgiLCJxdWVyeVNlbGVjdG9yIiwiY2hlY2siLCJ1bmNoZWNrIiwiY3JlYXRlQ2hlY2tib3hfIiwibGFiZWwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJsYWJlbENsYXNzZXMiLCJjbGFzc05hbWUiLCJqb2luIiwidHlwZSIsImNvbnRhaW5zIiwiYWRkRXZlbnRMaXN0ZW5lciIsImFwcGVuZENoaWxkIiwiY29tcG9uZW50SGFuZGxlciIsInVwZ3JhZGVFbGVtZW50IiwiZmlyc3RIZWFkZXIiLCJib2R5Um93cyIsIkFycmF5Iiwic2xpY2UiLCJjYWxsIiwicXVlcnlTZWxlY3RvckFsbCIsImZvb3RSb3dzIiwicm93cyIsImNvbmNhdCIsInRoIiwiaGVhZGVyQ2hlY2tib3giLCJwYXJlbnRFbGVtZW50IiwiaW5zZXJ0QmVmb3JlIiwiZmlyc3RDZWxsIiwidGQiLCJwYXJlbnROb2RlIiwibm9kZU5hbWUiLCJ0b1VwcGVyQ2FzZSIsInJvd0NoZWNrYm94IiwicmVnaXN0ZXIiLCJjb25zdHJ1Y3RvciIsImNsYXNzQXNTdHJpbmciLCJjc3NDbGFzcyJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLENBQUMsWUFBVztBQUNWOztBQUVBOzs7Ozs7Ozs7QUFRQSxNQUFJQSxvQkFBb0IsU0FBU0EsaUJBQVQsQ0FBMkJD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QixJQUF2QixDQUFUO0FBQ0EsWUFBSW9CLGlCQUFpQixLQUFLdkIsZUFBTCxDQUFxQixJQUFyQixFQUEyQm9CLElBQTNCLENBQXJCO0FBQ0FFLFdBQUdaLFdBQUgsQ0FBZWEsY0FBZjtBQUNBVixvQkFBWVcsYUFBWixDQUEwQkMsWUFBMUIsQ0FBdUNILEVBQXZDLEVBQTJDVCxXQUEzQzs7QUFFQSxhQUFLLElBQUluQixJQUFJLENBQWIsRUFBZ0JBLElBQUkwQixLQUFLeEIsTUFBekIsRUFBaUNGLEdBQWpDLEVBQXNDO0FBQ3BDLGNBQUlnQyxZQUFZTixLQUFLMUIsQ0FBTCxFQUFRRyxhQUFSLENBQXNCLElBQXRCLENBQWhCO0FBQ0EsY0FBSTZCLFNBQUosRUFBZTtBQUNiLGdCQUFJQyxLQUFLekIsU0FBU0MsYUFBVCxDQUF1QixJQUF2QixDQUFUO0FBQ0EsZ0JBQUlpQixLQUFLMUIsQ0FBTCxFQUFRa0MsVUFBUixDQUFtQkMsUUFBbkIsQ0FBNEJDLFdBQTVCLE9BQThDLE9BQWxELEVBQTJEO0FBQ3pELGtCQUFJQyxjQUFjLEtBQUsvQixlQUFMLENBQXFCb0IsS0FBSzFCLENBQUwsQ0FBckIsQ0FBbEI7QUFDQWlDLGlCQUFHakIsV0FBSCxDQUFlcUIsV0FBZjtBQUNEO0FBQ0RYLGlCQUFLMUIsQ0FBTCxFQUFRK0IsWUFBUixDQUFxQkUsRUFBckIsRUFBeUJELFNBQXpCO0FBQ0Q7QUFDRjtBQUNELGFBQUtwRCxRQUFMLENBQWNnQixTQUFkLENBQXdCQyxHQUF4QixDQUE0QixLQUFLWixXQUFMLENBQWlCSyxXQUE3QztBQUNEO0FBQ0Y7QUFDRixHQTNCRDs7QUE2QkE7QUFDQTtBQUNBMkIsbUJBQWlCcUIsUUFBakIsQ0FBMEI7QUFDeEJDLGlCQUFhN0QsaUJBRFc7QUFFeEI4RCxtQkFBZSxtQkFGUztBQUd4QkMsY0FBVTtBQUhjLEdBQTFCO0FBS0QsQ0EvSkQiLCJmaWxlIjoiZGF0YS10YWJsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE1IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvKipcbiAgICogQ2xhc3MgY29uc3RydWN0b3IgZm9yIERhdGEgVGFibGUgQ2FyZCBNREwgY29tcG9uZW50LlxuICAgKiBJbXBsZW1lbnRzIE1ETCBjb21wb25lbnQgZGVzaWduIHBhdHRlcm4gZGVmaW5lZCBhdDpcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL2phc29ubWF5ZXMvbWRsLWNvbXBvbmVudC1kZXNpZ24tcGF0dGVyblxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRoYXQgd2lsbCBiZSB1cGdyYWRlZC5cbiAgICovXG4gIHZhciBNYXRlcmlhbERhdGFUYWJsZSA9IGZ1bmN0aW9uIE1hdGVyaWFsRGF0YVRhYmxlKGVsZW1lbnQpIHtcbiAgICB0aGlzLmVsZW1lbnRfID0gZWxlbWVudDtcblxuICAgIC8vIEluaXRpYWxpemUgaW5zdGFuY2UuXG4gICAgdGhpcy5pbml0KCk7XG4gIH07XG5cbiAgd2luZG93WydNYXRlcmlhbERhdGFUYWJsZSddID0gTWF0ZXJpYWxEYXRhVGFibGU7XG5cbiAgLyoqXG4gICAqIFN0b3JlIGNvbnN0YW50cyBpbiBvbmUgcGxhY2Ugc28gdGhleSBjYW4gYmUgdXBkYXRlZCBlYXNpbHkuXG4gICAqXG4gICAqIEBlbnVtIHtzdHJpbmcgfCBudW1iZXJ9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbERhdGFUYWJsZS5wcm90b3R5cGUuQ29uc3RhbnRfID0ge1xuICAgIC8vIE5vbmUgYXQgdGhlIG1vbWVudC5cbiAgfTtcblxuICAvKipcbiAgICogU3RvcmUgc3RyaW5ncyBmb3IgY2xhc3MgbmFtZXMgZGVmaW5lZCBieSB0aGlzIGNvbXBvbmVudCB0aGF0IGFyZSB1c2VkIGluXG4gICAqIEphdmFTY3JpcHQuIFRoaXMgYWxsb3dzIHVzIHRvIHNpbXBseSBjaGFuZ2UgaXQgaW4gb25lIHBsYWNlIHNob3VsZCB3ZVxuICAgKiBkZWNpZGUgdG8gbW9kaWZ5IGF0IGEgbGF0ZXIgZGF0ZS5cbiAgICpcbiAgICogQGVudW0ge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsRGF0YVRhYmxlLnByb3RvdHlwZS5Dc3NDbGFzc2VzXyA9IHtcbiAgICBEQVRBX1RBQkxFOiAnbWRsLWRhdGEtdGFibGUnLFxuICAgIFNFTEVDVEFCTEU6ICdtZGwtZGF0YS10YWJsZS0tc2VsZWN0YWJsZScsXG4gICAgU0VMRUNUX0VMRU1FTlQ6ICdtZGwtZGF0YS10YWJsZV9fc2VsZWN0JyxcbiAgICBJU19TRUxFQ1RFRDogJ2lzLXNlbGVjdGVkJyxcbiAgICBJU19VUEdSQURFRDogJ2lzLXVwZ3JhZGVkJ1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgYW5kIHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHRvZ2dsZXMgdGhlIHNlbGVjdGlvbiBzdGF0ZSBvZiBhXG4gICAqIHNpbmdsZSByb3cgKG9yIG11bHRpcGxlIHJvd3MpLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGNoZWNrYm94IENoZWNrYm94IHRoYXQgdG9nZ2xlcyB0aGUgc2VsZWN0aW9uIHN0YXRlLlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IHJvdyBSb3cgdG8gdG9nZ2xlIHdoZW4gY2hlY2tib3ggY2hhbmdlcy5cbiAgICogQHBhcmFtIHsoQXJyYXk8T2JqZWN0PnxOb2RlTGlzdCk9fSBvcHRfcm93cyBSb3dzIHRvIHRvZ2dsZSB3aGVuIGNoZWNrYm94IGNoYW5nZXMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbERhdGFUYWJsZS5wcm90b3R5cGUuc2VsZWN0Um93XyA9IGZ1bmN0aW9uKGNoZWNrYm94LCByb3csIG9wdF9yb3dzKSB7XG4gICAgaWYgKHJvdykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoY2hlY2tib3guY2hlY2tlZCkge1xuICAgICAgICAgIHJvdy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfU0VMRUNURUQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJvdy5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfU0VMRUNURUQpO1xuICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgaWYgKG9wdF9yb3dzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpO1xuICAgICAgICB2YXIgZWw7XG4gICAgICAgIGlmIChjaGVja2JveC5jaGVja2VkKSB7XG4gICAgICAgICAgZm9yIChpID0gMDsgaSA8IG9wdF9yb3dzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBlbCA9IG9wdF9yb3dzW2ldLnF1ZXJ5U2VsZWN0b3IoJ3RkJykucXVlcnlTZWxlY3RvcignLm1kbC1jaGVja2JveCcpO1xuICAgICAgICAgICAgZWxbJ01hdGVyaWFsQ2hlY2tib3gnXS5jaGVjaygpO1xuICAgICAgICAgICAgb3B0X3Jvd3NbaV0uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklTX1NFTEVDVEVEKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm9yIChpID0gMDsgaSA8IG9wdF9yb3dzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBlbCA9IG9wdF9yb3dzW2ldLnF1ZXJ5U2VsZWN0b3IoJ3RkJykucXVlcnlTZWxlY3RvcignLm1kbC1jaGVja2JveCcpO1xuICAgICAgICAgICAgZWxbJ01hdGVyaWFsQ2hlY2tib3gnXS51bmNoZWNrKCk7XG4gICAgICAgICAgICBvcHRfcm93c1tpXS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfU0VMRUNURUQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGNoZWNrYm94IGZvciBhIHNpbmdsZSBvciBvciBtdWx0aXBsZSByb3dzIGFuZCBob29rcyB1cCB0aGVcbiAgICogZXZlbnQgaGFuZGxpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gcm93IFJvdyB0byB0b2dnbGUgd2hlbiBjaGVja2JveCBjaGFuZ2VzLlxuICAgKiBAcGFyYW0geyhBcnJheTxPYmplY3Q+fE5vZGVMaXN0KT19IG9wdF9yb3dzIFJvd3MgdG8gdG9nZ2xlIHdoZW4gY2hlY2tib3ggY2hhbmdlcy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsRGF0YVRhYmxlLnByb3RvdHlwZS5jcmVhdGVDaGVja2JveF8gPSBmdW5jdGlvbihyb3csIG9wdF9yb3dzKSB7XG4gICAgdmFyIGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICB2YXIgbGFiZWxDbGFzc2VzID0gW1xuICAgICAgJ21kbC1jaGVja2JveCcsXG4gICAgICAnbWRsLWpzLWNoZWNrYm94JyxcbiAgICAgICdtZGwtanMtcmlwcGxlLWVmZmVjdCcsXG4gICAgICB0aGlzLkNzc0NsYXNzZXNfLlNFTEVDVF9FTEVNRU5UXG4gICAgXTtcbiAgICBsYWJlbC5jbGFzc05hbWUgPSBsYWJlbENsYXNzZXMuam9pbignICcpO1xuICAgIHZhciBjaGVja2JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgY2hlY2tib3gudHlwZSA9ICdjaGVja2JveCc7XG4gICAgY2hlY2tib3guY2xhc3NMaXN0LmFkZCgnbWRsLWNoZWNrYm94X19pbnB1dCcpO1xuXG4gICAgaWYgKHJvdykge1xuICAgICAgY2hlY2tib3guY2hlY2tlZCA9IHJvdy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5JU19TRUxFQ1RFRCk7XG4gICAgICBjaGVja2JveC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLnNlbGVjdFJvd18oY2hlY2tib3gsIHJvdykpO1xuICAgIH0gZWxzZSBpZiAob3B0X3Jvd3MpIHtcbiAgICAgIGNoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHRoaXMuc2VsZWN0Um93XyhjaGVja2JveCwgbnVsbCwgb3B0X3Jvd3MpKTtcbiAgICB9XG5cbiAgICBsYWJlbC5hcHBlbmRDaGlsZChjaGVja2JveCk7XG4gICAgY29tcG9uZW50SGFuZGxlci51cGdyYWRlRWxlbWVudChsYWJlbCwgJ01hdGVyaWFsQ2hlY2tib3gnKTtcbiAgICByZXR1cm4gbGFiZWw7XG4gIH07XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgZWxlbWVudC5cbiAgICovXG4gIE1hdGVyaWFsRGF0YVRhYmxlLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuZWxlbWVudF8pIHtcbiAgICAgIHZhciBmaXJzdEhlYWRlciA9IHRoaXMuZWxlbWVudF8ucXVlcnlTZWxlY3RvcigndGgnKTtcbiAgICAgIHZhciBib2R5Um93cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuZWxlbWVudF8ucXVlcnlTZWxlY3RvckFsbCgndGJvZHkgdHInKSk7XG4gICAgICB2YXIgZm9vdFJvd3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLmVsZW1lbnRfLnF1ZXJ5U2VsZWN0b3JBbGwoJ3Rmb290IHRyJykpO1xuICAgICAgdmFyIHJvd3MgPSBib2R5Um93cy5jb25jYXQoZm9vdFJvd3MpO1xuXG4gICAgICBpZiAodGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5TRUxFQ1RBQkxFKSkge1xuICAgICAgICB2YXIgdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0aCcpO1xuICAgICAgICB2YXIgaGVhZGVyQ2hlY2tib3ggPSB0aGlzLmNyZWF0ZUNoZWNrYm94XyhudWxsLCByb3dzKTtcbiAgICAgICAgdGguYXBwZW5kQ2hpbGQoaGVhZGVyQ2hlY2tib3gpO1xuICAgICAgICBmaXJzdEhlYWRlci5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZSh0aCwgZmlyc3RIZWFkZXIpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm93cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBmaXJzdENlbGwgPSByb3dzW2ldLnF1ZXJ5U2VsZWN0b3IoJ3RkJyk7XG4gICAgICAgICAgaWYgKGZpcnN0Q2VsbCkge1xuICAgICAgICAgICAgdmFyIHRkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICAgICAgICAgIGlmIChyb3dzW2ldLnBhcmVudE5vZGUubm9kZU5hbWUudG9VcHBlckNhc2UoKSA9PT0gJ1RCT0RZJykge1xuICAgICAgICAgICAgICB2YXIgcm93Q2hlY2tib3ggPSB0aGlzLmNyZWF0ZUNoZWNrYm94Xyhyb3dzW2ldKTtcbiAgICAgICAgICAgICAgdGQuYXBwZW5kQ2hpbGQocm93Q2hlY2tib3gpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcm93c1tpXS5pbnNlcnRCZWZvcmUodGQsIGZpcnN0Q2VsbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklTX1VQR1JBREVEKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLy8gVGhlIGNvbXBvbmVudCByZWdpc3RlcnMgaXRzZWxmLiBJdCBjYW4gYXNzdW1lIGNvbXBvbmVudEhhbmRsZXIgaXMgYXZhaWxhYmxlXG4gIC8vIGluIHRoZSBnbG9iYWwgc2NvcGUuXG4gIGNvbXBvbmVudEhhbmRsZXIucmVnaXN0ZXIoe1xuICAgIGNvbnN0cnVjdG9yOiBNYXRlcmlhbERhdGFUYWJsZSxcbiAgICBjbGFzc0FzU3RyaW5nOiAnTWF0ZXJpYWxEYXRhVGFibGUnLFxuICAgIGNzc0NsYXNzOiAnbWRsLWpzLWRhdGEtdGFibGUnXG4gIH0pO1xufSkoKTtcbiJdfQ==
