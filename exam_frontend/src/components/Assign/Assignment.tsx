
import styles from './Assignment.module.css'

export const Assignment = () => {
  return (
    <div className={styles['square-box']}>
        
        <input type='text' name={"employee"} className={styles['search-input']} placeholder='employee id'/>
        
        <button className={styles['assign-button']}>
            <div className={styles['assign-text']}>Assign</div>
            </button>
    </div>
  )
}
