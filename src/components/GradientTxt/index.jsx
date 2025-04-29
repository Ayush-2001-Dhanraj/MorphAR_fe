import React from "react";
import styles from "./GradientTxt.module.css";

function GradientTxt({ txt }) {
  return <span className={styles.gradient_txt}>{txt}</span>;
}

export default GradientTxt;
