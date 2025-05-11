import styles from './Kitties.module.css';

export const Kitties = () => {
    return (
       <div className={styles.Kitties} >
            <img alt='Its just a cat...' src='images/kitty-a.png' className={styles.KittyA} />
            <img alt='Its just a cat...' src='images/kitty-b.png' className={styles.KittyB} />
       </div>
    );
};