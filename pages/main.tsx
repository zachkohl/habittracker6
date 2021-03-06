import React, { useState, useEffect } from "react";
import axios from "axios";
import write from "../lib/browser/write";
import read from "../lib/browser/read";
import Role from "../components/role";
import Wrapper from "../components/DnDwrapper";
import Main from "../components/main";
import { resetServerContext } from "react-beautiful-dnd";
export default function MainPage(props) {
  return <Main />;
}
export async function getStaticProps(context) {
  resetServerContext();
  return {
    props: {},
  };
}
