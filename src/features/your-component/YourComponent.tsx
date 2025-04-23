import React from 'react';
import defaultLocales from '@locale/default';
// import styles from './YourComponent.module.css';

const defaults = defaultLocales.yourModule;

const YourComponent: React.FC = () => {
  return (
    // <div className={styles.container}>
    //   <span className={styles.yourClass}>{defaults.span}</span>
    // </div>
    <div>App</div>
  );
};

export default YourComponent;
