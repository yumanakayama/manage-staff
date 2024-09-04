import React from 'react';
import styles from './loadingCircle.module.scss';

const LoadingCircle = () => {
  return (
    <div className={styles.wrap}>
      <div className={styles.spinner}></div>
    </div>
  );
}

export default LoadingCircle