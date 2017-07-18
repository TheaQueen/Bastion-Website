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

/**
 * A component handler interface using the revealing module design pattern.
 * More details on this design pattern here:
 * https://github.com/jasonmayes/mdl-component-design-pattern
 *
 * @author Jason Mayes.
 */
/* exported componentHandler */

// Pre-defining the componentHandler interface, for closure documentation and
// static verification.
var componentHandler = {
  /**
   * Searches existing DOM for elements of our component type and upgrades them
   * if they have not already been upgraded.
   *
   * @param {string=} optJsClass the programatic name of the element class we
   * need to create a new instance of.
   * @param {string=} optCssClass the name of the CSS class elements of this
   * type will have.
   */
  upgradeDom: function (optJsClass, optCssClass) {},
  /**
   * Upgrades a specific element rather than all in the DOM.
   *
   * @param {!Element} element The element we wish to upgrade.
   * @param {string=} optJsClass Optional name of the class we want to upgrade
   * the element to.
   */
  upgradeElement: function (element, optJsClass) {},
  /**
   * Upgrades a specific list of elements rather than all in the DOM.
   *
   * @param {!Element|!Array<!Element>|!NodeList|!HTMLCollection} elements
   * The elements we wish to upgrade.
   */
  upgradeElements: function (elements) {},
  /**
   * Upgrades all registered components found in the current DOM. This is
   * automatically called on window load.
   */
  upgradeAllRegistered: function () {},
  /**
   * Allows user to be alerted to any upgrades that are performed for a given
   * component type
   *
   * @param {string} jsClass The class name of the MDL component we wish
   * to hook into for any upgrades performed.
   * @param {function(!HTMLElement)} callback The function to call upon an
   * upgrade. This function should expect 1 parameter - the HTMLElement which
   * got upgraded.
   */
  registerUpgradedCallback: function (jsClass, callback) {},
  /**
   * Registers a class for future use and attempts to upgrade existing DOM.
   *
   * @param {componentHandler.ComponentConfigPublic} config the registration configuration
   */
  register: function (config) {},
  /**
   * Downgrade either a given node, an array of nodes, or a NodeList.
   *
   * @param {!Node|!Array<!Node>|!NodeList} nodes
   */
  downgradeElements: function (nodes) {}
};

componentHandler = function () {
  'use strict';

  /** @type {!Array<componentHandler.ComponentConfig>} */

  var registeredComponents_ = [];

  /** @type {!Array<componentHandler.Component>} */
  var createdComponents_ = [];

  var componentConfigProperty_ = 'mdlComponentConfigInternal_';

  /**
   * Searches registered components for a class we are interested in using.
   * Optionally replaces a match with passed object if specified.
   *
   * @param {string} name The name of a class we want to use.
   * @param {componentHandler.ComponentConfig=} optReplace Optional object to replace match with.
   * @return {!Object|boolean}
   * @private
   */
  function findRegisteredClass_(name, optReplace) {
    for (var i = 0; i < registeredComponents_.length; i++) {
      if (registeredComponents_[i].className === name) {
        if (typeof optReplace !== 'undefined') {
          registeredComponents_[i] = optReplace;
        }
        return registeredComponents_[i];
      }
    }
    return false;
  }

  /**
   * Returns an array of the classNames of the upgraded classes on the element.
   *
   * @param {!Element} element The element to fetch data from.
   * @return {!Array<string>}
   * @private
   */
  function getUpgradedListOfElement_(element) {
    var dataUpgraded = element.getAttribute('data-upgraded');
    // Use `['']` as default value to conform the `,name,name...` style.
    return dataUpgraded === null ? [''] : dataUpgraded.split(',');
  }

  /**
   * Returns true if the given element has already been upgraded for the given
   * class.
   *
   * @param {!Element} element The element we want to check.
   * @param {string} jsClass The class to check for.
   * @returns {boolean}
   * @private
   */
  function isElementUpgraded_(element, jsClass) {
    var upgradedList = getUpgradedListOfElement_(element);
    return upgradedList.indexOf(jsClass) !== -1;
  }

  /**
   * Create an event object.
   *
   * @param {string} eventType The type name of the event.
   * @param {boolean} bubbles Whether the event should bubble up the DOM.
   * @param {boolean} cancelable Whether the event can be canceled.
   * @returns {!Event}
   */
  function createEvent_(eventType, bubbles, cancelable) {
    if ('CustomEvent' in window && typeof window.CustomEvent === 'function') {
      return new CustomEvent(eventType, {
        bubbles: bubbles,
        cancelable: cancelable
      });
    } else {
      var ev = document.createEvent('Events');
      ev.initEvent(eventType, bubbles, cancelable);
      return ev;
    }
  }

  /**
   * Searches existing DOM for elements of our component type and upgrades them
   * if they have not already been upgraded.
   *
   * @param {string=} optJsClass the programatic name of the element class we
   * need to create a new instance of.
   * @param {string=} optCssClass the name of the CSS class elements of this
   * type will have.
   */
  function upgradeDomInternal(optJsClass, optCssClass) {
    if (typeof optJsClass === 'undefined' && typeof optCssClass === 'undefined') {
      for (var i = 0; i < registeredComponents_.length; i++) {
        upgradeDomInternal(registeredComponents_[i].className, registeredComponents_[i].cssClass);
      }
    } else {
      var jsClass = /** @type {string} */optJsClass;
      if (typeof optCssClass === 'undefined') {
        var registeredClass = findRegisteredClass_(jsClass);
        if (registeredClass) {
          optCssClass = registeredClass.cssClass;
        }
      }

      var elements = document.querySelectorAll('.' + optCssClass);
      for (var n = 0; n < elements.length; n++) {
        upgradeElementInternal(elements[n], jsClass);
      }
    }
  }

  /**
   * Upgrades a specific element rather than all in the DOM.
   *
   * @param {!Element} element The element we wish to upgrade.
   * @param {string=} optJsClass Optional name of the class we want to upgrade
   * the element to.
   */
  function upgradeElementInternal(element, optJsClass) {
    // Verify argument type.
    if (!(typeof element === 'object' && element instanceof Element)) {
      throw new Error('Invalid argument provided to upgrade MDL element.');
    }
    // Allow upgrade to be canceled by canceling emitted event.
    var upgradingEv = createEvent_('mdl-componentupgrading', true, true);
    element.dispatchEvent(upgradingEv);
    if (upgradingEv.defaultPrevented) {
      return;
    }

    var upgradedList = getUpgradedListOfElement_(element);
    var classesToUpgrade = [];
    // If jsClass is not provided scan the registered components to find the
    // ones matching the element's CSS classList.
    if (!optJsClass) {
      var classList = element.classList;
      registeredComponents_.forEach(function (component) {
        // Match CSS & Not to be upgraded & Not upgraded.
        if (classList.contains(component.cssClass) && classesToUpgrade.indexOf(component) === -1 && !isElementUpgraded_(element, component.className)) {
          classesToUpgrade.push(component);
        }
      });
    } else if (!isElementUpgraded_(element, optJsClass)) {
      classesToUpgrade.push(findRegisteredClass_(optJsClass));
    }

    // Upgrade the element for each classes.
    for (var i = 0, n = classesToUpgrade.length, registeredClass; i < n; i++) {
      registeredClass = classesToUpgrade[i];
      if (registeredClass) {
        // Mark element as upgraded.
        upgradedList.push(registeredClass.className);
        element.setAttribute('data-upgraded', upgradedList.join(','));
        var instance = new registeredClass.classConstructor(element);
        instance[componentConfigProperty_] = registeredClass;
        createdComponents_.push(instance);
        // Call any callbacks the user has registered with this component type.
        for (var j = 0, m = registeredClass.callbacks.length; j < m; j++) {
          registeredClass.callbacks[j](element);
        }

        if (registeredClass.widget) {
          // Assign per element instance for control over API
          element[registeredClass.className] = instance;
        }
      } else {
        throw new Error('Unable to find a registered component for the given class.');
      }

      var upgradedEv = createEvent_('mdl-componentupgraded', true, false);
      element.dispatchEvent(upgradedEv);
    }
  }

  /**
   * Upgrades a specific list of elements rather than all in the DOM.
   *
   * @param {!Element|!Array<!Element>|!NodeList|!HTMLCollection} elements
   * The elements we wish to upgrade.
   */
  function upgradeElementsInternal(elements) {
    if (!Array.isArray(elements)) {
      if (elements instanceof Element) {
        elements = [elements];
      } else {
        elements = Array.prototype.slice.call(elements);
      }
    }
    for (var i = 0, n = elements.length, element; i < n; i++) {
      element = elements[i];
      if (element instanceof HTMLElement) {
        upgradeElementInternal(element);
        if (element.children.length > 0) {
          upgradeElementsInternal(element.children);
        }
      }
    }
  }

  /**
   * Registers a class for future use and attempts to upgrade existing DOM.
   *
   * @param {componentHandler.ComponentConfigPublic} config
   */
  function registerInternal(config) {
    // In order to support both Closure-compiled and uncompiled code accessing
    // this method, we need to allow for both the dot and array syntax for
    // property access. You'll therefore see the `foo.bar || foo['bar']`
    // pattern repeated across this method.
    var widgetMissing = typeof config.widget === 'undefined' && typeof config['widget'] === 'undefined';
    var widget = true;

    if (!widgetMissing) {
      widget = config.widget || config['widget'];
    }

    var newConfig = /** @type {componentHandler.ComponentConfig} */{
      classConstructor: config.constructor || config['constructor'],
      className: config.classAsString || config['classAsString'],
      cssClass: config.cssClass || config['cssClass'],
      widget: widget,
      callbacks: []
    };

    registeredComponents_.forEach(function (item) {
      if (item.cssClass === newConfig.cssClass) {
        throw new Error('The provided cssClass has already been registered: ' + item.cssClass);
      }
      if (item.className === newConfig.className) {
        throw new Error('The provided className has already been registered');
      }
    });

    if (config.constructor.prototype.hasOwnProperty(componentConfigProperty_)) {
      throw new Error('MDL component classes must not have ' + componentConfigProperty_ + ' defined as a property.');
    }

    var found = findRegisteredClass_(config.classAsString, newConfig);

    if (!found) {
      registeredComponents_.push(newConfig);
    }
  }

  /**
   * Allows user to be alerted to any upgrades that are performed for a given
   * component type
   *
   * @param {string} jsClass The class name of the MDL component we wish
   * to hook into for any upgrades performed.
   * @param {function(!HTMLElement)} callback The function to call upon an
   * upgrade. This function should expect 1 parameter - the HTMLElement which
   * got upgraded.
   */
  function registerUpgradedCallbackInternal(jsClass, callback) {
    var regClass = findRegisteredClass_(jsClass);
    if (regClass) {
      regClass.callbacks.push(callback);
    }
  }

  /**
   * Upgrades all registered components found in the current DOM. This is
   * automatically called on window load.
   */
  function upgradeAllRegisteredInternal() {
    for (var n = 0; n < registeredComponents_.length; n++) {
      upgradeDomInternal(registeredComponents_[n].className);
    }
  }

  /**
   * Check the component for the downgrade method.
   * Execute if found.
   * Remove component from createdComponents list.
   *
   * @param {?componentHandler.Component} component
   */
  function deconstructComponentInternal(component) {
    if (component) {
      var componentIndex = createdComponents_.indexOf(component);
      createdComponents_.splice(componentIndex, 1);

      var upgrades = component.element_.getAttribute('data-upgraded').split(',');
      var componentPlace = upgrades.indexOf(component[componentConfigProperty_].classAsString);
      upgrades.splice(componentPlace, 1);
      component.element_.setAttribute('data-upgraded', upgrades.join(','));

      var ev = createEvent_('mdl-componentdowngraded', true, false);
      component.element_.dispatchEvent(ev);
    }
  }

  /**
   * Downgrade either a given node, an array of nodes, or a NodeList.
   *
   * @param {!Node|!Array<!Node>|!NodeList} nodes
   */
  function downgradeNodesInternal(nodes) {
    /**
     * Auxiliary function to downgrade a single node.
     * @param  {!Node} node the node to be downgraded
     */
    var downgradeNode = function (node) {
      createdComponents_.filter(function (item) {
        return item.element_ === node;
      }).forEach(deconstructComponentInternal);
    };
    if (nodes instanceof Array || nodes instanceof NodeList) {
      for (var n = 0; n < nodes.length; n++) {
        downgradeNode(nodes[n]);
      }
    } else if (nodes instanceof Node) {
      downgradeNode(nodes);
    } else {
      throw new Error('Invalid argument provided to downgrade MDL nodes.');
    }
  }

  // Now return the functions that should be made public with their publicly
  // facing names...
  return {
    upgradeDom: upgradeDomInternal,
    upgradeElement: upgradeElementInternal,
    upgradeElements: upgradeElementsInternal,
    upgradeAllRegistered: upgradeAllRegisteredInternal,
    registerUpgradedCallback: registerUpgradedCallbackInternal,
    register: registerInternal,
    downgradeElements: downgradeNodesInternal
  };
}();

