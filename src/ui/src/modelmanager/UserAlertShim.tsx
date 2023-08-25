import React, {Fragment, useEffect} from 'react'
import { createGlobalStyle } from 'styled-components'

import Noty from 'noty'
import 'noty/lib/noty.css'

/**
 * this shim exists to display UserAlert toasts on the models page
 * window.UserAlert is a utility class that allows twirl pages to save a message
 * to be displayed on the next page shown. the model details pages (twirl) passes messages like
 * "Model Archived" for display on the models list page (react)
 */
const UserAlertShim: React.FC = () => {
  useEffect(() => {
    UserAlert.flashMessages()
  }, [])

  return <Fragment><UserAlert.DominoNotyStyles /></Fragment>
}

export default UserAlertShim


/**
 * This is a (slightly) modified copy of packages/utils/src/userAlert.js
 * which is a module that can't be imported into this package for bazel reasons
 */
namespace UserAlert {
  const SESSION_KEY = 'domino.UserAlert'
  const NOTY_TIMEOUT = 4000
  type MessageType = 'error' | 'success' | 'alert' | 'warning'
  type MessageWrapper = { type: MessageType, text: string }
  function getItem(): MessageWrapper[] {
    return JSON.parse(window.sessionStorage.getItem(SESSION_KEY) || '[]');
  }
  
  function setItem(value: MessageWrapper[]) {
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(value));
  }
  
  function notify(message: string, type: MessageType, obj?: Noty.Options) {
    const options = Object.assign({
      timeout: NOTY_TIMEOUT,
      theme: 'domino',
      progressBar: false,
      type: type,
      text: message || type
    }, obj);
    new Noty(options).show();
  }

  export const UserAlert = {
    error(message: string, obj?: Noty.Options) {
      notify(message, 'error', obj);
    },
  
    success(message: string, obj?: Noty.Options) {
      notify(message, 'success', obj);
    },
  
    alert(message: string, obj?: Noty.Options) {
      notify(message, 'alert', obj);
    },
  
    warning(message: string, obj?: Noty.Options) {
      notify(message, 'warning', obj);
    },
  
    /* Flash a message on the next request. */
    flash(text: string, type: MessageType) {
      setItem(getItem().concat({
        text: text,
        type: type
      }));
    },
  
    /* Flash all messages. */
    flashMessages() {
      getItem().forEach(({ type, text }) => this[type](text));
      setItem([]);
    }
  }

  export const flashMessages = () => UserAlert.flashMessages()

  //
  // The following stylesheet is copy/pasted verbatum from packages/utils/src/noty-domino.css
  //
  export const DominoNotyStyles = createGlobalStyle`
    /*
    * Ported from webapp.css and adapted for noty 3.x
    */

    .noty_theme__domino.noty_bar {
      margin: 4px 0;
      border-radius: 2px;
      position: relative;
    }

    .noty_theme__domino.noty_bar .noty_body {
      padding: 20px 24px 19px 24px;
      font-size: 14px;
      color: #fff;
    }

    .noty_theme__domino.noty_bar .noty_buttons {
      padding: 10px;
    }

    .noty_theme__domino.noty_type__alert,
    .noty_theme__domino.noty_type__notification {
      background-color: #2d71c7;
      border-bottom: 1px solid #D1D1D1;
    }

    .noty_theme__domino.noty_type__warning {
      background-color: #EAD594;
      color: #4C423B;
      border-bottom: 1px solid #E89F3C;
    }

    .noty_theme__domino.noty_type__error {
      background-color: #D64C63;
      border-bottom: 1px solid #CA5A65;
    }

    .noty_theme__domino.noty_type__info,
    .noty_theme__domino.noty_type__information {
      background-color: #7F7EFF;
      border-bottom: 1px solid #7473E8;
    }

    .noty_theme__domino.noty_type__success {
      background-color: #64C897;
      border-bottom: 1px solid #A0B55C;
    }

    /**
     * Add a close button icon to notifications to indicate to the user that they
     * can be closed by clicking on them.
     */
    .noty_theme__domino .noty_body::before {
      content: "✕";
      float: right;
      margin-left: 10px;
    }
  `
}
