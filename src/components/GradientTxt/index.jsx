import React from "react";
import styles from "./GradientTxt.module.css";

function GradientTxt({ txt, extraStyles = {} }) {
  return (
    <span className={styles.gradient_txt} style={extraStyles}>
      {txt}
    </span>
  );
}

export default GradientTxt;
