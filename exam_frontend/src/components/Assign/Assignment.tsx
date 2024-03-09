//src/components/Assign/Assignment.tsx

import styles from './Assignment.module.css'

export const Assignment = () => {
  return (
    <div className={styles['square-box']}>
        <div className={styles['info']}>Selected Asset name </div>
        <div className={styles['info']}> asset type </div>
        <div className={styles['info']}> asset id </div>
        <div className={styles['info']}>Asset Cateogry </div>
        <div className={styles['info']}>Asset Model Number </div>
        <div className={styles['info']}>Asset Serial Number </div>
        <div className={styles['info']}>Version </div>
        <div className={styles['info']}>Asset Location </div>
        <div className={styles['info']}>Asset Invoice Location </div>
        <div className={styles['info']}></div>
        <input type='text' name={"employee"} className={styles['search-input']} placeholder='employee id'/>
        
        <button className={styles['assign-button']}>
            Assign
            </button>
    </div>
  )
}

