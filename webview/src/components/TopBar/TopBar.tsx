import React from 'react';
import styles from './TopBar.module.css';

const TopBar: React.FC = () => {
  return (
    <div className={styles.topBar}>
      <div className={styles.leftSection}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>T</div>
        </div>
        <span className={styles.brandText}>TaiShan 200 Server</span>
        <span className={styles.versionBadge}>2280</span>
      </div>
      
      <div className={styles.rightSection}>
        {/* 右侧按钮已删除 */}
      </div>
    </div>
  );
};

export default TopBar;
