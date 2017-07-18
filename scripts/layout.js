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
   * Class constructor for Layout MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */

  var MaterialLayout = function MaterialLayout(element) {
    this.element_ = element;

    // Initialize instance.
    this.init();
  };
  window['MaterialLayout'] = MaterialLayout;

  /**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
  MaterialLayout.prototype.Constant_ = {
    MAX_WIDTH: '(max-width: 1024px)',
    TAB_SCROLL_PIXELS: 100,
    RESIZE_TIMEOUT: 100,

    MENU_ICON: '&#xE5D2;',
    CHEVRON_LEFT: 'chevron_left',
    CHEVRON_RIGHT: 'chevron_right'
  };

  /**
   * Keycodes, for code readability.
   *
   * @enum {number}
   * @private
   */
  MaterialLayout.prototype.Keycodes_ = {
    ENTER: 13,
    ESCAPE: 27,
    SPACE: 32
  };

  /**
   * Modes.
   *
   * @enum {number}
   * @private
   */
  MaterialLayout.prototype.Mode_ = {
    STANDARD: 0,
    SEAMED: 1,
    WATERFALL: 2,
    SCROLL: 3
  };

  /**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {string}
   * @private
   */
  MaterialLayout.prototype.CssClasses_ = {
    CONTAINER: 'mdl-layout__container',
    HEADER: 'mdl-layout__header',
    DRAWER: 'mdl-layout__drawer',
    CONTENT: 'mdl-layout__content',
    DRAWER_BTN: 'mdl-layout__drawer-button',

    ICON: 'material-icons',

    JS_RIPPLE_EFFECT: 'mdl-js-ripple-effect',
    RIPPLE_CONTAINER: 'mdl-layout__tab-ripple-container',
    RIPPLE: 'mdl-ripple',
    RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',

    HEADER_SEAMED: 'mdl-layout__header--seamed',
    HEADER_WATERFALL: 'mdl-layout__header--waterfall',
    HEADER_SCROLL: 'mdl-layout__header--scroll',

    FIXED_HEADER: 'mdl-layout--fixed-header',
    OBFUSCATOR: 'mdl-layout__obfuscator',

    TAB_BAR: 'mdl-layout__tab-bar',
    TAB_CONTAINER: 'mdl-layout__tab-bar-container',
    TAB: 'mdl-layout__tab',
    TAB_BAR_BUTTON: 'mdl-layout__tab-bar-button',
    TAB_BAR_LEFT_BUTTON: 'mdl-layout__tab-bar-left-button',
    TAB_BAR_RIGHT_BUTTON: 'mdl-layout__tab-bar-right-button',
    TAB_MANUAL_SWITCH: 'mdl-layout__tab-manual-switch',
    PANEL: 'mdl-layout__tab-panel',

    HAS_DRAWER: 'has-drawer',
    HAS_TABS: 'has-tabs',
    HAS_SCROLLING_HEADER: 'has-scrolling-header',
    CASTING_SHADOW: 'is-casting-shadow',
    IS_COMPACT: 'is-compact',
    IS_SMALL_SCREEN: 'is-small-screen',
    IS_DRAWER_OPEN: 'is-visible',
    IS_ACTIVE: 'is-active',
    IS_UPGRADED: 'is-upgraded',
    IS_ANIMATING: 'is-animating',

    ON_LARGE_SCREEN: 'mdl-layout--large-screen-only',
    ON_SMALL_SCREEN: 'mdl-layout--small-screen-only'

  };

  /**
   * Handles scrolling on the content.
   *
   * @private
   */
  MaterialLayout.prototype.contentScrollHandler_ = function () {
    if (this.header_.classList.contains(this.CssClasses_.IS_ANIMATING)) {
      return;
    }

    var headerVisible = !this.element_.classList.contains(this.CssClasses_.IS_SMALL_SCREEN) || this.element_.classList.contains(this.CssClasses_.FIXED_HEADER);

    if (this.content_.scrollTop > 0 && !this.header_.classList.contains(this.CssClasses_.IS_COMPACT)) {
      this.header_.classList.add(this.CssClasses_.CASTING_SHADOW);
      this.header_.classList.add(this.CssClasses_.IS_COMPACT);
      if (headerVisible) {
        this.header_.classList.add(this.CssClasses_.IS_ANIMATING);
      }
    } else if (this.content_.scrollTop <= 0 && this.header_.classList.contains(this.CssClasses_.IS_COMPACT)) {
      this.header_.classList.remove(this.CssClasses_.CASTING_SHADOW);
      this.header_.classList.remove(this.CssClasses_.IS_COMPACT);
      if (headerVisible) {
        this.header_.classList.add(this.CssClasses_.IS_ANIMATING);
      }
    }
  };

  /**
   * Handles a keyboard event on the drawer.
   *
   * @param {Event} evt The event that fired.
   * @private
   */
  MaterialLayout.prototype.keyboardEventHandler_ = function (evt) {
    // Only react when the drawer is open.
    if (evt.keyCode === this.Keycodes_.ESCAPE && this.drawer_.classList.contains(this.CssClasses_.IS_DRAWER_OPEN)) {
      this.toggleDrawer();
    }
  };

  /**
   * Handles changes in screen size.
   *
   * @private
   */
  MaterialLayout.prototype.screenSizeHandler_ = function () {
    if (this.screenSizeMediaQuery_.matches) {
      this.element_.classList.add(this.CssClasses_.IS_SMALL_SCREEN);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_SMALL_SCREEN);
      // Collapse drawer (if any) when moving to a large screen size.
      if (this.drawer_) {
        this.drawer_.classList.remove(this.CssClasses_.IS_DRAWER_OPEN);
        this.obfuscator_.classList.remove(this.CssClasses_.IS_DRAWER_OPEN);
      }
    }
  };

  /**
   * Handles events of drawer button.
   *
   * @param {Event} evt The event that fired.
   * @private
   */
  MaterialLayout.prototype.drawerToggleHandler_ = function (evt) {
    if (evt && evt.type === 'keydown') {
      if (evt.keyCode === this.Keycodes_.SPACE || evt.keyCode === this.Keycodes_.ENTER) {
        // prevent scrolling in drawer nav
        evt.preventDefault();
      } else {
        // prevent other keys
        return;
      }
    }

    this.toggleDrawer();
  };

  /**
   * Handles (un)setting the `is-animating` class
   *
   * @private
   */
  MaterialLayout.prototype.headerTransitionEndHandler_ = function () {
    this.header_.classList.remove(this.CssClasses_.IS_ANIMATING);
  };

  /**
   * Handles expanding the header on click
   *
   * @private
   */
  MaterialLayout.prototype.headerClickHandler_ = function () {
    if (this.header_.classList.contains(this.CssClasses_.IS_COMPACT)) {
      this.header_.classList.remove(this.CssClasses_.IS_COMPACT);
      this.header_.classList.add(this.CssClasses_.IS_ANIMATING);
    }
  };

  /**
   * Reset tab state, dropping active classes
   *
   * @private
   */
  MaterialLayout.prototype.resetTabState_ = function (tabBar) {
    for (var k = 0; k < tabBar.length; k++) {
      tabBar[k].classList.remove(this.CssClasses_.IS_ACTIVE);
    }
  };

  /**
   * Reset panel state, droping active classes
   *
   * @private
   */
  MaterialLayout.prototype.resetPanelState_ = function (panels) {
    for (var j = 0; j < panels.length; j++) {
      panels[j].classList.remove(this.CssClasses_.IS_ACTIVE);
    }
  };

  /**
  * Toggle drawer state
  *
  * @public
  */
  MaterialLayout.prototype.toggleDrawer = function () {
    var drawerButton = this.element_.querySelector('.' + this.CssClasses_.DRAWER_BTN);
    this.drawer_.classList.toggle(this.CssClasses_.IS_DRAWER_OPEN);
    this.obfuscator_.classList.toggle(this.CssClasses_.IS_DRAWER_OPEN);

    // Set accessibility properties.
    if (this.drawer_.classList.contains(this.CssClasses_.IS_DRAWER_OPEN)) {
      this.drawer_.setAttribute('aria-hidden', 'false');
      drawerButton.setAttribute('aria-expanded', 'true');
    } else {
      this.drawer_.setAttribute('aria-hidden', 'true');
      drawerButton.setAttribute('aria-expanded', 'false');
    }
  };
  MaterialLayout.prototype['toggleDrawer'] = MaterialLayout.prototype.toggleDrawer;

  /**
   * Initialize element.
   */
  MaterialLayout.prototype.init = function () {
    if (this.element_) {
      var container = document.createElement('div');
      container.classList.add(this.CssClasses_.CONTAINER);

      var focusedElement = this.element_.querySelector(':focus');

      this.element_.parentElement.insertBefore(container, this.element_);
      this.element_.parentElement.removeChild(this.element_);
      container.appendChild(this.element_);

      if (focusedElement) {
        focusedElement.focus();
      }

      var directChildren = this.element_.childNodes;
      var numChildren = directChildren.length;
      for (var c = 0; c < numChildren; c++) {
        var child = directChildren[c];
        if (child.classList && child.classList.contains(this.CssClasses_.HEADER)) {
          this.header_ = child;
        }

        if (child.classList && child.classList.contains(this.CssClasses_.DRAWER)) {
          this.drawer_ = child;
        }

        if (child.classList && child.classList.contains(this.CssClasses_.CONTENT)) {
          this.content_ = child;
        }
      }

      window.addEventListener('pageshow', function (e) {
        if (e.persisted) {
          // when page is loaded from back/forward cache
          // trigger repaint to let layout scroll in safari
          this.element_.style.overflowY = 'hidden';
          requestAnimationFrame(function () {
            this.element_.style.overflowY = '';
          }.bind(this));
        }
      }.bind(this), false);

      if (this.header_) {
        this.tabBar_ = this.header_.querySelector('.' + this.CssClasses_.TAB_BAR);
      }

      var mode = this.Mode_.STANDARD;

      if (this.header_) {
        if (this.header_.classList.contains(this.CssClasses_.HEADER_SEAMED)) {
          mode = this.Mode_.SEAMED;
        } else if (this.header_.classList.contains(this.CssClasses_.HEADER_WATERFALL)) {
          mode = this.Mode_.WATERFALL;
          this.header_.addEventListener('transitionend', this.headerTransitionEndHandler_.bind(this));
          this.header_.addEventListener('click', this.headerClickHandler_.bind(this));
        } else if (this.header_.classList.contains(this.CssClasses_.HEADER_SCROLL)) {
          mode = this.Mode_.SCROLL;
          container.classList.add(this.CssClasses_.HAS_SCROLLING_HEADER);
        }

        if (mode === this.Mode_.STANDARD) {
          this.header_.classList.add(this.CssClasses_.CASTING_SHADOW);
          if (this.tabBar_) {
            this.tabBar_.classList.add(this.CssClasses_.CASTING_SHADOW);
          }
        } else if (mode === this.Mode_.SEAMED || mode === this.Mode_.SCROLL) {
          this.header_.classList.remove(this.CssClasses_.CASTING_SHADOW);
          if (this.tabBar_) {
            this.tabBar_.classList.remove(this.CssClasses_.CASTING_SHADOW);
          }
        } else if (mode === this.Mode_.WATERFALL) {
          // Add and remove shadows depending on scroll position.
          // Also add/remove auxiliary class for styling of the compact version of
          // the header.
          this.content_.addEventListener('scroll', this.contentScrollHandler_.bind(this));
          this.contentScrollHandler_();
        }
      }

      // Add drawer toggling button to our layout, if we have an openable drawer.
      if (this.drawer_) {
        var drawerButton = this.element_.querySelector('.' + this.CssClasses_.DRAWER_BTN);
        if (!drawerButton) {
          drawerButton = document.createElement('div');
          drawerButton.setAttribute('aria-expanded', 'false');
          drawerButton.setAttribute('role', 'button');
          drawerButton.setAttribute('tabindex', '0');
          drawerButton.classList.add(this.CssClasses_.DRAWER_BTN);

          var drawerButtonIcon = document.createElement('i');
          drawerButtonIcon.classList.add(this.CssClasses_.ICON);
          drawerButtonIcon.innerHTML = this.Constant_.MENU_ICON;
          drawerButton.appendChild(drawerButtonIcon);
        }

        if (this.drawer_.classList.contains(this.CssClasses_.ON_LARGE_SCREEN)) {
          //If drawer has ON_LARGE_SCREEN class then add it to the drawer toggle button as well.
          drawerButton.classList.add(this.CssClasses_.ON_LARGE_SCREEN);
        } else if (this.drawer_.classList.contains(this.CssClasses_.ON_SMALL_SCREEN)) {
          //If drawer has ON_SMALL_SCREEN class then add it to the drawer toggle button as well.
          drawerButton.classList.add(this.CssClasses_.ON_SMALL_SCREEN);
        }

        drawerButton.addEventListener('click', this.drawerToggleHandler_.bind(this));

        drawerButton.addEventListener('keydown', this.drawerToggleHandler_.bind(this));

        // Add a class if the layout has a drawer, for altering the left padding.
        // Adds the HAS_DRAWER to the elements since this.header_ may or may
        // not be present.
        this.element_.classList.add(this.CssClasses_.HAS_DRAWER);

        // If we have a fixed header, add the button to the header rather than
        // the layout.
        if (this.element_.classList.contains(this.CssClasses_.FIXED_HEADER)) {
          this.header_.insertBefore(drawerButton, this.header_.firstChild);
        } else {
          this.element_.insertBefore(drawerButton, this.content_);
        }

        var obfuscator = document.createElement('div');
        obfuscator.classList.add(this.CssClasses_.OBFUSCATOR);
        this.element_.appendChild(obfuscator);
        obfuscator.addEventListener('click', this.drawerToggleHandler_.bind(this));
        this.obfuscator_ = obfuscator;

        this.drawer_.addEventListener('keydown', this.keyboardEventHandler_.bind(this));
        this.drawer_.setAttribute('aria-hidden', 'true');
      }

      // Keep an eye on screen size, and add/remove auxiliary class for styling
      // of small screens.
      this.screenSizeMediaQuery_ = window.matchMedia(
      /** @type {string} */this.Constant_.MAX_WIDTH);
      this.screenSizeMediaQuery_.addListener(this.screenSizeHandler_.bind(this));
      this.screenSizeHandler_();

      // Initialize tabs, if any.
      if (this.header_ && this.tabBar_) {
        this.element_.classList.add(this.CssClasses_.HAS_TABS);

        var tabContainer = document.createElement('div');
        tabContainer.classList.add(this.CssClasses_.TAB_CONTAINER);
        this.header_.insertBefore(tabContainer, this.tabBar_);
        this.header_.removeChild(this.tabBar_);

        var leftButton = document.createElement('div');
        leftButton.classList.add(this.CssClasses_.TAB_BAR_BUTTON);
        leftButton.classList.add(this.CssClasses_.TAB_BAR_LEFT_BUTTON);
        var leftButtonIcon = document.createElement('i');
        leftButtonIcon.classList.add(this.CssClasses_.ICON);
        leftButtonIcon.textContent = this.Constant_.CHEVRON_LEFT;
        leftButton.appendChild(leftButtonIcon);
        leftButton.addEventListener('click', function () {
          this.tabBar_.scrollLeft -= this.Constant_.TAB_SCROLL_PIXELS;
        }.bind(this));

        var rightButton = document.createElement('div');
        rightButton.classList.add(this.CssClasses_.TAB_BAR_BUTTON);
        rightButton.classList.add(this.CssClasses_.TAB_BAR_RIGHT_BUTTON);
        var rightButtonIcon = document.createElement('i');
        rightButtonIcon.classList.add(this.CssClasses_.ICON);
        rightButtonIcon.textContent = this.Constant_.CHEVRON_RIGHT;
        rightButton.appendChild(rightButtonIcon);
        rightButton.addEventListener('click', function () {
          this.tabBar_.scrollLeft += this.Constant_.TAB_SCROLL_PIXELS;
        }.bind(this));

        tabContainer.appendChild(leftButton);
        tabContainer.appendChild(this.tabBar_);
        tabContainer.appendChild(rightButton);

        // Add and remove tab buttons depending on scroll position and total
        // window size.
        var tabUpdateHandler = function () {
          if (this.tabBar_.scrollLeft > 0) {
            leftButton.classList.add(this.CssClasses_.IS_ACTIVE);
          } else {
            leftButton.classList.remove(this.CssClasses_.IS_ACTIVE);
          }

          if (this.tabBar_.scrollLeft < this.tabBar_.scrollWidth - this.tabBar_.offsetWidth) {
            rightButton.classList.add(this.CssClasses_.IS_ACTIVE);
          } else {
            rightButton.classList.remove(this.CssClasses_.IS_ACTIVE);
          }
        }.bind(this);

        this.tabBar_.addEventListener('scroll', tabUpdateHandler);
        tabUpdateHandler();

        // Update tabs when the window resizes.
        var windowResizeHandler = function () {
          // Use timeouts to make sure it doesn't happen too often.
          if (this.resizeTimeoutId_) {
            clearTimeout(this.resizeTimeoutId_);
          }
          this.resizeTimeoutId_ = setTimeout(function () {
            tabUpdateHandler();
            this.resizeTimeoutId_ = null;
          }.bind(this), /** @type {number} */this.Constant_.RESIZE_TIMEOUT);
        }.bind(this);

        window.addEventListener('resize', windowResizeHandler);

        if (this.tabBar_.classList.contains(this.CssClasses_.JS_RIPPLE_EFFECT)) {
          this.tabBar_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
        }

        // Select element tabs, document panels
        var tabs = this.tabBar_.querySelectorAll('.' + this.CssClasses_.TAB);
        var panels = this.content_.querySelectorAll('.' + this.CssClasses_.PANEL);

        // Create new tabs for each tab element
        for (var i = 0; i < tabs.length; i++) {
          new MaterialLayoutTab(tabs[i], tabs, panels, this);
        }
      }

      this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  };

  /**
   * Constructor for an individual tab.
   *
   * @constructor
   * @param {HTMLElement} tab The HTML element for the tab.
   * @param {!Array<HTMLElement>} tabs Array with HTML elements for all tabs.
   * @param {!Array<HTMLElement>} panels Array with HTML elements for all panels.
   * @param {MaterialLayout} layout The MaterialLayout object that owns the tab.
   */
  function MaterialLayoutTab(tab, tabs, panels, layout) {

    /**
     * Auxiliary method to programmatically select a tab in the UI.
     */
    function selectTab() {
      var href = tab.href.split('#')[1];
      var panel = layout.content_.querySelector('#' + href);
      layout.resetTabState_(tabs);
      layout.resetPanelState_(panels);
      tab.classList.add(layout.CssClasses_.IS_ACTIVE);
      panel.classList.add(layout.CssClasses_.IS_ACTIVE);
    }

    if (layout.tabBar_.classList.contains(layout.CssClasses_.JS_RIPPLE_EFFECT)) {
      var rippleContainer = document.createElement('span');
      rippleContainer.classList.add(layout.CssClasses_.RIPPLE_CONTAINER);
      rippleContainer.classList.add(layout.CssClasses_.JS_RIPPLE_EFFECT);
      var ripple = document.createElement('span');
      ripple.classList.add(layout.CssClasses_.RIPPLE);
      rippleContainer.appendChild(ripple);
      tab.appendChild(rippleContainer);
    }

    if (!layout.tabBar_.classList.contains(layout.CssClasses_.TAB_MANUAL_SWITCH)) {
      tab.addEventListener('click', function (e) {
        if (tab.getAttribute('href').charAt(0) === '#') {
          e.preventDefault();
          selectTab();
        }
      });
    }

    tab.show = selectTab;
  }
  window['MaterialLayoutTab'] = MaterialLayoutTab;

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: MaterialLayout,
    classAsString: 'MaterialLayout',
    cssClass: 'mdl-js-layout'
  });
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxheW91dC5qcyJdLCJuYW1lcyI6WyJNYXRlcmlhbExheW91dCIsImVsZW1lbnQiLCJlbGVtZW50XyIsImluaXQiLCJ3aW5kb3ciLCJwcm90b3R5cGUiLCJDb25zdGFudF8iLCJNQVhfV0lEVEgiLCJUQUJfU0NST0xMX1BJWEVMUyIsIlJFU0laRV9USU1FT1VUIiwiTUVOVV9JQ09OIiwiQ0hFVlJPTl9MRUZUIiwiQ0hFVlJPTl9SSUdIVCIsIktleWNvZGVzXyIsIkVOVEVSIiwiRVNDQVBFIiwiU1BBQ0UiLCJNb2RlXyIsIlNUQU5EQVJEIiwiU0VBTUVEIiwiV0FURVJGQUxMIiwiU0NST0xMIiwiQ3NzQ2xhc3Nlc18iLCJDT05UQUlORVIiLCJIRUFERVIiLCJEUkFXRVIiLCJDT05URU5UIiwiRFJBV0VSX0JUTiIsIklDT04iLCJKU19SSVBQTEVfRUZGRUNUIiwiUklQUExFX0NPTlRBSU5FUiIsIlJJUFBMRSIsIlJJUFBMRV9JR05PUkVfRVZFTlRTIiwiSEVBREVSX1NFQU1FRCIsIkhFQURFUl9XQVRFUkZBTEwiLCJIRUFERVJfU0NST0xMIiwiRklYRURfSEVBREVSIiwiT0JGVVNDQVRPUiIsIlRBQl9CQVIiLCJUQUJfQ09OVEFJTkVSIiwiVEFCIiwiVEFCX0JBUl9CVVRUT04iLCJUQUJfQkFSX0xFRlRfQlVUVE9OIiwiVEFCX0JBUl9SSUdIVF9CVVRUT04iLCJUQUJfTUFOVUFMX1NXSVRDSCIsIlBBTkVMIiwiSEFTX0RSQVdFUiIsIkhBU19UQUJTIiwiSEFTX1NDUk9MTElOR19IRUFERVIiLCJDQVNUSU5HX1NIQURPVyIsIklTX0NPTVBBQ1QiLCJJU19TTUFMTF9TQ1JFRU4iLCJJU19EUkFXRVJfT1BFTiIsIklTX0FDVElWRSIsIklTX1VQR1JBREVEIiwiSVNfQU5JTUFUSU5HIiwiT05fTEFSR0VfU0NSRUVOIiwiT05fU01BTExfU0NSRUVOIiwiY29udGVudFNjcm9sbEhhbmRsZXJfIiwiaGVhZGVyXyIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwiaGVhZGVyVmlzaWJsZSIsImNvbnRlbnRfIiwic2Nyb2xsVG9wIiwiYWRkIiwicmVtb3ZlIiwia2V5Ym9hcmRFdmVudEhhbmRsZXJfIiwiZXZ0Iiwia2V5Q29kZSIsImRyYXdlcl8iLCJ0b2dnbGVEcmF3ZXIiLCJzY3JlZW5TaXplSGFuZGxlcl8iLCJzY3JlZW5TaXplTWVkaWFRdWVyeV8iLCJtYXRjaGVzIiwib2JmdXNjYXRvcl8iLCJkcmF3ZXJUb2dnbGVIYW5kbGVyXyIsInR5cGUiLCJwcmV2ZW50RGVmYXVsdCIsImhlYWRlclRyYW5zaXRpb25FbmRIYW5kbGVyXyIsImhlYWRlckNsaWNrSGFuZGxlcl8iLCJyZXNldFRhYlN0YXRlXyIsInRhYkJhciIsImsiLCJsZW5ndGgiLCJyZXNldFBhbmVsU3RhdGVfIiwicGFuZWxzIiwiaiIsImRyYXdlckJ1dHRvbiIsInF1ZXJ5U2VsZWN0b3IiLCJ0b2dnbGUiLCJzZXRBdHRyaWJ1dGUiLCJjb250YWluZXIiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJmb2N1c2VkRWxlbWVudCIsInBhcmVudEVsZW1lbnQiLCJpbnNlcnRCZWZvcmUiLCJyZW1vdmVDaGlsZCIsImFwcGVuZENoaWxkIiwiZm9jdXMiLCJkaXJlY3RDaGlsZHJlbiIsImNoaWxkTm9kZXMiLCJudW1DaGlsZHJlbiIsImMiLCJjaGlsZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwicGVyc2lzdGVkIiwic3R5bGUiLCJvdmVyZmxvd1kiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJiaW5kIiwidGFiQmFyXyIsIm1vZGUiLCJkcmF3ZXJCdXR0b25JY29uIiwiaW5uZXJIVE1MIiwiZmlyc3RDaGlsZCIsIm9iZnVzY2F0b3IiLCJtYXRjaE1lZGlhIiwiYWRkTGlzdGVuZXIiLCJ0YWJDb250YWluZXIiLCJsZWZ0QnV0dG9uIiwibGVmdEJ1dHRvbkljb24iLCJ0ZXh0Q29udGVudCIsInNjcm9sbExlZnQiLCJyaWdodEJ1dHRvbiIsInJpZ2h0QnV0dG9uSWNvbiIsInRhYlVwZGF0ZUhhbmRsZXIiLCJzY3JvbGxXaWR0aCIsIm9mZnNldFdpZHRoIiwid2luZG93UmVzaXplSGFuZGxlciIsInJlc2l6ZVRpbWVvdXRJZF8iLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwidGFicyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJpIiwiTWF0ZXJpYWxMYXlvdXRUYWIiLCJ0YWIiLCJsYXlvdXQiLCJzZWxlY3RUYWIiLCJocmVmIiwic3BsaXQiLCJwYW5lbCIsInJpcHBsZUNvbnRhaW5lciIsInJpcHBsZSIsImdldEF0dHJpYnV0ZSIsImNoYXJBdCIsInNob3ciLCJjb21wb25lbnRIYW5kbGVyIiwicmVnaXN0ZXIiLCJjb25zdHJ1Y3RvciIsImNsYXNzQXNTdHJpbmciLCJjc3NDbGFzcyJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLENBQUMsWUFBVztBQUNWOztBQUVBOzs7Ozs7Ozs7QUFRQSxNQUFJQSxpQkFBaUIsU0FBU0EsY0FBVCxDQUF3QkMsT0FBeEIsRUFBaUM7QUFDcEQsU0FBS0MsUUFBTCxHQUFnQkQsT0FBaEI7O0FBRUE7QUFDQSxTQUFLRSxJQUFMO0FBQ0QsR0FMRDtBQU1BQyxTQUFPLGdCQUFQLElBQTJCSixjQUEzQjs7QUFFQTs7Ozs7O0FBTUFBLGlCQUFlSyxTQUFmLENBQXlCQyxTQUF6QixHQUFxQztBQUNuQ0MsZUFBVyxxQkFEd0I7QUFFbkNDLHVCQUFtQixHQUZnQjtBQUduQ0Msb0JBQWdCLEdBSG1COztBQUtuQ0MsZUFBVyxVQUx3QjtBQU1uQ0Msa0JBQWMsY0FOcUI7QUFPbkNDLG1CQUFlO0FBUG9CLEdBQXJDOztBQVVBOzs7Ozs7QUFNQVosaUJBQWVLLFNBQWYsQ0FBeUJRLFNBQXpCLEdBQXFDO0FBQ25DQyxXQUFPLEVBRDRCO0FBRW5DQyxZQUFRLEVBRjJCO0FBR25DQyxXQUFPO0FBSDRCLEdBQXJDOztBQU1BOzs7Ozs7QUFNQWhCLGlCQUFlSyxTQUFmLENBQXlCWSxLQUF6QixHQUFpQztBQUMvQkMsY0FBVSxDQURxQjtBQUUvQkMsWUFBUSxDQUZ1QjtBQUcvQkMs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LFdBQVAsQ0FBbUJzQixpQkFEaEIsQ0FBTCxFQUN5QztBQUN2QytGLFVBQUlqQyxnQkFBSixDQUFxQixPQUFyQixFQUE4QixVQUFTQyxDQUFULEVBQVk7QUFDeEMsWUFBSWdDLElBQUlRLFlBQUosQ0FBaUIsTUFBakIsRUFBeUJDLE1BQXpCLENBQWdDLENBQWhDLE1BQXVDLEdBQTNDLEVBQWdEO0FBQzlDekMsWUFBRTdCLGNBQUY7QUFDQStEO0FBQ0Q7QUFDRixPQUxEO0FBTUQ7O0FBRURGLFFBQUlVLElBQUosR0FBV1IsU0FBWDtBQUNEO0FBQ0R6SSxTQUFPLG1CQUFQLElBQThCc0ksaUJBQTlCOztBQUVBO0FBQ0E7QUFDQVksbUJBQWlCQyxRQUFqQixDQUEwQjtBQUN4QkMsaUJBQWF4SixjQURXO0FBRXhCeUosbUJBQWUsZ0JBRlM7QUFHeEJDLGNBQVU7QUFIYyxHQUExQjtBQUtELENBNWlCRCIsImZpbGUiOiJsYXlvdXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNSBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLyoqXG4gICAqIENsYXNzIGNvbnN0cnVjdG9yIGZvciBMYXlvdXQgTURMIGNvbXBvbmVudC5cbiAgICogSW1wbGVtZW50cyBNREwgY29tcG9uZW50IGRlc2lnbiBwYXR0ZXJuIGRlZmluZWQgYXQ6XG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9qYXNvbm1heWVzL21kbC1jb21wb25lbnQtZGVzaWduLXBhdHRlcm5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdGhhdCB3aWxsIGJlIHVwZ3JhZGVkLlxuICAgKi9cbiAgdmFyIE1hdGVyaWFsTGF5b3V0ID0gZnVuY3Rpb24gTWF0ZXJpYWxMYXlvdXQoZWxlbWVudCkge1xuICAgIHRoaXMuZWxlbWVudF8gPSBlbGVtZW50O1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBpbnN0YW5jZS5cbiAgICB0aGlzLmluaXQoKTtcbiAgfTtcbiAgd2luZG93WydNYXRlcmlhbExheW91dCddID0gTWF0ZXJpYWxMYXlvdXQ7XG5cbiAgLyoqXG4gICAqIFN0b3JlIGNvbnN0YW50cyBpbiBvbmUgcGxhY2Ugc28gdGhleSBjYW4gYmUgdXBkYXRlZCBlYXNpbHkuXG4gICAqXG4gICAqIEBlbnVtIHtzdHJpbmcgfCBudW1iZXJ9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbExheW91dC5wcm90b3R5cGUuQ29uc3RhbnRfID0ge1xuICAgIE1BWF9XSURUSDogJyhtYXgtd2lkdGg6IDEwMjRweCknLFxuICAgIFRBQl9TQ1JPTExfUElYRUxTOiAxMDAsXG4gICAgUkVTSVpFX1RJTUVPVVQ6IDEwMCxcblxuICAgIE1FTlVfSUNPTjogJyYjeEU1RDI7JyxcbiAgICBDSEVWUk9OX0xFRlQ6ICdjaGV2cm9uX2xlZnQnLFxuICAgIENIRVZST05fUklHSFQ6ICdjaGV2cm9uX3JpZ2h0J1xuICB9O1xuXG4gIC8qKlxuICAgKiBLZXljb2RlcywgZm9yIGNvZGUgcmVhZGFiaWxpdHkuXG4gICAqXG4gICAqIEBlbnVtIHtudW1iZXJ9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbExheW91dC5wcm90b3R5cGUuS2V5Y29kZXNfID0ge1xuICAgIEVOVEVSOiAxMyxcbiAgICBFU0NBUEU6IDI3LFxuICAgIFNQQUNFOiAzMlxuICB9O1xuXG4gIC8qKlxuICAgKiBNb2Rlcy5cbiAgICpcbiAgICogQGVudW0ge251bWJlcn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsTGF5b3V0LnByb3RvdHlwZS5Nb2RlXyA9IHtcbiAgICBTVEFOREFSRDogMCxcbiAgICBTRUFNRUQ6IDEsXG4gICAgV0FURVJGQUxMOiAyLFxuICAgIFNDUk9MTDogM1xuICB9O1xuXG4gIC8qKlxuICAgKiBTdG9yZSBzdHJpbmdzIGZvciBjbGFzcyBuYW1lcyBkZWZpbmVkIGJ5IHRoaXMgY29tcG9uZW50IHRoYXQgYXJlIHVzZWQgaW5cbiAgICogSmF2YVNjcmlwdC4gVGhpcyBhbGxvd3MgdXMgdG8gc2ltcGx5IGNoYW5nZSBpdCBpbiBvbmUgcGxhY2Ugc2hvdWxkIHdlXG4gICAqIGRlY2lkZSB0byBtb2RpZnkgYXQgYSBsYXRlciBkYXRlLlxuICAgKlxuICAgKiBAZW51bSB7c3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxMYXlvdXQucHJvdG90eXBlLkNzc0NsYXNzZXNfID0ge1xuICAgIENPTlRBSU5FUjogJ21kbC1sYXlvdXRfX2NvbnRhaW5lcicsXG4gICAgSEVBREVSOiAnbWRsLWxheW91dF9faGVhZGVyJyxcbiAgICBEUkFXRVI6ICdtZGwtbGF5b3V0X19kcmF3ZXInLFxuICAgIENPTlRFTlQ6ICdtZGwtbGF5b3V0X19jb250ZW50JyxcbiAgICBEUkFXRVJfQlROOiAnbWRsLWxheW91dF9fZHJhd2VyLWJ1dHRvbicsXG5cbiAgICBJQ09OOiAnbWF0ZXJpYWwtaWNvbnMnLFxuXG4gICAgSlNfUklQUExFX0VGRkVDVDogJ21kbC1qcy1yaXBwbGUtZWZmZWN0JyxcbiAgICBSSVBQTEVfQ09OVEFJTkVSOiAnbWRsLWxheW91dF9fdGFiLXJpcHBsZS1jb250YWluZXInLFxuICAgIFJJUFBMRTogJ21kbC1yaXBwbGUnLFxuICAgIFJJUFBMRV9JR05PUkVfRVZFTlRTOiAnbWRsLWpzLXJpcHBsZS1lZmZlY3QtLWlnbm9yZS1ldmVudHMnLFxuXG4gICAgSEVBREVSX1NFQU1FRDogJ21kbC1sYXlvdXRfX2hlYWRlci0tc2VhbWVkJyxcbiAgICBIRUFERVJfV0FURVJGQUxMOiAnbWRsLWxheW91dF9faGVhZGVyLS13YXRlcmZhbGwnLFxuICAgIEhFQURFUl9TQ1JPTEw6ICdtZGwtbGF5b3V0X19oZWFkZXItLXNjcm9sbCcsXG5cbiAgICBGSVhFRF9IRUFERVI6ICdtZGwtbGF5b3V0LS1maXhlZC1oZWFkZXInLFxuICAgIE9CRlVTQ0FUT1I6ICdtZGwtbGF5b3V0X19vYmZ1c2NhdG9yJyxcblxuICAgIFRBQl9CQVI6ICdtZGwtbGF5b3V0X190YWItYmFyJyxcbiAgICBUQUJfQ09OVEFJTkVSOiAnbWRsLWxheW91dF9fdGFiLWJhci1jb250YWluZXInLFxuICAgIFRBQjogJ21kbC1sYXlvdXRfX3RhYicsXG4gICAgVEFCX0JBUl9CVVRUT046ICdtZGwtbGF5b3V0X190YWItYmFyLWJ1dHRvbicsXG4gICAgVEFCX0JBUl9MRUZUX0JVVFRPTjogJ21kbC1sYXlvdXRfX3RhYi1iYXItbGVmdC1idXR0b24nLFxuICAgIFRBQl9CQVJfUklHSFRfQlVUVE9OOiAnbWRsLWxheW91dF9fdGFiLWJhci1yaWdodC1idXR0b24nLFxuICAgIFRBQl9NQU5VQUxfU1dJVENIOiAnbWRsLWxheW91dF9fdGFiLW1hbnVhbC1zd2l0Y2gnLFxuICAgIFBBTkVMOiAnbWRsLWxheW91dF9fdGFiLXBhbmVsJyxcblxuICAgIEhBU19EUkFXRVI6ICdoYXMtZHJhd2VyJyxcbiAgICBIQVNfVEFCUzogJ2hhcy10YWJzJyxcbiAgICBIQVNfU0NST0xMSU5HX0hFQURFUjogJ2hhcy1zY3JvbGxpbmctaGVhZGVyJyxcbiAgICBDQVNUSU5HX1NIQURPVzogJ2lzLWNhc3Rpbmctc2hhZG93JyxcbiAgICBJU19DT01QQUNUOiAnaXMtY29tcGFjdCcsXG4gICAgSVNfU01BTExfU0NSRUVOOiAnaXMtc21hbGwtc2NyZWVuJyxcbiAgICBJU19EUkFXRVJfT1BFTjogJ2lzLXZpc2libGUnLFxuICAgIElTX0FDVElWRTogJ2lzLWFjdGl2ZScsXG4gICAgSVNfVVBHUkFERUQ6ICdpcy11cGdyYWRlZCcsXG4gICAgSVNfQU5JTUFUSU5HOiAnaXMtYW5pbWF0aW5nJyxcblxuICAgIE9OX0xBUkdFX1NDUkVFTjogJ21kbC1sYXlvdXQtLWxhcmdlLXNjcmVlbi1vbmx5JyxcbiAgICBPTl9TTUFMTF9TQ1JFRU46ICdtZGwtbGF5b3V0LS1zbWFsbC1zY3JlZW4tb25seSdcblxuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGVzIHNjcm9sbGluZyBvbiB0aGUgY29udGVudC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsTGF5b3V0LnByb3RvdHlwZS5jb250ZW50U2Nyb2xsSGFuZGxlcl8gPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5oZWFkZXJfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLklTX0FOSU1BVElORykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgaGVhZGVyVmlzaWJsZSA9XG4gICAgICAgICF0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLklTX1NNQUxMX1NDUkVFTikgfHxcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5GSVhFRF9IRUFERVIpO1xuXG4gICAgaWYgKHRoaXMuY29udGVudF8uc2Nyb2xsVG9wID4gMCAmJlxuICAgICAgICAhdGhpcy5oZWFkZXJfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLklTX0NPTVBBQ1QpKSB7XG4gICAgICB0aGlzLmhlYWRlcl8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLkNBU1RJTkdfU0hBRE9XKTtcbiAgICAgIHRoaXMuaGVhZGVyXy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfQ09NUEFDVCk7XG4gICAgICBpZiAoaGVhZGVyVmlzaWJsZSkge1xuICAgICAgICB0aGlzLmhlYWRlcl8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklTX0FOSU1BVElORyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLmNvbnRlbnRfLnNjcm9sbFRvcCA8PSAwICYmXG4gICAgICAgIHRoaXMuaGVhZGVyXy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5JU19DT01QQUNUKSkge1xuICAgICAgdGhpcy5oZWFkZXJfLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5Dc3NDbGFzc2VzXy5DQVNUSU5HX1NIQURPVyk7XG4gICAgICB0aGlzLmhlYWRlcl8uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkNzc0NsYXNzZXNfLklTX0NPTVBBQ1QpO1xuICAgICAgaWYgKGhlYWRlclZpc2libGUpIHtcbiAgICAgICAgdGhpcy5oZWFkZXJfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JU19BTklNQVRJTkcpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlcyBhIGtleWJvYXJkIGV2ZW50IG9uIHRoZSBkcmF3ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2dCBUaGUgZXZlbnQgdGhhdCBmaXJlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsTGF5b3V0LnByb3RvdHlwZS5rZXlib2FyZEV2ZW50SGFuZGxlcl8gPSBmdW5jdGlvbihldnQpIHtcbiAgICAvLyBPbmx5IHJlYWN0IHdoZW4gdGhlIGRyYXdlciBpcyBvcGVuLlxuICAgIGlmIChldnQua2V5Q29kZSA9PT0gdGhpcy5LZXljb2Rlc18uRVNDQVBFICYmXG4gICAgICAgIHRoaXMuZHJhd2VyXy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5JU19EUkFXRVJfT1BFTikpIHtcbiAgICAgIHRoaXMudG9nZ2xlRHJhd2VyKCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGVzIGNoYW5nZXMgaW4gc2NyZWVuIHNpemUuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbExheW91dC5wcm90b3R5cGUuc2NyZWVuU2l6ZUhhbmRsZXJfID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuc2NyZWVuU2l6ZU1lZGlhUXVlcnlfLm1hdGNoZXMpIHtcbiAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklTX1NNQUxMX1NDUkVFTik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkNzc0NsYXNzZXNfLklTX1NNQUxMX1NDUkVFTik7XG4gICAgICAvLyBDb2xsYXBzZSBkcmF3ZXIgKGlmIGFueSkgd2hlbiBtb3ZpbmcgdG8gYSBsYXJnZSBzY3JlZW4gc2l6ZS5cbiAgICAgIGlmICh0aGlzLmRyYXdlcl8pIHtcbiAgICAgICAgdGhpcy5kcmF3ZXJfLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5Dc3NDbGFzc2VzXy5JU19EUkFXRVJfT1BFTik7XG4gICAgICAgIHRoaXMub2JmdXNjYXRvcl8uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkNzc0NsYXNzZXNfLklTX0RSQVdFUl9PUEVOKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgZXZlbnRzIG9mIGRyYXdlciBidXR0b24uXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2dCBUaGUgZXZlbnQgdGhhdCBmaXJlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsTGF5b3V0LnByb3RvdHlwZS5kcmF3ZXJUb2dnbGVIYW5kbGVyXyA9IGZ1bmN0aW9uKGV2dCkge1xuICAgIGlmIChldnQgJiYgKGV2dC50eXBlID09PSAna2V5ZG93bicpKSB7XG4gICAgICBpZiAoZXZ0LmtleUNvZGUgPT09IHRoaXMuS2V5Y29kZXNfLlNQQUNFIHx8IGV2dC5rZXlDb2RlID09PSB0aGlzLktleWNvZGVzXy5FTlRFUikge1xuICAgICAgICAvLyBwcmV2ZW50IHNjcm9sbGluZyBpbiBkcmF3ZXIgbmF2XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gcHJldmVudCBvdGhlciBrZXlzXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnRvZ2dsZURyYXdlcigpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGVzICh1bilzZXR0aW5nIHRoZSBgaXMtYW5pbWF0aW5nYCBjbGFzc1xuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxMYXlvdXQucHJvdG90eXBlLmhlYWRlclRyYW5zaXRpb25FbmRIYW5kbGVyXyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaGVhZGVyXy5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfQU5JTUFUSU5HKTtcbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlcyBleHBhbmRpbmcgdGhlIGhlYWRlciBvbiBjbGlja1xuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxMYXlvdXQucHJvdG90eXBlLmhlYWRlckNsaWNrSGFuZGxlcl8gPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5oZWFkZXJfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLklTX0NPTVBBQ1QpKSB7XG4gICAgICB0aGlzLmhlYWRlcl8uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkNzc0NsYXNzZXNfLklTX0NPTVBBQ1QpO1xuICAgICAgdGhpcy5oZWFkZXJfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JU19BTklNQVRJTkcpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogUmVzZXQgdGFiIHN0YXRlLCBkcm9wcGluZyBhY3RpdmUgY2xhc3Nlc1xuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxMYXlvdXQucHJvdG90eXBlLnJlc2V0VGFiU3RhdGVfID0gZnVuY3Rpb24odGFiQmFyKSB7XG4gICAgZm9yICh2YXIgayA9IDA7IGsgPCB0YWJCYXIubGVuZ3RoOyBrKyspIHtcbiAgICAgIHRhYkJhcltrXS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfQUNUSVZFKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlc2V0IHBhbmVsIHN0YXRlLCBkcm9waW5nIGFjdGl2ZSBjbGFzc2VzXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbExheW91dC5wcm90b3R5cGUucmVzZXRQYW5lbFN0YXRlXyA9IGZ1bmN0aW9uKHBhbmVscykge1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgcGFuZWxzLmxlbmd0aDsgaisrKSB7XG4gICAgICBwYW5lbHNbal0uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkNzc0NsYXNzZXNfLklTX0FDVElWRSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAqIFRvZ2dsZSBkcmF3ZXIgc3RhdGVcbiAgKlxuICAqIEBwdWJsaWNcbiAgKi9cbiAgTWF0ZXJpYWxMYXlvdXQucHJvdG90eXBlLnRvZ2dsZURyYXdlciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkcmF3ZXJCdXR0b24gPSB0aGlzLmVsZW1lbnRfLnF1ZXJ5U2VsZWN0b3IoJy4nICsgdGhpcy5Dc3NDbGFzc2VzXy5EUkFXRVJfQlROKTtcbiAgICB0aGlzLmRyYXdlcl8uY2xhc3NMaXN0LnRvZ2dsZSh0aGlzLkNzc0NsYXNzZXNfLklTX0RSQVdFUl9PUEVOKTtcbiAgICB0aGlzLm9iZnVzY2F0b3JfLmNsYXNzTGlzdC50b2dnbGUodGhpcy5Dc3NDbGFzc2VzXy5JU19EUkFXRVJfT1BFTik7XG5cbiAgICAvLyBTZXQgYWNjZXNzaWJpbGl0eSBwcm9wZXJ0aWVzLlxuICAgIGlmICh0aGlzLmRyYXdlcl8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfRFJBV0VSX09QRU4pKSB7XG4gICAgICB0aGlzLmRyYXdlcl8uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuICAgICAgZHJhd2VyQnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZHJhd2VyXy5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgIGRyYXdlckJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICB9XG4gIH07XG4gIE1hdGVyaWFsTGF5b3V0LnByb3RvdHlwZVsndG9nZ2xlRHJhd2VyJ10gPVxuICAgICAgTWF0ZXJpYWxMYXlvdXQucHJvdG90eXBlLnRvZ2dsZURyYXdlcjtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBlbGVtZW50LlxuICAgKi9cbiAgTWF0ZXJpYWxMYXlvdXQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5lbGVtZW50Xykge1xuICAgICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5DT05UQUlORVIpO1xuXG4gICAgICB2YXIgZm9jdXNlZEVsZW1lbnQgPSB0aGlzLmVsZW1lbnRfLnF1ZXJ5U2VsZWN0b3IoJzpmb2N1cycpO1xuXG4gICAgICB0aGlzLmVsZW1lbnRfLnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGNvbnRhaW5lciwgdGhpcy5lbGVtZW50Xyk7XG4gICAgICB0aGlzLmVsZW1lbnRfLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50Xyk7XG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5lbGVtZW50Xyk7XG5cbiAgICAgIGlmIChmb2N1c2VkRWxlbWVudCkge1xuICAgICAgICBmb2N1c2VkRWxlbWVudC5mb2N1cygpO1xuICAgICAgfVxuXG4gICAgICB2YXIgZGlyZWN0Q2hpbGRyZW4gPSB0aGlzLmVsZW1lbnRfLmNoaWxkTm9kZXM7XG4gICAgICB2YXIgbnVtQ2hpbGRyZW4gPSBkaXJlY3RDaGlsZHJlbi5sZW5ndGg7XG4gICAgICBmb3IgKHZhciBjID0gMDsgYyA8IG51bUNoaWxkcmVuOyBjKyspIHtcbiAgICAgICAgdmFyIGNoaWxkID0gZGlyZWN0Q2hpbGRyZW5bY107XG4gICAgICAgIGlmIChjaGlsZC5jbGFzc0xpc3QgJiZcbiAgICAgICAgICAgIGNoaWxkLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLkhFQURFUikpIHtcbiAgICAgICAgICB0aGlzLmhlYWRlcl8gPSBjaGlsZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjaGlsZC5jbGFzc0xpc3QgJiZcbiAgICAgICAgICAgIGNoaWxkLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLkRSQVdFUikpIHtcbiAgICAgICAgICB0aGlzLmRyYXdlcl8gPSBjaGlsZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjaGlsZC5jbGFzc0xpc3QgJiZcbiAgICAgICAgICAgIGNoaWxkLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLkNPTlRFTlQpKSB7XG4gICAgICAgICAgdGhpcy5jb250ZW50XyA9IGNoaWxkO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwYWdlc2hvdycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUucGVyc2lzdGVkKSB7IC8vIHdoZW4gcGFnZSBpcyBsb2FkZWQgZnJvbSBiYWNrL2ZvcndhcmQgY2FjaGVcbiAgICAgICAgICAvLyB0cmlnZ2VyIHJlcGFpbnQgdG8gbGV0IGxheW91dCBzY3JvbGwgaW4gc2FmYXJpXG4gICAgICAgICAgdGhpcy5lbGVtZW50Xy5zdHlsZS5vdmVyZmxvd1kgPSAnaGlkZGVuJztcbiAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRfLnN0eWxlLm92ZXJmbG93WSA9ICcnO1xuICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuXG4gICAgICBpZiAodGhpcy5oZWFkZXJfKSB7XG4gICAgICAgIHRoaXMudGFiQmFyXyA9IHRoaXMuaGVhZGVyXy5xdWVyeVNlbGVjdG9yKCcuJyArIHRoaXMuQ3NzQ2xhc3Nlc18uVEFCX0JBUik7XG4gICAgICB9XG5cbiAgICAgIHZhciBtb2RlID0gdGhpcy5Nb2RlXy5TVEFOREFSRDtcblxuICAgICAgaWYgKHRoaXMuaGVhZGVyXykge1xuICAgICAgICBpZiAodGhpcy5oZWFkZXJfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLkhFQURFUl9TRUFNRUQpKSB7XG4gICAgICAgICAgbW9kZSA9IHRoaXMuTW9kZV8uU0VBTUVEO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaGVhZGVyXy5jbGFzc0xpc3QuY29udGFpbnMoXG4gICAgICAgICAgICB0aGlzLkNzc0NsYXNzZXNfLkhFQURFUl9XQVRFUkZBTEwpKSB7XG4gICAgICAgICAgbW9kZSA9IHRoaXMuTW9kZV8uV0FURVJGQUxMO1xuICAgICAgICAgIHRoaXMuaGVhZGVyXy5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJyxcbiAgICAgICAgICAgIHRoaXMuaGVhZGVyVHJhbnNpdGlvbkVuZEhhbmRsZXJfLmJpbmQodGhpcykpO1xuICAgICAgICAgIHRoaXMuaGVhZGVyXy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXG4gICAgICAgICAgICB0aGlzLmhlYWRlckNsaWNrSGFuZGxlcl8uYmluZCh0aGlzKSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5oZWFkZXJfLmNsYXNzTGlzdC5jb250YWlucyhcbiAgICAgICAgICAgIHRoaXMuQ3NzQ2xhc3Nlc18uSEVBREVSX1NDUk9MTCkpIHtcbiAgICAgICAgICBtb2RlID0gdGhpcy5Nb2RlXy5TQ1JPTEw7XG4gICAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5IQVNfU0NST0xMSU5HX0hFQURFUik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobW9kZSA9PT0gdGhpcy5Nb2RlXy5TVEFOREFSRCkge1xuICAgICAgICAgIHRoaXMuaGVhZGVyXy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uQ0FTVElOR19TSEFET1cpO1xuICAgICAgICAgIGlmICh0aGlzLnRhYkJhcl8pIHtcbiAgICAgICAgICAgIHRoaXMudGFiQmFyXy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uQ0FTVElOR19TSEFET1cpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChtb2RlID09PSB0aGlzLk1vZGVfLlNFQU1FRCB8fCBtb2RlID09PSB0aGlzLk1vZGVfLlNDUk9MTCkge1xuICAgICAgICAgIHRoaXMuaGVhZGVyXy5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuQ3NzQ2xhc3Nlc18uQ0FTVElOR19TSEFET1cpO1xuICAgICAgICAgIGlmICh0aGlzLnRhYkJhcl8pIHtcbiAgICAgICAgICAgIHRoaXMudGFiQmFyXy5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuQ3NzQ2xhc3Nlc18uQ0FTVElOR19TSEFET1cpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChtb2RlID09PSB0aGlzLk1vZGVfLldBVEVSRkFMTCkge1xuICAgICAgICAgIC8vIEFkZCBhbmQgcmVtb3ZlIHNoYWRvd3MgZGVwZW5kaW5nIG9uIHNjcm9sbCBwb3NpdGlvbi5cbiAgICAgICAgICAvLyBBbHNvIGFkZC9yZW1vdmUgYXV4aWxpYXJ5IGNsYXNzIGZvciBzdHlsaW5nIG9mIHRoZSBjb21wYWN0IHZlcnNpb24gb2ZcbiAgICAgICAgICAvLyB0aGUgaGVhZGVyLlxuICAgICAgICAgIHRoaXMuY29udGVudF8uYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJyxcbiAgICAgICAgICAgICAgdGhpcy5jb250ZW50U2Nyb2xsSGFuZGxlcl8uYmluZCh0aGlzKSk7XG4gICAgICAgICAgdGhpcy5jb250ZW50U2Nyb2xsSGFuZGxlcl8oKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBBZGQgZHJhd2VyIHRvZ2dsaW5nIGJ1dHRvbiB0byBvdXIgbGF5b3V0LCBpZiB3ZSBoYXZlIGFuIG9wZW5hYmxlIGRyYXdlci5cbiAgICAgIGlmICh0aGlzLmRyYXdlcl8pIHtcbiAgICAgICAgdmFyIGRyYXdlckJ1dHRvbiA9IHRoaXMuZWxlbWVudF8ucXVlcnlTZWxlY3RvcignLicgK1xuICAgICAgICAgIHRoaXMuQ3NzQ2xhc3Nlc18uRFJBV0VSX0JUTik7XG4gICAgICAgIGlmICghZHJhd2VyQnV0dG9uKSB7XG4gICAgICAgICAgZHJhd2VyQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgZHJhd2VyQnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgICAgIGRyYXdlckJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnYnV0dG9uJyk7XG4gICAgICAgICAgZHJhd2VyQnV0dG9uLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuICAgICAgICAgIGRyYXdlckJ1dHRvbi5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uRFJBV0VSX0JUTik7XG5cbiAgICAgICAgICB2YXIgZHJhd2VyQnV0dG9uSWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcbiAgICAgICAgICBkcmF3ZXJCdXR0b25JY29uLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JQ09OKTtcbiAgICAgICAgICBkcmF3ZXJCdXR0b25JY29uLmlubmVySFRNTCA9IHRoaXMuQ29uc3RhbnRfLk1FTlVfSUNPTjtcbiAgICAgICAgICBkcmF3ZXJCdXR0b24uYXBwZW5kQ2hpbGQoZHJhd2VyQnV0dG9uSWNvbik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5kcmF3ZXJfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLk9OX0xBUkdFX1NDUkVFTikpIHtcbiAgICAgICAgICAvL0lmIGRyYXdlciBoYXMgT05fTEFSR0VfU0NSRUVOIGNsYXNzIHRoZW4gYWRkIGl0IHRvIHRoZSBkcmF3ZXIgdG9nZ2xlIGJ1dHRvbiBhcyB3ZWxsLlxuICAgICAgICAgIGRyYXdlckJ1dHRvbi5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uT05fTEFSR0VfU0NSRUVOKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmRyYXdlcl8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uT05fU01BTExfU0NSRUVOKSkge1xuICAgICAgICAgIC8vSWYgZHJhd2VyIGhhcyBPTl9TTUFMTF9TQ1JFRU4gY2xhc3MgdGhlbiBhZGQgaXQgdG8gdGhlIGRyYXdlciB0b2dnbGUgYnV0dG9uIGFzIHdlbGwuXG4gICAgICAgICAgZHJhd2VyQnV0dG9uLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5PTl9TTUFMTF9TQ1JFRU4pO1xuICAgICAgICB9XG5cbiAgICAgICAgZHJhd2VyQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcbiAgICAgICAgICAgIHRoaXMuZHJhd2VyVG9nZ2xlSGFuZGxlcl8uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgZHJhd2VyQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLFxuICAgICAgICAgICAgdGhpcy5kcmF3ZXJUb2dnbGVIYW5kbGVyXy5iaW5kKHRoaXMpKTtcblxuICAgICAgICAvLyBBZGQgYSBjbGFzcyBpZiB0aGUgbGF5b3V0IGhhcyBhIGRyYXdlciwgZm9yIGFsdGVyaW5nIHRoZSBsZWZ0IHBhZGRpbmcuXG4gICAgICAgIC8vIEFkZHMgdGhlIEhBU19EUkFXRVIgdG8gdGhlIGVsZW1lbnRzIHNpbmNlIHRoaXMuaGVhZGVyXyBtYXkgb3IgbWF5XG4gICAgICAgIC8vIG5vdCBiZSBwcmVzZW50LlxuICAgICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5IQVNfRFJBV0VSKTtcblxuICAgICAgICAvLyBJZiB3ZSBoYXZlIGEgZml4ZWQgaGVhZGVyLCBhZGQgdGhlIGJ1dHRvbiB0byB0aGUgaGVhZGVyIHJhdGhlciB0aGFuXG4gICAgICAgIC8vIHRoZSBsYXlvdXQuXG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLkZJWEVEX0hFQURFUikpIHtcbiAgICAgICAgICB0aGlzLmhlYWRlcl8uaW5zZXJ0QmVmb3JlKGRyYXdlckJ1dHRvbiwgdGhpcy5oZWFkZXJfLmZpcnN0Q2hpbGQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZWxlbWVudF8uaW5zZXJ0QmVmb3JlKGRyYXdlckJ1dHRvbiwgdGhpcy5jb250ZW50Xyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgb2JmdXNjYXRvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBvYmZ1c2NhdG9yLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5PQkZVU0NBVE9SKTtcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5hcHBlbmRDaGlsZChvYmZ1c2NhdG9yKTtcbiAgICAgICAgb2JmdXNjYXRvci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXG4gICAgICAgICAgICB0aGlzLmRyYXdlclRvZ2dsZUhhbmRsZXJfLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLm9iZnVzY2F0b3JfID0gb2JmdXNjYXRvcjtcblxuICAgICAgICB0aGlzLmRyYXdlcl8uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMua2V5Ym9hcmRFdmVudEhhbmRsZXJfLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLmRyYXdlcl8uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIEtlZXAgYW4gZXllIG9uIHNjcmVlbiBzaXplLCBhbmQgYWRkL3JlbW92ZSBhdXhpbGlhcnkgY2xhc3MgZm9yIHN0eWxpbmdcbiAgICAgIC8vIG9mIHNtYWxsIHNjcmVlbnMuXG4gICAgICB0aGlzLnNjcmVlblNpemVNZWRpYVF1ZXJ5XyA9IHdpbmRvdy5tYXRjaE1lZGlhKFxuICAgICAgICAgIC8qKiBAdHlwZSB7c3RyaW5nfSAqLyAodGhpcy5Db25zdGFudF8uTUFYX1dJRFRIKSk7XG4gICAgICB0aGlzLnNjcmVlblNpemVNZWRpYVF1ZXJ5Xy5hZGRMaXN0ZW5lcih0aGlzLnNjcmVlblNpemVIYW5kbGVyXy5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuc2NyZWVuU2l6ZUhhbmRsZXJfKCk7XG5cbiAgICAgIC8vIEluaXRpYWxpemUgdGFicywgaWYgYW55LlxuICAgICAgaWYgKHRoaXMuaGVhZGVyXyAmJiB0aGlzLnRhYkJhcl8pIHtcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uSEFTX1RBQlMpO1xuXG4gICAgICAgIHZhciB0YWJDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGFiQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5UQUJfQ09OVEFJTkVSKTtcbiAgICAgICAgdGhpcy5oZWFkZXJfLmluc2VydEJlZm9yZSh0YWJDb250YWluZXIsIHRoaXMudGFiQmFyXyk7XG4gICAgICAgIHRoaXMuaGVhZGVyXy5yZW1vdmVDaGlsZCh0aGlzLnRhYkJhcl8pO1xuXG4gICAgICAgIHZhciBsZWZ0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGxlZnRCdXR0b24uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLlRBQl9CQVJfQlVUVE9OKTtcbiAgICAgICAgbGVmdEJ1dHRvbi5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uVEFCX0JBUl9MRUZUX0JVVFRPTik7XG4gICAgICAgIHZhciBsZWZ0QnV0dG9uSWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcbiAgICAgICAgbGVmdEJ1dHRvbkljb24uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklDT04pO1xuICAgICAgICBsZWZ0QnV0dG9uSWNvbi50ZXh0Q29udGVudCA9IHRoaXMuQ29uc3RhbnRfLkNIRVZST05fTEVGVDtcbiAgICAgICAgbGVmdEJ1dHRvbi5hcHBlbmRDaGlsZChsZWZ0QnV0dG9uSWNvbik7XG4gICAgICAgIGxlZnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aGlzLnRhYkJhcl8uc2Nyb2xsTGVmdCAtPSB0aGlzLkNvbnN0YW50Xy5UQUJfU0NST0xMX1BJWEVMUztcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgICB2YXIgcmlnaHRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgcmlnaHRCdXR0b24uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLlRBQl9CQVJfQlVUVE9OKTtcbiAgICAgICAgcmlnaHRCdXR0b24uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLlRBQl9CQVJfUklHSFRfQlVUVE9OKTtcbiAgICAgICAgdmFyIHJpZ2h0QnV0dG9uSWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcbiAgICAgICAgcmlnaHRCdXR0b25JY29uLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JQ09OKTtcbiAgICAgICAgcmlnaHRCdXR0b25JY29uLnRleHRDb250ZW50ID0gdGhpcy5Db25zdGFudF8uQ0hFVlJPTl9SSUdIVDtcbiAgICAgICAgcmlnaHRCdXR0b24uYXBwZW5kQ2hpbGQocmlnaHRCdXR0b25JY29uKTtcbiAgICAgICAgcmlnaHRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aGlzLnRhYkJhcl8uc2Nyb2xsTGVmdCArPSB0aGlzLkNvbnN0YW50Xy5UQUJfU0NST0xMX1BJWEVMUztcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgICB0YWJDb250YWluZXIuYXBwZW5kQ2hpbGQobGVmdEJ1dHRvbik7XG4gICAgICAgIHRhYkNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnRhYkJhcl8pO1xuICAgICAgICB0YWJDb250YWluZXIuYXBwZW5kQ2hpbGQocmlnaHRCdXR0b24pO1xuXG4gICAgICAgIC8vIEFkZCBhbmQgcmVtb3ZlIHRhYiBidXR0b25zIGRlcGVuZGluZyBvbiBzY3JvbGwgcG9zaXRpb24gYW5kIHRvdGFsXG4gICAgICAgIC8vIHdpbmRvdyBzaXplLlxuICAgICAgICB2YXIgdGFiVXBkYXRlSGFuZGxlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmICh0aGlzLnRhYkJhcl8uc2Nyb2xsTGVmdCA+IDApIHtcbiAgICAgICAgICAgIGxlZnRCdXR0b24uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklTX0FDVElWRSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxlZnRCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkNzc0NsYXNzZXNfLklTX0FDVElWRSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoaXMudGFiQmFyXy5zY3JvbGxMZWZ0IDxcbiAgICAgICAgICAgICAgdGhpcy50YWJCYXJfLnNjcm9sbFdpZHRoIC0gdGhpcy50YWJCYXJfLm9mZnNldFdpZHRoKSB7XG4gICAgICAgICAgICByaWdodEJ1dHRvbi5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfQUNUSVZFKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmlnaHRCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkNzc0NsYXNzZXNfLklTX0FDVElWRSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAgICAgdGhpcy50YWJCYXJfLmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRhYlVwZGF0ZUhhbmRsZXIpO1xuICAgICAgICB0YWJVcGRhdGVIYW5kbGVyKCk7XG5cbiAgICAgICAgLy8gVXBkYXRlIHRhYnMgd2hlbiB0aGUgd2luZG93IHJlc2l6ZXMuXG4gICAgICAgIHZhciB3aW5kb3dSZXNpemVIYW5kbGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgLy8gVXNlIHRpbWVvdXRzIHRvIG1ha2Ugc3VyZSBpdCBkb2Vzbid0IGhhcHBlbiB0b28gb2Z0ZW4uXG4gICAgICAgICAgaWYgKHRoaXMucmVzaXplVGltZW91dElkXykge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucmVzaXplVGltZW91dElkXyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMucmVzaXplVGltZW91dElkXyA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0YWJVcGRhdGVIYW5kbGVyKCk7XG4gICAgICAgICAgICB0aGlzLnJlc2l6ZVRpbWVvdXRJZF8gPSBudWxsO1xuICAgICAgICAgIH0uYmluZCh0aGlzKSwgLyoqIEB0eXBlIHtudW1iZXJ9ICovICh0aGlzLkNvbnN0YW50Xy5SRVNJWkVfVElNRU9VVCkpO1xuICAgICAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHdpbmRvd1Jlc2l6ZUhhbmRsZXIpO1xuXG4gICAgICAgIGlmICh0aGlzLnRhYkJhcl8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uSlNfUklQUExFX0VGRkVDVCkpIHtcbiAgICAgICAgICB0aGlzLnRhYkJhcl8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLlJJUFBMRV9JR05PUkVfRVZFTlRTKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNlbGVjdCBlbGVtZW50IHRhYnMsIGRvY3VtZW50IHBhbmVsc1xuICAgICAgICB2YXIgdGFicyA9IHRoaXMudGFiQmFyXy5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIHRoaXMuQ3NzQ2xhc3Nlc18uVEFCKTtcbiAgICAgICAgdmFyIHBhbmVscyA9IHRoaXMuY29udGVudF8ucXVlcnlTZWxlY3RvckFsbCgnLicgKyB0aGlzLkNzc0NsYXNzZXNfLlBBTkVMKTtcblxuICAgICAgICAvLyBDcmVhdGUgbmV3IHRhYnMgZm9yIGVhY2ggdGFiIGVsZW1lbnRcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YWJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgbmV3IE1hdGVyaWFsTGF5b3V0VGFiKHRhYnNbaV0sIHRhYnMsIHBhbmVscywgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfVVBHUkFERUQpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGFuIGluZGl2aWR1YWwgdGFiLlxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdGFiIFRoZSBIVE1MIGVsZW1lbnQgZm9yIHRoZSB0YWIuXG4gICAqIEBwYXJhbSB7IUFycmF5PEhUTUxFbGVtZW50Pn0gdGFicyBBcnJheSB3aXRoIEhUTUwgZWxlbWVudHMgZm9yIGFsbCB0YWJzLlxuICAgKiBAcGFyYW0geyFBcnJheTxIVE1MRWxlbWVudD59IHBhbmVscyBBcnJheSB3aXRoIEhUTUwgZWxlbWVudHMgZm9yIGFsbCBwYW5lbHMuXG4gICAqIEBwYXJhbSB7TWF0ZXJpYWxMYXlvdXR9IGxheW91dCBUaGUgTWF0ZXJpYWxMYXlvdXQgb2JqZWN0IHRoYXQgb3ducyB0aGUgdGFiLlxuICAgKi9cbiAgZnVuY3Rpb24gTWF0ZXJpYWxMYXlvdXRUYWIodGFiLCB0YWJzLCBwYW5lbHMsIGxheW91dCkge1xuXG4gICAgLyoqXG4gICAgICogQXV4aWxpYXJ5IG1ldGhvZCB0byBwcm9ncmFtbWF0aWNhbGx5IHNlbGVjdCBhIHRhYiBpbiB0aGUgVUkuXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2VsZWN0VGFiKCkge1xuICAgICAgdmFyIGhyZWYgPSB0YWIuaHJlZi5zcGxpdCgnIycpWzFdO1xuICAgICAgdmFyIHBhbmVsID0gbGF5b3V0LmNvbnRlbnRfLnF1ZXJ5U2VsZWN0b3IoJyMnICsgaHJlZik7XG4gICAgICBsYXlvdXQucmVzZXRUYWJTdGF0ZV8odGFicyk7XG4gICAgICBsYXlvdXQucmVzZXRQYW5lbFN0YXRlXyhwYW5lbHMpO1xuICAgICAgdGFiLmNsYXNzTGlzdC5hZGQobGF5b3V0LkNzc0NsYXNzZXNfLklTX0FDVElWRSk7XG4gICAgICBwYW5lbC5jbGFzc0xpc3QuYWRkKGxheW91dC5Dc3NDbGFzc2VzXy5JU19BQ1RJVkUpO1xuICAgIH1cblxuICAgIGlmIChsYXlvdXQudGFiQmFyXy5jbGFzc0xpc3QuY29udGFpbnMoXG4gICAgICAgIGxheW91dC5Dc3NDbGFzc2VzXy5KU19SSVBQTEVfRUZGRUNUKSkge1xuICAgICAgdmFyIHJpcHBsZUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIHJpcHBsZUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKGxheW91dC5Dc3NDbGFzc2VzXy5SSVBQTEVfQ09OVEFJTkVSKTtcbiAgICAgIHJpcHBsZUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKGxheW91dC5Dc3NDbGFzc2VzXy5KU19SSVBQTEVfRUZGRUNUKTtcbiAgICAgIHZhciByaXBwbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICByaXBwbGUuY2xhc3NMaXN0LmFkZChsYXlvdXQuQ3NzQ2xhc3Nlc18uUklQUExFKTtcbiAgICAgIHJpcHBsZUNvbnRhaW5lci5hcHBlbmRDaGlsZChyaXBwbGUpO1xuICAgICAgdGFiLmFwcGVuZENoaWxkKHJpcHBsZUNvbnRhaW5lcik7XG4gICAgfVxuXG4gICAgaWYgKCFsYXlvdXQudGFiQmFyXy5jbGFzc0xpc3QuY29udGFpbnMoXG4gICAgICBsYXlvdXQuQ3NzQ2xhc3Nlc18uVEFCX01BTlVBTF9TV0lUQ0gpKSB7XG4gICAgICB0YWIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmICh0YWIuZ2V0QXR0cmlidXRlKCdocmVmJykuY2hhckF0KDApID09PSAnIycpIHtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgc2VsZWN0VGFiKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRhYi5zaG93ID0gc2VsZWN0VGFiO1xuICB9XG4gIHdpbmRvd1snTWF0ZXJpYWxMYXlvdXRUYWInXSA9IE1hdGVyaWFsTGF5b3V0VGFiO1xuXG4gIC8vIFRoZSBjb21wb25lbnQgcmVnaXN0ZXJzIGl0c2VsZi4gSXQgY2FuIGFzc3VtZSBjb21wb25lbnRIYW5kbGVyIGlzIGF2YWlsYWJsZVxuICAvLyBpbiB0aGUgZ2xvYmFsIHNjb3BlLlxuICBjb21wb25lbnRIYW5kbGVyLnJlZ2lzdGVyKHtcbiAgICBjb25zdHJ1Y3RvcjogTWF0ZXJpYWxMYXlvdXQsXG4gICAgY2xhc3NBc1N0cmluZzogJ01hdGVyaWFsTGF5b3V0JyxcbiAgICBjc3NDbGFzczogJ21kbC1qcy1sYXlvdXQnXG4gIH0pO1xufSkoKTtcbiJdfQ==
