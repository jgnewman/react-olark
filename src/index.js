import React, { Component } from 'react';

/**
 * @class Olark
 * 
 * Creates an inlined olark chatbox.
 */
class Olark extends Component {

  /*
   * CUSTOM METHODS
   */

  /**
   * Determine whether `window` exists.
   * 
   * @return {Boolean}
   */
  windowExists() {
    return typeof window !== 'undefined';
  }

  /**
   * Determine whether the olark snippet exists.
   * 
   * @return {Boolean}
   */
  snippetExists() {
    return this.windowExists() && !!window.olarkReact;
  }

  /**
   * Determine whether the olark global exists.
   * 
   * @return {Boolean}
   */
  olarkExists() {
    return this.windowExists() && !!window.olark;
  }

  /**
   * Determine whether the olark snippet has been executed.
   * 
   * @return {Boolean}
   */
  olarkWasLaunched() {
    return this.snippetExists() && !!window.olarkReact.olarkWasLaunched;
  }

  /**
   * Determine whether the inline container exists.
   * 
   * @return {Boolean}
   */
  containerExists() {
    return this.windowExists() && !!document.getElementById('olark-box-container')
  }

  /**
   * If we have `window` but the olark snippet does not yet exist,
   * inject it into the page.
   * 
   * @return {undefined}
   */
  injectSnippet() {

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
      const siteId = this.props.siteId;
      const script = document.createElement('script');
      script.setAttribute('id', 'olark-react-snippet');
      script.setAttribute('type', 'text/javascript');
      script.setAttribute('async', true);
      script.innerHTML = `
        window.olarkReact = function (systemConfig, localeConfig) {
          ;(function(o,l,a,r,k,y){if(o.olark)return;
          r="script";y=l.createElement(r);r=l.getElementsByTagName(r)[0];
          y.async=1;y.src="//"+a;r.parentNode.insertBefore(y,r);
          y=o.olark=function(){k.s.push(arguments);k.t.push(+new Date)};
          y.extend=function(i,j){y("extend",i,j)};
          y.identify=function(i){y("identify",k.i=i)};
          y.configure=function(i,j){y("configure",i,j);k.c[i]=j};
          k=y._={s:[],t:[+new Date],c:{},l:a};
          })(window,document,"static.olark.com/jsclient/loader.js");
          /* Add configuration calls bellow this comment */

          // Since this is a react component, it'll live somewhere within a
          // nested DOM structure and should probably always be inlined.
          olark.configure('box.inline', true);

          // Run through all the system config.
          Object.keys(systemConfig || {}).forEach(function (key) {
            olark.configure('system.' + key, systemConfig[key]);
          });

          // Run through all the local config.
          Object.keys(localeConfig || {}).forEach(function (key) {
            olark.configure('locale.' + key, localeConfig[key]);
          });

          // Identify the site and mark the script as launched.
          olark.identify('${siteId}');
          window.olarkReact.olarkWasLaunched = true;
        };
      `;
      document.body.appendChild(script);
    }
  }

  /**
   * If the olark snippet exists, but it hasn't been executed,
   * execute it.
   * 
   * @return {undefined}
   */
  launchOlark() {
    if (this.snippetExists() && !this.olarkWasLaunched()) {
      window.olarkReact(this.props.systemConfig, this.props.localeConfig);
      window.olark('api.chat.onReady', () => {
        const container = document.getElementById('olark-box-container');
        const classes = container.className;
        if (classes.indexOf('olark-loaded') === -1) {
          container.className = container.className + ' olark-loaded';
        }
      })
    }
  }

  /**
   * If the olark global exists, reset olark.
   * 
   * @return {undefined}
   */
  resetOlark() {
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
  componentWillMount() {
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
  componentDidMount() {
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
  shouldComponentUpdate() {
    return false;
  }

  /**
   * Generate the container that will hold the inline chatbox.
   * 
   * @return {JSX}
   */
  render() {
    return (
      <div id="olark-box-container"></div>
    )
  }

}

/**
 * Export the Olark component.
 */
module.exports = exports = Olark;