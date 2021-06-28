import Head from "next/head";
import Image from "next/image";
import React from "react";
import Layout from "../components/layout";
import styles from "../styles/Home.module.css";

export default function Home(pageProps:any) {
  return <Layout {...pageProps}></Layout>;
}
