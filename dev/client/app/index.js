import Olark from '../../../bin/index';
import { siteId } from '../../../env';

import React from 'react';
import ReactDOM from 'react-dom';


ReactDOM.render((

  <Olark
    siteId={siteId}
    systemConfig={{ "hb_dark_theme": true, "hb_enable_uploads": true }}
    localeConfig={{ "chatting_title" : "Chat con nosotros!" }}
  />

), document.getElementById('app'))


