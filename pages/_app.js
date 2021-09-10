import Head from 'next/head';
import Loading from '../components/Loading.js';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { firebaseConfig } from '../util/firebaseConfig.js';
import { useEffect, useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';

// initialize firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function ComponentAuthed(props) {
  const { Component, pageProps } = props;

  // get current user
  const uid = firebase.auth().currentUser.uid;
  const userDoc = firebase.firestore().collection('users').doc(uid);
  const [userData] = useDocumentData(userDoc);

  return (
    userData ?
    <Component currentUser={userData} {...pageProps} /> :
    <Loading />
  );
}

export default function App(props) {
  const { Component, pageProps } = props;

  const [authed, setAuthed] = useState(undefined);

  // listen for user auth
  useEffect(() => {
    const authListener = firebase.auth().onAuthStateChanged(() => {
      setAuthed(!!firebase.auth().currentUser);
    });
    return () => authListener;
  }, []);

  return (
    <>
      <Head>
        {/* general */}
        <title>Devcomms</title>
        <meta name="description" content="Text chat with built-in developer widgets." />
        {/* links */}
        <link rel="apple-touch-icon" sizes="180x180" href="favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="favicons/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href="https://devcomms.io" />
        {/* og meta */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Devcomms" />
        <meta property="og:title" content="Text chat with built-in developer widgets." />
        <meta property="og:image" content="https://devcomms.io/img/screen1.png" />
        <meta property="og:description" content="Devcomms is an open source communication tool built by developers, for developers." />
        <meta property="og:url" content="https://devcomms.io" />
        {/* twitter meta */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@CodeConvoyOrg" />
        <meta name="twitter:title" content="Text chat with built-in developer widgets." />
        <meta name="twitter:description" content="Devcomms is an open source communication tool built by developers, for developers." />
        <meta name="twitter:image" content="https://devcomms.io/img/screen1.png" />
      </Head>
      {
        authed === undefined ?
        <Loading /> :
        authed ?
        <ComponentAuthed Component={Component} pageProps={pageProps} /> :
        <Component currentUser={null} {...pageProps} />
      }
    </>
  );
}