/**
 * Describes the type of a registered component type managed by
 * componentHandler. Provided for benefit of the Closure compiler.
 *
 * @typedef {{
 *   constructor: Function,
 *   classAsString: string,
 *   cssClass: string,
 *   widget: (string|boolean|undefined)
 * }}
 */
componentHandler.ComponentConfigPublic; // jshint ignore:line

/**
 * Describes the type of a registered component type managed by
 * componentHandler. Provided for benefit of the Closure compiler.
 *
 * @typedef {{
 *   constructor: !Function,
 *   className: string,
 *   cssClass: string,
 *   widget: (string|boolean),
 *   callbacks: !Array<function(!HTMLElement)>
 * }}
 */
componentHandler.ComponentConfig; // jshint ignore:line

/**
 * Created component (i.e., upgraded element) type as managed by
 * componentHandler. Provided for benefit of the Closure compiler.
 *
 * @typedef {{
 *   element_: !HTMLElement,
 *   className: string,
 *   classAsString: string,
 *   cssClass: string,
 *   widget: string
 * }}
 */
componentHandler.Component; // jshint ignore:line

// Export all symbols, for the benefit of Closure compiler.
// No effect on uncompiled code.
componentHandler['upgradeDom'] = componentHandler.upgradeDom;
componentHandler['upgradeElement'] = componentHandler.upgradeElement;
componentHandler['upgradeElements'] = componentHandler.upgradeElements;
componentHandler['upgradeAllRegistered'] = componentHandler.upgradeAllRegistered;
componentHandler['registerUpgradedCallback'] = componentHandler.registerUpgradedCallback;
componentHandler['register'] = componentHandler.register;
componentHandler['downgradeElements'] = componentHandler.downgradeElements;
window.componentHandler = componentHandler;
window['componentHandler'] = componentHandler;

