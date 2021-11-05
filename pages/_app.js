import Head from 'next/head';
import Loading from '../components/Loading.js';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocument } from 'react-firebase-hooks/firestore';
import { firebaseConfig } from '../util/firebaseConfig.js';
import { useEffect, useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';

// initialize firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// meta
const title = "Devcomms";
const url = "https://devcomms.io";
const description = "Devcomms is an open source communication tool built by developers, for developers.";
const image = "https://devcomms.io/img/screen1.png";

function ComponentAuthed(props) {
  const { Component, pageProps } = props;

  // get current user
  const uid = firebase.auth().currentUser.uid;
  const userRef = firebase.firestore().collection('users').doc(uid);
  const [userDoc] = useDocument(userRef);

  return (
    userDoc === undefined ?
    <Loading /> :
    <Component
      authed={true}
      currentUser={userDoc.exists ? userDoc.data() : null}
      {...pageProps}
    />
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
        <title>{title}</title>
        <meta name="description" content={description} />
        {/* links */}
        <link rel="apple-touch-icon" sizes="180x180" href="favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="favicons/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href={url} />
        {/* open graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        {/* twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@CodeConvoyOrg" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </Head>
      {
        authed === undefined ?
        <Loading /> :
        authed ?
        <ComponentAuthed Component={Component} pageProps={pageProps} /> :
        <Component authed={false} currentUser={null} {...pageProps} />
      }
    </>
  );
}
