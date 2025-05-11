import { TShowSourceDataButtonProps } from '../../types/main';
import styles from './Button.module.css'

export const ShowSourceDataButton: React.FC<TShowSourceDataButtonProps> = ({ showWindow }) => {
    const stupidLongestTailwindClassName = ' cursor-pointer py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10  dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
    return (
        <button 
            onClick={showWindow}
            type='button' 
            data-modal-target='source-data-window' 
            data-modal-toggle='source-data-window'
            className={styles.Button + stupidLongestTailwindClassName} 
        >
          Отобразить исходные данные
        </button>
    );
};