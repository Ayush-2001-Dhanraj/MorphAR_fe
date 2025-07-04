import React from "react";
import styles from "./ListeningIndicator.module.css";

const ListeningIndicator = ({ isListening }) => {
  return (
    <div
      className={`${styles.circle} ${
        isListening ? styles.listening : styles.idle
      }`}
    >
      {isListening && (
        <>
          <span className={`${styles.pulse} ${styles.pulse1}`}></span>
          <span className={`${styles.pulse} ${styles.pulse2}`}></span>
          <span className={`${styles.pulse} ${styles.pulse3}`}></span>
        </>
      )}
    </div>
  );
};

export default ListeningIndicator;
