/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

/* eslint-env browser, es6 */

'use strict';

const applicationServerPublicKey = 'BJzQij7s8cXcBJ19jKHbU2z-z3NBqqi9hDefBEj1EeMEIwEjbIcaRkN-Mf3E2DaiXTXMVTB753B4FQiCF4nFpwY';

const pushButton = document.querySelector('.js-push-btn');

let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function updateBtn() {

  console.log({Notification})

  if(Notification.permission === 'denied') {
    pushButton.textContent = 'Push Messaging Disabled';
    pushButton.disabled = true;
    return;
  }


  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging';
  } else {
    pushButton.textContent = 'Enable Push Messaging';
  }

  pushButton.disabled = false;
}


async function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  console.log({applicationServerKey});

  const subscription = await swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey
  }).catch((error) => {
    console.error('Failed to subscribe the user: ', error);
    updateBtn();
  });

  

  if(subscription) {
    console.log('User is subscribed.', subscription);
    isSubscribed = true;
    updateBtn();

  }

}



async function init() {

  pushButton.addEventListener('click',(e) => {
    pushButton.disabled = true;
    if(isSubscribed) {
      //TODO: UNSUBSCRIBE
    } else {
      subscribeUser();
    }

  });


  

  const subscription = await swRegistration.pushManager.getSubscription();
  console.log({subscription});
  if(!subscription) {
    isSubscribed = false;
  } else {
    isSubscribed = true;
  }

  if (isSubscribed) {
    console.log('User IS subscribed.');
  } else {
    console.log('User is NOT subscribed.');
  }

  updateBtn();

}

async function registerServiceWorker() {
  if('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push are supported');
    swRegistration = await navigator.serviceWorker.register('sw.js').catch((e) => { 
      console.error('Service Worker Error', error);
    });
   

    if(swRegistration) {
      console.log({swRegistration});
      init();
    }
  
  } else {
    console.warn('Push messaging is not supported');
    pushButton.textContent = 'Push Not Supported';
  }
}

registerServiceWorker();