window.addEventListener('load', function () {
  'use strict';

  /**
   * Performs a "Cutting the mustard" test. If the browser supports the features
   * tested, adds a mdl-js class to the <html> element. It then upgrades all MDL
   * components requiring JavaScript.
   */

  if ('classList' in document.createElement('div') && 'querySelector' in document && 'addEventListener' in window && Array.prototype.forEach) {
    document.documentElement.classList.add('mdl-js');
    componentHandler.upgradeAllRegistered();
  } else {
    /**
     * Dummy function to avoid JS errors.
     */
    componentHandler.upgradeElement = function () {};
    /**
     * Dummy function to avoid JS errors.
     */
    componentHandler.register = function () {};
  }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1kbENvbXBvbmVudEhhbmRsZXIuanMiXSwibmFtZXMiOlsiY29tcG9uZW50SGFuZGxlciIsInVwZ3JhZGVEb20iLCJvcHRKc0NsYXNzIiwib3B0Q3NzQ2xhc3MiLCJ1cGdyYWRlRWxlbWVudCIsImVsZW1lbnQiLCJ1cGdyYWRlRWxlbWVudHMiLCJlbGVtZW50cyIsInVwZ3JhZGVBbGxSZWdpc3RlcmVkIiwicmVnaXN0ZXJVcGdyYWRlZENhbGxiYWNrIiwianNDbGFzcyIsImNhbGxiYWNrIiwicmVnaXN0ZXIiLCJjb25maWciLCJkb3duZ3JhZGVFbGVtZW50cyIsIm5vZGVzIiwicmVnaXN0ZXJlZENvbXBvbmVudHNfIiwiY3JlYXRlZENvbXBvbmVudHNfIiwiY29tcG9uZW50Q29uZmlnUHJvcGVydHlfIiwiZmluZFJlZ2lzdGVyZWRDbGFzc18iLCJuYW1lIiwib3B0UmVwbGFjZSIsImkiLCJsZW5ndGgiLCJjbGFzc05hbWUiLCJnZXRVcGdyYWRlZExpc3RPZkVsZW1lbnRfIiwiZGF0YVVwZ3JhZGVkIiwiZ2V0QXR0cmlidXRlIiwic3BsaXQiLCJpc0VsZW1lbnRVcGdyYWRlZF8iLCJ1cGdyYWRlZExpc3QiLCJpbmRleE9mIiwiY3JlYXRlRXZlbnRfIiwiZXZlbnRUeXBlIiwiYnViYmxlcyIsImNhbmNlbGFibGUiLCJ3aW5kb3ciLCJDdXN0b21FdmVudCIsImV2IiwiZG9jdW1lbnQiLCJjcmVhdGVFdmVudCIsImluaXRFdmVudCIsInVwZ3JhZGVEb21JbnRlcm5hbCIsImNzc0NsYXNzIiwicmVnaXN0ZXJlZENsYXNzIiwicXVlcnlTZWxlY3RvckFsbCIsIm4iLCJ1cGdyYWRlRWxlbWVudEludGVybmFsIiwiRWxlbWVudCIsIkVycm9yIiwidXBncmFkaW5nRXYiLCJkaXNwYXRjaEV2ZW50IiwiZGVmYXVsdFByZXZlbnRlZCIsImNsYXNzZXNUb1VwZ3JhZGUiLCJjbGFzc0xpc3QiLCJmb3JFYWNoIiwiY29tcG9uZW50IiwiY29udGFpbnMiLCJwdXNoIiwic2V0QXR0cmlidXRlIiwiam9pbiIsImluc3RhbmNlIiwiY2xhc3NDb25zdHJ1Y3RvciIsImoiLCJtIiwiY2FsbGJhY2tzIiwid2lkZ2V0IiwidXBncmFkZWRFdiIsInVwZ3JhZGVFbGVtZW50c0ludGVybmFsIiwiQXJyYXkiLCJpc0FycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJjYWxsIiwiSFRNTEVsZW1lbnQiLCJjaGlsZHJlbiIsInJlZ2lzdGVySW50ZXJuYWwiLCJ3aWRnZXRNaXNzaW5nIiwibmV3Q29uZmlnIiwiY29uc3RydWN0b3IiLCJjbGFzc0FzU3RyaW5nIiwiaXRlbSIsImhhc093blByb3BlcnR5IiwiZm91bmQiLCJyZWdpc3RlclVwZ3JhZGVkQ2FsbGJhY2tJbnRlcm5hbCIsInJlZ0NsYXNzIiwidXBncmFkZUFsbFJlZ2lzdGVyZWRJbnRlcm5hbCIsImRlY29uc3RydWN0Q29tcG9uZW50SW50ZXJuYWwiLCJjb21wb25lbnRJbmRleCIsInNwbGljZSIsInVwZ3JhZGVzIiwiZWxlbWVudF8iLCJjb21wb25lbnRQbGFjZSIsImRvd25ncmFkZU5vZGVzSW50ZXJuYWwiLCJkb3duZ3JhZGVOb2RlIiwibm9kZSIsImZpbHRlciIsIk5vZGVMaXN0IiwiTm9kZSIsIkNvbXBvbmVudENvbmZpZ1B1YmxpYyIsIkNvbXBvbmVudENvbmZpZyIsIkNvbXBvbmVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJjcmVhdGVFbGVtZW50IiwiZG9jdW1lbnRFbGVtZW50IiwiYWRkIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkE7Ozs7Ozs7QUFPQTs7QUFFQTtBQUNBO0FBQ0EsSUFBSUEsbUJBQW1CO0FBQ3JCOzs7Ozs7Ozs7QUFTQUMsY0FBWSxVQUFTQyxVQUFULEVBQXFCQyxXQUFyQixFQUFrQyxDQUFFLENBVjNCO0FBV3JCOzs7Ozs7O0FBT0FDLGtCQUFnQixVQUFTQyxPQUFULEVBQWtCSCxVQUFsQixFQUE4QixDQUFFLENBbEIzQjtBQW1CckI7Ozs7OztBQU1BSSxtQkFBaUIsVUFBU0Ms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RDtBQUNBSixpQkFBaUIsaUJBQWpCLElBQXNDQSxpQkFBaUJNLGVBQXZEO0FBQ0FOLGlCQUFpQixzQkFBakIsSUFDSUEsaUJBQWlCUSxvQkFEckI7QUFFQVIsaUJBQWlCLDBCQUFqQixJQUNJQSxpQkFBaUJTLHdCQURyQjtBQUVBVCxpQkFBaUIsVUFBakIsSUFBK0JBLGlCQUFpQlksUUFBaEQ7QUFDQVosaUJBQWlCLG1CQUFqQixJQUF3Q0EsaUJBQWlCYyxpQkFBekQ7QUFDQXNCLE9BQU9wQyxnQkFBUCxHQUEwQkEsZ0JBQTFCO0FBQ0FvQyxPQUFPLGtCQUFQLElBQTZCcEMsZ0JBQTdCOztBQUVBb0MsT0FBT2tFLGdCQUFQLENBQXdCLE1BQXhCLEVBQWdDLFlBQVc7QUFDekM7O0FBRUE7Ozs7OztBQUtBLE1BQUksZUFBZS9ELFNBQVNnRSxhQUFULENBQXVCLEtBQXZCLENBQWYsSUFDQSxtQkFBbUJoRSxRQURuQixJQUVBLHNCQUFzQkgsTUFGdEIsSUFFZ0NpQyxNQUFNRSxTQUFOLENBQWdCaEIsT0FGcEQsRUFFNkQ7QUFDM0RoQixhQUFTaUUsZUFBVCxDQUF5QmxELFNBQXpCLENBQW1DbUQsR0FBbkMsQ0FBdUMsUUFBdkM7QUFDQXpHLHFCQUFpQlEsb0JBQWpCO0FBQ0QsR0FMRCxNQUtPO0FBQ0w7OztBQUdBUixxQkFBaUJJLGNBQWpCLEdBQWtDLFlBQVcsQ0FBRSxDQUEvQztBQUNBOzs7QUFHQUoscUJBQWlCWSxRQUFqQixHQUE0QixZQUFXLENBQUUsQ0FBekM7QUFDRDtBQUNGLENBdkJEIiwiZmlsZSI6Im1kbENvbXBvbmVudEhhbmRsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNSBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoqXG4gKiBBIGNvbXBvbmVudCBoYW5kbGVyIGludGVyZmFjZSB1c2luZyB0aGUgcmV2ZWFsaW5nIG1vZHVsZSBkZXNpZ24gcGF0dGVybi5cbiAqIE1vcmUgZGV0YWlscyBvbiB0aGlzIGRlc2lnbiBwYXR0ZXJuIGhlcmU6XG4gKiBodHRwczovL2dpdGh1Yi5jb20vamFzb25tYXllcy9tZGwtY29tcG9uZW50LWRlc2lnbi1wYXR0ZXJuXG4gKlxuICogQGF1dGhvciBKYXNvbiBNYXllcy5cbiAqL1xuLyogZXhwb3J0ZWQgY29tcG9uZW50SGFuZGxlciAqL1xuXG4vLyBQcmUtZGVmaW5pbmcgdGhlIGNvbXBvbmVudEhhbmRsZXIgaW50ZXJmYWNlLCBmb3IgY2xvc3VyZSBkb2N1bWVudGF0aW9uIGFuZFxuLy8gc3RhdGljIHZlcmlmaWNhdGlvbi5cbnZhciBjb21wb25lbnRIYW5kbGVyID0ge1xuICAvKipcbiAgICogU2VhcmNoZXMgZXhpc3RpbmcgRE9NIGZvciBlbGVtZW50cyBvZiBvdXIgY29tcG9uZW50IHR5cGUgYW5kIHVwZ3JhZGVzIHRoZW1cbiAgICogaWYgdGhleSBoYXZlIG5vdCBhbHJlYWR5IGJlZW4gdXBncmFkZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gb3B0SnNDbGFzcyB0aGUgcHJvZ3JhbWF0aWMgbmFtZSBvZiB0aGUgZWxlbWVudCBjbGFzcyB3ZVxuICAgKiBuZWVkIHRvIGNyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZi5cbiAgICogQHBhcmFtIHtzdHJpbmc9fSBvcHRDc3NDbGFzcyB0aGUgbmFtZSBvZiB0aGUgQ1NTIGNsYXNzIGVsZW1lbnRzIG9mIHRoaXNcbiAgICogdHlwZSB3aWxsIGhhdmUuXG4gICAqL1xuICB1cGdyYWRlRG9tOiBmdW5jdGlvbihvcHRKc0NsYXNzLCBvcHRDc3NDbGFzcykge30sXG4gIC8qKlxuICAgKiBVcGdyYWRlcyBhIHNwZWNpZmljIGVsZW1lbnQgcmF0aGVyIHRoYW4gYWxsIGluIHRoZSBET00uXG4gICAqXG4gICAqIEBwYXJhbSB7IUVsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgd2Ugd2lzaCB0byB1cGdyYWRlLlxuICAgKiBAcGFyYW0ge3N0cmluZz19IG9wdEpzQ2xhc3MgT3B0aW9uYWwgbmFtZSBvZiB0aGUgY2xhc3Mgd2Ugd2FudCB0byB1cGdyYWRlXG4gICAqIHRoZSBlbGVtZW50IHRvLlxuICAgKi9cbiAgdXBncmFkZUVsZW1lbnQ6IGZ1bmN0aW9uKGVsZW1lbnQsIG9wdEpzQ2xhc3MpIHt9LFxuICAvKipcbiAgICogVXBncmFkZXMgYSBzcGVjaWZpYyBsaXN0IG9mIGVsZW1lbnRzIHJhdGhlciB0aGFuIGFsbCBpbiB0aGUgRE9NLlxuICAgKlxuICAgKiBAcGFyYW0geyFFbGVtZW50fCFBcnJheTwhRWxlbWVudD58IU5vZGVMaXN0fCFIVE1MQ29sbGVjdGlvbn0gZWxlbWVudHNcbiAgICogVGhlIGVsZW1lbnRzIHdlIHdpc2ggdG8gdXBncmFkZS5cbiAgICovXG4gIHVwZ3JhZGVFbGVtZW50czogZnVuY3Rpb24oZWxlbWVudHMpIHt9LFxuICAvKipcbiAgICogVXBncmFkZXMgYWxsIHJlZ2lzdGVyZWQgY29tcG9uZW50cyBmb3VuZCBpbiB0aGUgY3VycmVudCBET00uIFRoaXMgaXNcbiAgICogYXV0b21hdGljYWxseSBjYWxsZWQgb24gd2luZG93IGxvYWQuXG4gICAqL1xuICB1cGdyYWRlQWxsUmVnaXN0ZXJlZDogZnVuY3Rpb24oKSB7fSxcbiAgLyoqXG4gICAqIEFsbG93cyB1c2VyIHRvIGJlIGFsZXJ0ZWQgdG8gYW55IHVwZ3JhZGVzIHRoYXQgYXJlIHBlcmZvcm1lZCBmb3IgYSBnaXZlblxuICAgKiBjb21wb25lbnQgdHlwZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ganNDbGFzcyBUaGUgY2xhc3MgbmFtZSBvZiB0aGUgTURMIGNvbXBvbmVudCB3ZSB3aXNoXG4gICAqIHRvIGhvb2sgaW50byBmb3IgYW55IHVwZ3JhZGVzIHBlcmZvcm1lZC5cbiAgICogQHBhcmFtIHtmdW5jdGlvbighSFRNTEVsZW1lbnQpfSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gdG8gY2FsbCB1cG9uIGFuXG4gICAqIHVwZ3JhZGUuIFRoaXMgZnVuY3Rpb24gc2hvdWxkIGV4cGVjdCAxIHBhcmFtZXRlciAtIHRoZSBIVE1MRWxlbWVudCB3aGljaFxuICAgKiBnb3QgdXBncmFkZWQuXG4gICAqL1xuICByZWdpc3RlclVwZ3JhZGVkQ2FsbGJhY2s6IGZ1bmN0aW9uKGpzQ2xhc3MsIGNhbGxiYWNrKSB7fSxcbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNsYXNzIGZvciBmdXR1cmUgdXNlIGFuZCBhdHRlbXB0cyB0byB1cGdyYWRlIGV4aXN0aW5nIERPTS5cbiAgICpcbiAgICogQHBhcmFtIHtjb21wb25lbnRIYW5kbGVyLkNvbXBvbmVudENvbmZpZ1B1YmxpY30gY29uZmlnIHRoZSByZWdpc3RyYXRpb24gY29uZmlndXJhdGlvblxuICAgKi9cbiAgcmVnaXN0ZXI6IGZ1bmN0aW9uKGNvbmZpZykge30sXG4gIC8qKlxuICAgKiBEb3duZ3JhZGUgZWl0aGVyIGEgZ2l2ZW4gbm9kZSwgYW4gYXJyYXkgb2Ygbm9kZXMsIG9yIGEgTm9kZUxpc3QuXG4gICAqXG4gICAqIEBwYXJhbSB7IU5vZGV8IUFycmF5PCFOb2RlPnwhTm9kZUxpc3R9IG5vZGVzXG4gICAqL1xuICBkb3duZ3JhZGVFbGVtZW50czogZnVuY3Rpb24obm9kZXMpIHt9XG59O1xuXG5jb21wb25lbnRIYW5kbGVyID0gKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLyoqIEB0eXBlIHshQXJyYXk8Y29tcG9uZW50SGFuZGxlci5Db21wb25lbnRDb25maWc+fSAqL1xuICB2YXIgcmVnaXN0ZXJlZENvbXBvbmVudHNfID0gW107XG5cbiAgLyoqIEB0eXBlIHshQXJyYXk8Y29tcG9uZW50SGFuZGxlci5Db21wb25lbnQ+fSAqL1xuICB2YXIgY3JlYXRlZENvbXBvbmVudHNfID0gW107XG5cbiAgdmFyIGNvbXBvbmVudENvbmZpZ1Byb3BlcnR5XyA9ICdtZGxDb21wb25lbnRDb25maWdJbnRlcm5hbF8nO1xuXG4gIC8qKlxuICAgKiBTZWFyY2hlcyByZWdpc3RlcmVkIGNvbXBvbmVudHMgZm9yIGEgY2xhc3Mgd2UgYXJlIGludGVyZXN0ZWQgaW4gdXNpbmcuXG4gICAqIE9wdGlvbmFsbHkgcmVwbGFjZXMgYSBtYXRjaCB3aXRoIHBhc3NlZCBvYmplY3QgaWYgc3BlY2lmaWVkLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiBhIGNsYXNzIHdlIHdhbnQgdG8gdXNlLlxuICAgKiBAcGFyYW0ge2NvbXBvbmVudEhhbmRsZXIuQ29tcG9uZW50Q29uZmlnPX0gb3B0UmVwbGFjZSBPcHRpb25hbCBvYmplY3QgdG8gcmVwbGFjZSBtYXRjaCB3aXRoLlxuICAgKiBAcmV0dXJuIHshT2JqZWN0fGJvb2xlYW59XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBmdW5jdGlvbiBmaW5kUmVnaXN0ZXJlZENsYXNzXyhuYW1lLCBvcHRSZXBsYWNlKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZWdpc3RlcmVkQ29tcG9uZW50c18ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChyZWdpc3RlcmVkQ29tcG9uZW50c19baV0uY2xhc3NOYW1lID09PSBuYW1lKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb3B0UmVwbGFjZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICByZWdpc3RlcmVkQ29tcG9uZW50c19baV0gPSBvcHRSZXBsYWNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZWdpc3RlcmVkQ29tcG9uZW50c19baV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIHRoZSBjbGFzc05hbWVzIG9mIHRoZSB1cGdyYWRlZCBjbGFzc2VzIG9uIHRoZSBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0geyFFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIGZldGNoIGRhdGEgZnJvbS5cbiAgICogQHJldHVybiB7IUFycmF5PHN0cmluZz59XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBmdW5jdGlvbiBnZXRVcGdyYWRlZExpc3RPZkVsZW1lbnRfKGVsZW1lbnQpIHtcbiAgICB2YXIgZGF0YVVwZ3JhZGVkID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdXBncmFkZWQnKTtcbiAgICAvLyBVc2UgYFsnJ11gIGFzIGRlZmF1bHQgdmFsdWUgdG8gY29uZm9ybSB0aGUgYCxuYW1lLG5hbWUuLi5gIHN0eWxlLlxuICAgIHJldHVybiBkYXRhVXBncmFkZWQgPT09IG51bGwgPyBbJyddIDogZGF0YVVwZ3JhZGVkLnNwbGl0KCcsJyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBnaXZlbiBlbGVtZW50IGhhcyBhbHJlYWR5IGJlZW4gdXBncmFkZWQgZm9yIHRoZSBnaXZlblxuICAgKiBjbGFzcy5cbiAgICpcbiAgICogQHBhcmFtIHshRWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB3ZSB3YW50IHRvIGNoZWNrLlxuICAgKiBAcGFyYW0ge3N0cmluZ30ganNDbGFzcyBUaGUgY2xhc3MgdG8gY2hlY2sgZm9yLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGZ1bmN0aW9uIGlzRWxlbWVudFVwZ3JhZGVkXyhlbGVtZW50LCBqc0NsYXNzKSB7XG4gICAgdmFyIHVwZ3JhZGVkTGlzdCA9IGdldFVwZ3JhZGVkTGlzdE9mRWxlbWVudF8oZWxlbWVudCk7XG4gICAgcmV0dXJuIHVwZ3JhZGVkTGlzdC5pbmRleE9mKGpzQ2xhc3MpICE9PSAtMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gZXZlbnQgb2JqZWN0LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlIFRoZSB0eXBlIG5hbWUgb2YgdGhlIGV2ZW50LlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGJ1YmJsZXMgV2hldGhlciB0aGUgZXZlbnQgc2hvdWxkIGJ1YmJsZSB1cCB0aGUgRE9NLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNhbmNlbGFibGUgV2hldGhlciB0aGUgZXZlbnQgY2FuIGJlIGNhbmNlbGVkLlxuICAgKiBAcmV0dXJucyB7IUV2ZW50fVxuICAgKi9cbiAgZnVuY3Rpb24gY3JlYXRlRXZlbnRfKGV2ZW50VHlwZSwgYnViYmxlcywgY2FuY2VsYWJsZSkge1xuICAgIGlmICgnQ3VzdG9tRXZlbnQnIGluIHdpbmRvdyAmJiB0eXBlb2Ygd2luZG93LkN1c3RvbUV2ZW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gbmV3IEN1c3RvbUV2ZW50KGV2ZW50VHlwZSwge1xuICAgICAgICBidWJibGVzOiBidWJibGVzLFxuICAgICAgICBjYW5jZWxhYmxlOiBjYW5jZWxhYmxlXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGV2ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50cycpO1xuICAgICAgZXYuaW5pdEV2ZW50KGV2ZW50VHlwZSwgYnViYmxlcywgY2FuY2VsYWJsZSk7XG4gICAgICByZXR1cm4gZXY7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlYXJjaGVzIGV4aXN0aW5nIERPTSBmb3IgZWxlbWVudHMgb2Ygb3VyIGNvbXBvbmVudCB0eXBlIGFuZCB1cGdyYWRlcyB0aGVtXG4gICAqIGlmIHRoZXkgaGF2ZSBub3QgYWxyZWFkeSBiZWVuIHVwZ3JhZGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZz19IG9wdEpzQ2xhc3MgdGhlIHByb2dyYW1hdGljIG5hbWUgb2YgdGhlIGVsZW1lbnQgY2xhc3Mgd2VcbiAgICogbmVlZCB0byBjcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YuXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gb3B0Q3NzQ2xhc3MgdGhlIG5hbWUgb2YgdGhlIENTUyBjbGFzcyBlbGVtZW50cyBvZiB0aGlzXG4gICAqIHR5cGUgd2lsbCBoYXZlLlxuICAgKi9cbiAgZnVuY3Rpb24gdXBncmFkZURvbUludGVybmFsKG9wdEpzQ2xhc3MsIG9wdENzc0NsYXNzKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRKc0NsYXNzID09PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICB0eXBlb2Ygb3B0Q3NzQ2xhc3MgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlZ2lzdGVyZWRDb21wb25lbnRzXy5sZW5ndGg7IGkrKykge1xuICAgICAgICB1cGdyYWRlRG9tSW50ZXJuYWwocmVnaXN0ZXJlZENvbXBvbmVudHNfW2ldLmNsYXNzTmFtZSxcbiAgICAgICAgICAgIHJlZ2lzdGVyZWRDb21wb25lbnRzX1tpXS5jc3NDbGFzcyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBqc0NsYXNzID0gLyoqIEB0eXBlIHtzdHJpbmd9ICovIChvcHRKc0NsYXNzKTtcbiAgICAgIGlmICh0eXBlb2Ygb3B0Q3NzQ2xhc3MgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHZhciByZWdpc3RlcmVkQ2xhc3MgPSBmaW5kUmVnaXN0ZXJlZENsYXNzXyhqc0NsYXNzKTtcbiAgICAgICAgaWYgKHJlZ2lzdGVyZWRDbGFzcykge1xuICAgICAgICAgIG9wdENzc0NsYXNzID0gcmVnaXN0ZXJlZENsYXNzLmNzc0NsYXNzO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICsgb3B0Q3NzQ2xhc3MpO1xuICAgICAgZm9yICh2YXIgbiA9IDA7IG4gPCBlbGVtZW50cy5sZW5ndGg7IG4rKykge1xuICAgICAgICB1cGdyYWRlRWxlbWVudEludGVybmFsKGVsZW1lbnRzW25dLCBqc0NsYXNzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBncmFkZXMgYSBzcGVjaWZpYyBlbGVtZW50IHJhdGhlciB0aGFuIGFsbCBpbiB0aGUgRE9NLlxuICAgKlxuICAgKiBAcGFyYW0geyFFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHdlIHdpc2ggdG8gdXBncmFkZS5cbiAgICogQHBhcmFtIHtzdHJpbmc9fSBvcHRKc0NsYXNzIE9wdGlvbmFsIG5hbWUgb2YgdGhlIGNsYXNzIHdlIHdhbnQgdG8gdXBncmFkZVxuICAgKiB0aGUgZWxlbWVudCB0by5cbiAgICovXG4gIGZ1bmN0aW9uIHVwZ3JhZGVFbGVtZW50SW50ZXJuYWwoZWxlbWVudCwgb3B0SnNDbGFzcykge1xuICAgIC8vIFZlcmlmeSBhcmd1bWVudCB0eXBlLlxuICAgIGlmICghKHR5cGVvZiBlbGVtZW50ID09PSAnb2JqZWN0JyAmJiBlbGVtZW50IGluc3RhbmNlb2YgRWxlbWVudCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBhcmd1bWVudCBwcm92aWRlZCB0byB1cGdyYWRlIE1ETCBlbGVtZW50LicpO1xuICAgIH1cbiAgICAvLyBBbGxvdyB1cGdyYWRlIHRvIGJlIGNhbmNlbGVkIGJ5IGNhbmNlbGluZyBlbWl0dGVkIGV2ZW50LlxuICAgIHZhciB1cGdyYWRpbmdFdiA9IGNyZWF0ZUV2ZW50XygnbWRsLWNvbXBvbmVudHVwZ3JhZGluZycsIHRydWUsIHRydWUpO1xuICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudCh1cGdyYWRpbmdFdik7XG4gICAgaWYgKHVwZ3JhZGluZ0V2LmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgdXBncmFkZWRMaXN0ID0gZ2V0VXBncmFkZWRMaXN0T2ZFbGVtZW50XyhlbGVtZW50KTtcbiAgICB2YXIgY2xhc3Nlc1RvVXBncmFkZSA9IFtdO1xuICAgIC8vIElmIGpzQ2xhc3MgaXMgbm90IHByb3ZpZGVkIHNjYW4gdGhlIHJlZ2lzdGVyZWQgY29tcG9uZW50cyB0byBmaW5kIHRoZVxuICAgIC8vIG9uZXMgbWF0Y2hpbmcgdGhlIGVsZW1lbnQncyBDU1MgY2xhc3NMaXN0LlxuICAgIGlmICghb3B0SnNDbGFzcykge1xuICAgICAgdmFyIGNsYXNzTGlzdCA9IGVsZW1lbnQuY2xhc3NMaXN0O1xuICAgICAgcmVnaXN0ZXJlZENvbXBvbmVudHNfLmZvckVhY2goZnVuY3Rpb24oY29tcG9uZW50KSB7XG4gICAgICAgIC8vIE1hdGNoIENTUyAmIE5vdCB0byBiZSB1cGdyYWRlZCAmIE5vdCB1cGdyYWRlZC5cbiAgICAgICAgaWYgKGNsYXNzTGlzdC5jb250YWlucyhjb21wb25lbnQuY3NzQ2xhc3MpICYmXG4gICAgICAgICAgICBjbGFzc2VzVG9VcGdyYWRlLmluZGV4T2YoY29tcG9uZW50KSA9PT0gLTEgJiZcbiAgICAgICAgICAgICFpc0VsZW1lbnRVcGdyYWRlZF8oZWxlbWVudCwgY29tcG9uZW50LmNsYXNzTmFtZSkpIHtcbiAgICAgICAgICBjbGFzc2VzVG9VcGdyYWRlLnB1c2goY29tcG9uZW50KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICghaXNFbGVtZW50VXBncmFkZWRfKGVsZW1lbnQsIG9wdEpzQ2xhc3MpKSB7XG4gICAgICBjbGFzc2VzVG9VcGdyYWRlLnB1c2goZmluZFJlZ2lzdGVyZWRDbGFzc18ob3B0SnNDbGFzcykpO1xuICAgIH1cblxuICAgIC8vIFVwZ3JhZGUgdGhlIGVsZW1lbnQgZm9yIGVhY2ggY2xhc3Nlcy5cbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IGNsYXNzZXNUb1VwZ3JhZGUubGVuZ3RoLCByZWdpc3RlcmVkQ2xhc3M7IGkgPCBuOyBpKyspIHtcbiAgICAgIHJlZ2lzdGVyZWRDbGFzcyA9IGNsYXNzZXNUb1VwZ3JhZGVbaV07XG4gICAgICBpZiAocmVnaXN0ZXJlZENsYXNzKSB7XG4gICAgICAgIC8vIE1hcmsgZWxlbWVudCBhcyB1cGdyYWRlZC5cbiAgICAgICAgdXBncmFkZWRMaXN0LnB1c2gocmVnaXN0ZXJlZENsYXNzLmNsYXNzTmFtZSk7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLXVwZ3JhZGVkJywgdXBncmFkZWRMaXN0LmpvaW4oJywnKSk7XG4gICAgICAgIHZhciBpbnN0YW5jZSA9IG5ldyByZWdpc3RlcmVkQ2xhc3MuY2xhc3NDb25zdHJ1Y3RvcihlbGVtZW50KTtcbiAgICAgICAgaW5zdGFuY2VbY29tcG9uZW50Q29uZmlnUHJvcGVydHlfXSA9IHJlZ2lzdGVyZWRDbGFzcztcbiAgICAgICAgY3JlYXRlZENvbXBvbmVudHNfLnB1c2goaW5zdGFuY2UpO1xuICAgICAgICAvLyBDYWxsIGFueSBjYWxsYmFja3MgdGhlIHVzZXIgaGFzIHJlZ2lzdGVyZWQgd2l0aCB0aGlzIGNvbXBvbmVudCB0eXBlLlxuICAgICAgICBmb3IgKHZhciBqID0gMCwgbSA9IHJlZ2lzdGVyZWRDbGFzcy5jYWxsYmFja3MubGVuZ3RoOyBqIDwgbTsgaisrKSB7XG4gICAgICAgICAgcmVnaXN0ZXJlZENsYXNzLmNhbGxiYWNrc1tqXShlbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZWdpc3RlcmVkQ2xhc3Mud2lkZ2V0KSB7XG4gICAgICAgICAgLy8gQXNzaWduIHBlciBlbGVtZW50IGluc3RhbmNlIGZvciBjb250cm9sIG92ZXIgQVBJXG4gICAgICAgICAgZWxlbWVudFtyZWdpc3RlcmVkQ2xhc3MuY2xhc3NOYW1lXSA9IGluc3RhbmNlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ1VuYWJsZSB0byBmaW5kIGEgcmVnaXN0ZXJlZCBjb21wb25lbnQgZm9yIHRoZSBnaXZlbiBjbGFzcy4nKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHVwZ3JhZGVkRXYgPSBjcmVhdGVFdmVudF8oJ21kbC1jb21wb25lbnR1cGdyYWRlZCcsIHRydWUsIGZhbHNlKTtcbiAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudCh1cGdyYWRlZEV2KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBncmFkZXMgYSBzcGVjaWZpYyBsaXN0IG9mIGVsZW1lbnRzIHJhdGhlciB0aGFuIGFsbCBpbiB0aGUgRE9NLlxuICAgKlxuICAgKiBAcGFyYW0geyFFbGVtZW50fCFBcnJheTwhRWxlbWVudD58IU5vZGVMaXN0fCFIVE1MQ29sbGVjdGlvbn0gZWxlbWVudHNcbiAgICogVGhlIGVsZW1lbnRzIHdlIHdpc2ggdG8gdXBncmFkZS5cbiAgICovXG4gIGZ1bmN0aW9uIHVwZ3JhZGVFbGVtZW50c0ludGVybmFsKGVsZW1lbnRzKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGVsZW1lbnRzKSkge1xuICAgICAgaWYgKGVsZW1lbnRzIGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgICAgICBlbGVtZW50cyA9IFtlbGVtZW50c107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGVsZW1lbnRzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBlbGVtZW50cy5sZW5ndGgsIGVsZW1lbnQ7IGkgPCBuOyBpKyspIHtcbiAgICAgIGVsZW1lbnQgPSBlbGVtZW50c1tpXTtcbiAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgdXBncmFkZUVsZW1lbnRJbnRlcm5hbChlbGVtZW50KTtcbiAgICAgICAgaWYgKGVsZW1lbnQuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHVwZ3JhZGVFbGVtZW50c0ludGVybmFsKGVsZW1lbnQuY2hpbGRyZW4pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNsYXNzIGZvciBmdXR1cmUgdXNlIGFuZCBhdHRlbXB0cyB0byB1cGdyYWRlIGV4aXN0aW5nIERPTS5cbiAgICpcbiAgICogQHBhcmFtIHtjb21wb25lbnRIYW5kbGVyLkNvbXBvbmVudENvbmZpZ1B1YmxpY30gY29uZmlnXG4gICAqL1xuICBmdW5jdGlvbiByZWdpc3RlckludGVybmFsKGNvbmZpZykge1xuICAgIC8vIEluIG9yZGVyIHRvIHN1cHBvcnQgYm90aCBDbG9zdXJlLWNvbXBpbGVkIGFuZCB1bmNvbXBpbGVkIGNvZGUgYWNjZXNzaW5nXG4gICAgLy8gdGhpcyBtZXRob2QsIHdlIG5lZWQgdG8gYWxsb3cgZm9yIGJvdGggdGhlIGRvdCBhbmQgYXJyYXkgc3ludGF4IGZvclxuICAgIC8vIHByb3BlcnR5IGFjY2Vzcy4gWW91J2xsIHRoZXJlZm9yZSBzZWUgdGhlIGBmb28uYmFyIHx8IGZvb1snYmFyJ11gXG4gICAgLy8gcGF0dGVybiByZXBlYXRlZCBhY3Jvc3MgdGhpcyBtZXRob2QuXG4gICAgdmFyIHdpZGdldE1pc3NpbmcgPSAodHlwZW9mIGNvbmZpZy53aWRnZXQgPT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgIHR5cGVvZiBjb25maWdbJ3dpZGdldCddID09PSAndW5kZWZpbmVkJyk7XG4gICAgdmFyIHdpZGdldCA9IHRydWU7XG5cbiAgICBpZiAoIXdpZGdldE1pc3NpbmcpIHtcbiAgICAgIHdpZGdldCA9IGNvbmZpZy53aWRnZXQgfHwgY29uZmlnWyd3aWRnZXQnXTtcbiAgICB9XG5cbiAgICB2YXIgbmV3Q29uZmlnID0gLyoqIEB0eXBlIHtjb21wb25lbnRIYW5kbGVyLkNvbXBvbmVudENvbmZpZ30gKi8gKHtcbiAgICAgIGNsYXNzQ29uc3RydWN0b3I6IGNvbmZpZy5jb25zdHJ1Y3RvciB8fCBjb25maWdbJ2NvbnN0cnVjdG9yJ10sXG4gICAgICBjbGFzc05hbWU6IGNvbmZpZy5jbGFzc0FzU3RyaW5nIHx8IGNvbmZpZ1snY2xhc3NBc1N0cmluZyddLFxuICAgICAgY3NzQ2xhc3M6IGNvbmZpZy5jc3NDbGFzcyB8fCBjb25maWdbJ2Nzc0NsYXNzJ10sXG4gICAgICB3aWRnZXQ6IHdpZGdldCxcbiAgICAgIGNhbGxiYWNrczogW11cbiAgICB9KTtcblxuICAgIHJlZ2lzdGVyZWRDb21wb25lbnRzXy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIGlmIChpdGVtLmNzc0NsYXNzID09PSBuZXdDb25maWcuY3NzQ2xhc3MpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgcHJvdmlkZWQgY3NzQ2xhc3MgaGFzIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkOiAnICsgaXRlbS5jc3NDbGFzcyk7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbS5jbGFzc05hbWUgPT09IG5ld0NvbmZpZy5jbGFzc05hbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgcHJvdmlkZWQgY2xhc3NOYW1lIGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZCcpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGNvbmZpZy5jb25zdHJ1Y3Rvci5wcm90b3R5cGVcbiAgICAgICAgLmhhc093blByb3BlcnR5KGNvbXBvbmVudENvbmZpZ1Byb3BlcnR5XykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnTURMIGNvbXBvbmVudCBjbGFzc2VzIG11c3Qgbm90IGhhdmUgJyArIGNvbXBvbmVudENvbmZpZ1Byb3BlcnR5XyArXG4gICAgICAgICAgJyBkZWZpbmVkIGFzIGEgcHJvcGVydHkuJyk7XG4gICAgfVxuXG4gICAgdmFyIGZvdW5kID0gZmluZFJlZ2lzdGVyZWRDbGFzc18oY29uZmlnLmNsYXNzQXNTdHJpbmcsIG5ld0NvbmZpZyk7XG5cbiAgICBpZiAoIWZvdW5kKSB7XG4gICAgICByZWdpc3RlcmVkQ29tcG9uZW50c18ucHVzaChuZXdDb25maWcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvd3MgdXNlciB0byBiZSBhbGVydGVkIHRvIGFueSB1cGdyYWRlcyB0aGF0IGFyZSBwZXJmb3JtZWQgZm9yIGEgZ2l2ZW5cbiAgICogY29tcG9uZW50IHR5cGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGpzQ2xhc3MgVGhlIGNsYXNzIG5hbWUgb2YgdGhlIE1ETCBjb21wb25lbnQgd2Ugd2lzaFxuICAgKiB0byBob29rIGludG8gZm9yIGFueSB1cGdyYWRlcyBwZXJmb3JtZWQuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oIUhUTUxFbGVtZW50KX0gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uIHRvIGNhbGwgdXBvbiBhblxuICAgKiB1cGdyYWRlLiBUaGlzIGZ1bmN0aW9uIHNob3VsZCBleHBlY3QgMSBwYXJhbWV0ZXIgLSB0aGUgSFRNTEVsZW1lbnQgd2hpY2hcbiAgICogZ290IHVwZ3JhZGVkLlxuICAgKi9cbiAgZnVuY3Rpb24gcmVnaXN0ZXJVcGdyYWRlZENhbGxiYWNrSW50ZXJuYWwoanNDbGFzcywgY2FsbGJhY2spIHtcbiAgICB2YXIgcmVnQ2xhc3MgPSBmaW5kUmVnaXN0ZXJlZENsYXNzXyhqc0NsYXNzKTtcbiAgICBpZiAocmVnQ2xhc3MpIHtcbiAgICAgIHJlZ0NsYXNzLmNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBncmFkZXMgYWxsIHJlZ2lzdGVyZWQgY29tcG9uZW50cyBmb3VuZCBpbiB0aGUgY3VycmVudCBET00uIFRoaXMgaXNcbiAgICogYXV0b21hdGljYWxseSBjYWxsZWQgb24gd2luZG93IGxvYWQuXG4gICAqL1xuICBmdW5jdGlvbiB1cGdyYWRlQWxsUmVnaXN0ZXJlZEludGVybmFsKCkge1xuICAgIGZvciAodmFyIG4gPSAwOyBuIDwgcmVnaXN0ZXJlZENvbXBvbmVudHNfLmxlbmd0aDsgbisrKSB7XG4gICAgICB1cGdyYWRlRG9tSW50ZXJuYWwocmVnaXN0ZXJlZENvbXBvbmVudHNfW25dLmNsYXNzTmFtZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHRoZSBjb21wb25lbnQgZm9yIHRoZSBkb3duZ3JhZGUgbWV0aG9kLlxuICAgKiBFeGVjdXRlIGlmIGZvdW5kLlxuICAgKiBSZW1vdmUgY29tcG9uZW50IGZyb20gY3JlYXRlZENvbXBvbmVudHMgbGlzdC5cbiAgICpcbiAgICogQHBhcmFtIHs/Y29tcG9uZW50SGFuZGxlci5Db21wb25lbnR9IGNvbXBvbmVudFxuICAgKi9cbiAgZnVuY3Rpb24gZGVjb25zdHJ1Y3RDb21wb25lbnRJbnRlcm5hbChjb21wb25lbnQpIHtcbiAgICBpZiAoY29tcG9uZW50KSB7XG4gICAgICB2YXIgY29tcG9uZW50SW5kZXggPSBjcmVhdGVkQ29tcG9uZW50c18uaW5kZXhPZihjb21wb25lbnQpO1xuICAgICAgY3JlYXRlZENvbXBvbmVudHNfLnNwbGljZShjb21wb25lbnRJbmRleCwgMSk7XG5cbiAgICAgIHZhciB1cGdyYWRlcyA9IGNvbXBvbmVudC5lbGVtZW50Xy5nZXRBdHRyaWJ1dGUoJ2RhdGEtdXBncmFkZWQnKS5zcGxpdCgnLCcpO1xuICAgICAgdmFyIGNvbXBvbmVudFBsYWNlID0gdXBncmFkZXMuaW5kZXhPZihjb21wb25lbnRbY29tcG9uZW50Q29uZmlnUHJvcGVydHlfXS5jbGFzc0FzU3RyaW5nKTtcbiAgICAgIHVwZ3JhZGVzLnNwbGljZShjb21wb25lbnRQbGFjZSwgMSk7XG4gICAgICBjb21wb25lbnQuZWxlbWVudF8uc2V0QXR0cmlidXRlKCdkYXRhLXVwZ3JhZGVkJywgdXBncmFkZXMuam9pbignLCcpKTtcblxuICAgICAgdmFyIGV2ID0gY3JlYXRlRXZlbnRfKCdtZGwtY29tcG9uZW50ZG93bmdyYWRlZCcsIHRydWUsIGZhbHNlKTtcbiAgICAgIGNvbXBvbmVudC5lbGVtZW50Xy5kaXNwYXRjaEV2ZW50KGV2KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRG93bmdyYWRlIGVpdGhlciBhIGdpdmVuIG5vZGUsIGFuIGFycmF5IG9mIG5vZGVzLCBvciBhIE5vZGVMaXN0LlxuICAgKlxuICAgKiBAcGFyYW0geyFOb2RlfCFBcnJheTwhTm9kZT58IU5vZGVMaXN0fSBub2Rlc1xuICAgKi9cbiAgZnVuY3Rpb24gZG93bmdyYWRlTm9kZXNJbnRlcm5hbChub2Rlcykge1xuICAgIC8qKlxuICAgICAqIEF1eGlsaWFyeSBmdW5jdGlvbiB0byBkb3duZ3JhZGUgYSBzaW5nbGUgbm9kZS5cbiAgICAgKiBAcGFyYW0gIHshTm9kZX0gbm9kZSB0aGUgbm9kZSB0byBiZSBkb3duZ3JhZGVkXG4gICAgICovXG4gICAgdmFyIGRvd25ncmFkZU5vZGUgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgICBjcmVhdGVkQ29tcG9uZW50c18uZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW0uZWxlbWVudF8gPT09IG5vZGU7XG4gICAgICB9KS5mb3JFYWNoKGRlY29uc3RydWN0Q29tcG9uZW50SW50ZXJuYWwpO1xuICAgIH07XG4gICAgaWYgKG5vZGVzIGluc3RhbmNlb2YgQXJyYXkgfHwgbm9kZXMgaW5zdGFuY2VvZiBOb2RlTGlzdCkge1xuICAgICAgZm9yICh2YXIgbiA9IDA7IG4gPCBub2Rlcy5sZW5ndGg7IG4rKykge1xuICAgICAgICBkb3duZ3JhZGVOb2RlKG5vZGVzW25dKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG5vZGVzIGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgZG93bmdyYWRlTm9kZShub2Rlcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBhcmd1bWVudCBwcm92aWRlZCB0byBkb3duZ3JhZGUgTURMIG5vZGVzLicpO1xuICAgIH1cbiAgfVxuXG4gIC8vIE5vdyByZXR1cm4gdGhlIGZ1bmN0aW9ucyB0aGF0IHNob3VsZCBiZSBtYWRlIHB1YmxpYyB3aXRoIHRoZWlyIHB1YmxpY2x5XG4gIC8vIGZhY2luZyBuYW1lcy4uLlxuICByZXR1cm4ge1xuICAgIHVwZ3JhZGVEb206IHVwZ3JhZGVEb21JbnRlcm5hbCxcbiAgICB1cGdyYWRlRWxlbWVudDogdXBncmFkZUVsZW1lbnRJbnRlcm5hbCxcbiAgICB1cGdyYWRlRWxlbWVudHM6IHVwZ3JhZGVFbGVtZW50c0ludGVybmFsLFxuICAgIHVwZ3JhZGVBbGxSZWdpc3RlcmVkOiB1cGdyYWRlQWxsUmVnaXN0ZXJlZEludGVybmFsLFxuICAgIHJlZ2lzdGVyVXBncmFkZWRDYWxsYmFjazogcmVnaXN0ZXJVcGdyYWRlZENhbGxiYWNrSW50ZXJuYWwsXG4gICAgcmVnaXN0ZXI6IHJlZ2lzdGVySW50ZXJuYWwsXG4gICAgZG93bmdyYWRlRWxlbWVudHM6IGRvd25ncmFkZU5vZGVzSW50ZXJuYWxcbiAgfTtcbn0pKCk7XG5cbi8qKlxuICogRGVzY3JpYmVzIHRoZSB0eXBlIG9mIGEgcmVnaXN0ZXJlZCBjb21wb25lbnQgdHlwZSBtYW5hZ2VkIGJ5XG4gKiBjb21wb25lbnRIYW5kbGVyLiBQcm92aWRlZCBmb3IgYmVuZWZpdCBvZiB0aGUgQ2xvc3VyZSBjb21waWxlci5cbiAqXG4gKiBAdHlwZWRlZiB7e1xuICogICBjb25zdHJ1Y3RvcjogRnVuY3Rpb24sXG4gKiAgIGNsYXNzQXNTdHJpbmc6IHN0cmluZyxcbiAqICAgY3NzQ2xhc3M6IHN0cmluZyxcbiAqICAgd2lkZ2V0OiAoc3RyaW5nfGJvb2xlYW58dW5kZWZpbmVkKVxuICogfX1cbiAqL1xuY29tcG9uZW50SGFuZGxlci5Db21wb25lbnRDb25maWdQdWJsaWM7ICAvLyBqc2hpbnQgaWdub3JlOmxpbmVcblxuLyoqXG4gKiBEZXNjcmliZXMgdGhlIHR5cGUgb2YgYSByZWdpc3RlcmVkIGNvbXBvbmVudCB0eXBlIG1hbmFnZWQgYnlcbiAqIGNvbXBvbmVudEhhbmRsZXIuIFByb3ZpZGVkIGZvciBiZW5lZml0IG9mIHRoZSBDbG9zdXJlIGNvbXBpbGVyLlxuICpcbiAqIEB0eXBlZGVmIHt7XG4gKiAgIGNvbnN0cnVjdG9yOiAhRnVuY3Rpb24sXG4gKiAgIGNsYXNzTmFtZTogc3RyaW5nLFxuICogICBjc3NDbGFzczogc3RyaW5nLFxuICogICB3aWRnZXQ6IChzdHJpbmd8Ym9vbGVhbiksXG4gKiAgIGNhbGxiYWNrczogIUFycmF5PGZ1bmN0aW9uKCFIVE1MRWxlbWVudCk+XG4gKiB9fVxuICovXG5jb21wb25lbnRIYW5kbGVyLkNvbXBvbmVudENvbmZpZzsgIC8vIGpzaGludCBpZ25vcmU6bGluZVxuXG4vKipcbiAqIENyZWF0ZWQgY29tcG9uZW50IChpLmUuLCB1cGdyYWRlZCBlbGVtZW50KSB0eXBlIGFzIG1hbmFnZWQgYnlcbiAqIGNvbXBvbmVudEhhbmRsZXIuIFByb3ZpZGVkIGZvciBiZW5lZml0IG9mIHRoZSBDbG9zdXJlIGNvbXBpbGVyLlxuICpcbiAqIEB0eXBlZGVmIHt7XG4gKiAgIGVsZW1lbnRfOiAhSFRNTEVsZW1lbnQsXG4gKiAgIGNsYXNzTmFtZTogc3RyaW5nLFxuICogICBjbGFzc0FzU3RyaW5nOiBzdHJpbmcsXG4gKiAgIGNzc0NsYXNzOiBzdHJpbmcsXG4gKiAgIHdpZGdldDogc3RyaW5nXG4gKiB9fVxuICovXG5jb21wb25lbnRIYW5kbGVyLkNvbXBvbmVudDsgIC8vIGpzaGludCBpZ25vcmU6bGluZVxuXG4vLyBFeHBvcnQgYWxsIHN5bWJvbHMsIGZvciB0aGUgYmVuZWZpdCBvZiBDbG9zdXJlIGNvbXBpbGVyLlxuLy8gTm8gZWZmZWN0IG9uIHVuY29tcGlsZWQgY29kZS5cbmNvbXBvbmVudEhhbmRsZXJbJ3VwZ3JhZGVEb20nXSA9IGNvbXBvbmVudEhhbmRsZXIudXBncmFkZURvbTtcbmNvbXBvbmVudEhhbmRsZXJbJ3VwZ3JhZGVFbGVtZW50J10gPSBjb21wb25lbnRIYW5kbGVyLnVwZ3JhZGVFbGVtZW50O1xuY29tcG9uZW50SGFuZGxlclsndXBncmFkZUVsZW1lbnRzJ10gPSBjb21wb25lbnRIYW5kbGVyLnVwZ3JhZGVFbGVtZW50cztcbmNvbXBvbmVudEhhbmRsZXJbJ3VwZ3JhZGVBbGxSZWdpc3RlcmVkJ10gPVxuICAgIGNvbXBvbmVudEhhbmRsZXIudXBncmFkZUFsbFJlZ2lzdGVyZWQ7XG5jb21wb25lbnRIYW5kbGVyWydyZWdpc3RlclVwZ3JhZGVkQ2FsbGJhY2snXSA9XG4gICAgY29tcG9uZW50SGFuZGxlci5yZWdpc3RlclVwZ3JhZGVkQ2FsbGJhY2s7XG5jb21wb25lbnRIYW5kbGVyWydyZWdpc3RlciddID0gY29tcG9uZW50SGFuZGxlci5yZWdpc3RlcjtcbmNvbXBvbmVudEhhbmRsZXJbJ2Rvd25ncmFkZUVsZW1lbnRzJ10gPSBjb21wb25lbnRIYW5kbGVyLmRvd25ncmFkZUVsZW1lbnRzO1xud2luZG93LmNvbXBvbmVudEhhbmRsZXIgPSBjb21wb25lbnRIYW5kbGVyO1xud2luZG93Wydjb21wb25lbnRIYW5kbGVyJ10gPSBjb21wb25lbnRIYW5kbGVyO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLyoqXG4gICAqIFBlcmZvcm1zIGEgXCJDdXR0aW5nIHRoZSBtdXN0YXJkXCIgdGVzdC4gSWYgdGhlIGJyb3dzZXIgc3VwcG9ydHMgdGhlIGZlYXR1cmVzXG4gICAqIHRlc3RlZCwgYWRkcyBhIG1kbC1qcyBjbGFzcyB0byB0aGUgPGh0bWw+IGVsZW1lbnQuIEl0IHRoZW4gdXBncmFkZXMgYWxsIE1ETFxuICAgKiBjb21wb25lbnRzIHJlcXVpcmluZyBKYXZhU2NyaXB0LlxuICAgKi9cbiAgaWYgKCdjbGFzc0xpc3QnIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpICYmXG4gICAgICAncXVlcnlTZWxlY3RvcicgaW4gZG9jdW1lbnQgJiZcbiAgICAgICdhZGRFdmVudExpc3RlbmVyJyBpbiB3aW5kb3cgJiYgQXJyYXkucHJvdG90eXBlLmZvckVhY2gpIHtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWRsLWpzJyk7XG4gICAgY29tcG9uZW50SGFuZGxlci51cGdyYWRlQWxsUmVnaXN0ZXJlZCgpO1xuICB9IGVsc2Uge1xuICAgIC8qKlxuICAgICAqIER1bW15IGZ1bmN0aW9uIHRvIGF2b2lkIEpTIGVycm9ycy5cbiAgICAgKi9cbiAgICBjb21wb25lbnRIYW5kbGVyLnVwZ3JhZGVFbGVtZW50ID0gZnVuY3Rpb24oKSB7fTtcbiAgICAvKipcbiAgICAgKiBEdW1teSBmdW5jdGlvbiB0byBhdm9pZCBKUyBlcnJvcnMuXG4gICAgICovXG4gICAgY29tcG9uZW50SGFuZGxlci5yZWdpc3RlciA9IGZ1bmN0aW9uKCkge307XG4gIH1cbn0pO1xuIl19
