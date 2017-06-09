'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class Olark
 * 
 * Creates an inlined olark chatbox.
 */
var Olark = function (_Component) {
  _inherits(Olark, _Component);

  function Olark() {
    _classCallCheck(this, Olark);

    return _possibleConstructorReturn(this, (Olark.__proto__ || Object.getPrototypeOf(Olark)).apply(this, arguments));
  }

  _createClass(Olark, [{
    key: 'windowExists',


    /*
     * CUSTOM METHODS
     */

    /**
     * Determine whether `window` exists.
     * 
     * @return {Boolean}
     */
    value: function windowExists() {
      return typeof window !== 'undefined';
    }

    /**
     * Determine whether the olark snippet exists.
     * 
     * @return {Boolean}
     */

  }, {
    key: 'snippetExists',
    value: function snippetExists() {
      return this.windowExists() && !!window.olarkReact;
    }

    /**
     * Determine whether the olark global exists.
     * 
     * @return {Boolean}
     */

  }, {
    key: 'olarkExists',
    value: function olarkExists() {
      return this.windowExists() && !!window.olark;
    }

    /**
     * Determine whether the olark snippet has been executed.
     * 
     * @return {Boolean}
     */

  }, {
    key: 'olarkWasLaunched',
    value: function olarkWasLaunched() {
      return this.snippetExists() && !!window.olarkReact.olarkWasLaunched;
    }

    /**
     * Determine whether the inline container exists.
     * 
     * @return {Boolean}
     */

  }, {
    key: 'containerExists',
    value: function containerExists() {
      return this.windowExists() && !!document.getElementById('olark-box-container');
    }

    /**
     * If we have `window` but the olark snippet does not yet exist,
     * inject it into the page.
     * 
     * @return {undefined}
     */

  }, {
    key: 'injectSnippet',
    value: function injectSnippet() {

      /*
       * Force users to include a `siteId` prop.
       */
      if (!this.props.siteId) {
        throw new Error("The `Olark` component must be given a `siteId` prop.");
      }

      /*
       * Generate the olark script and append it to the body.
       */
      if (this.windowExists() && !this.snippetExists()) {
        var siteId = this.props.siteId;
        var script = document.createElement('script');
        script.setAttribute('id', 'olark-react-snippet');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('async', true);
        script.innerHTML = '\n        window.olarkReact = function (systemConfig, localeConfig) {\n          ;(function(o,l,a,r,k,y){if(o.olark)return;\n          r="script";y=l.createElement(r);r=l.getElementsByTagName(r)[0];\n          y.async=1;y.src="//"+a;r.parentNode.insertBefore(y,r);\n          y=o.olark=function(){k.s.push(arguments);k.t.push(+new Date)};\n          y.extend=function(i,j){y("extend",i,j)};\n          y.identify=function(i){y("identify",k.i=i)};\n          y.configure=function(i,j){y("configure",i,j);k.c[i]=j};\n          k=y._={s:[],t:[+new Date],c:{},l:a};\n          })(window,document,"static.olark.com/jsclient/loader.js");\n          /* Add configuration calls bellow this comment */\n\n          // Since this is a react component, it\'ll live somewhere within a\n          // nested DOM structure and should probably always be inlined.\n          olark.configure(\'box.inline\', true);\n\n          // Run through all the system config.\n          Object.keys(systemConfig || {}).forEach(function (key) {\n            olark.configure(\'system.\' + key, systemConfig[key]);\n          });\n\n          // Run through all the local config.\n          Object.keys(localeConfig || {}).forEach(function (key) {\n            olark.configure(\'locale.\' + key, localeConfig[key]);\n          });\n\n          // Identify the site and mark the script as launched.\n          olark.identify(\'' + siteId + '\');\n          window.olarkReact.olarkWasLaunched = true;\n        };\n      ';
        document.body.appendChild(script);
      }
    }

    /**
     * If the olark snippet exists, but it hasn't been executed,
     * execute it.
     * 
     * @return {undefined}
     */

  }, {
    key: 'launchOlark',
    value: function launchOlark() {
      if (this.snippetExists() && !this.olarkWasLaunched()) {
        window.olarkReact(this.props.systemConfig, this.props.localeConfig);
        window.olark('api.chat.onReady', function () {
          var container = document.getElementById('olark-box-container');
          var classes = container.className;
          if (classes.indexOf('olark-loaded') === -1) {
            container.className = container.className + ' olark-loaded';
          }
        });
      }
    }

    /**
     * If the olark global exists, reset olark.
     * 
     * @return {undefined}
     */

  }, {
    key: 'resetOlark',
    value: function resetOlark() {
      if (this.olarkExists()) {
        olark._.reset();
      }
    }

    /*
     * LIFECYCLE METHODS
     */

    /**
     * When the is preparing to mount, attempt to inject
     * a snippet. Snippet will be injected only if we
     * are in a `window` environment and if it has not
     * yet been injected.
     * 
     * In this case, the snippet is wrapped in another function
     * so that we can control when it is actually executed and
     * so that we can pass configuration values to it.
     * 
     * @return {undefined}
     */

  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.injectSnippet();
    }

    /**
     * Once the component has mounted, launch the snippet if it
     * hasn't already been launched before on some previous render.
     * If it has, reset Olark instead. This component doesn't update
     * after being rendered so the only time a reset occurs will be
     * if the chatbox has physically been removed from the DOM at some
     * point.
     * 
     * @return {undefined}
     */

  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (!this.olarkWasLaunched()) {
        this.launchOlark();
      } else if (!this.containerExists()) {
        this.resetOlark();
      }
    }

    /**
     * Don't allow this component to re-render while it is live.
     * 
     * @return {Boolean} Always false.
     */

  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      return false;
    }

    /**
     * Generate the container that will hold the inline chatbox.
     * 
     * @return {JSX}
     */

  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('div', { id: 'olark-box-container' });
    }
  }]);

  return Olark;
}(_react.Component);

/**
 * Export the Olark component.
 */


module.exports = exports = Olark;