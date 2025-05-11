import { TSourceDataWindowProps } from '../../types/main';
import { TTestItems } from '../../types/main';
import styles from './Window.module.css';

const getStringifiyed = (data: TTestItems) => {
   let strData = '';
   try { strData = JSON.stringify(data, null, 1); }
   catch (err) { 
      console.log('SourceDataWindow -> getStringifiyed(): Stringify data error:', err); 
   }

   strData.replace('},', '');
   
   return strData;
};

export const SourceDataWindow: React.FC<TSourceDataWindowProps> = ({ closeWindow, data }) => {
    return (
        <div className={styles.SourceDataWindow + ' fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000b3] '}>
            <div className='dark:bg-gray-800 rounded-lg shadow-xl max-w-[700px] w-full p-6' >
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='text-xl'>Исходные данные</h3>
                    <button
                        onClick={closeWindow}
                        type='button'
                        className='cursor-pointer text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white' data-modal-hide='default-modal'>
                        <svg className='w-3 h-3' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 14 14'>
                            <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6' />
                        </svg>
                        <span className='sr-only'>Close modal</span>
                    </button>
                </div>
                <div className='mb-4'>
                    <code>{getStringifiyed(data)}</code>
                    <p className='mt-[25px]'>Хм... А понял ли я, что нужно делать???... </p>
                </div>
            </div>
        </div>
    )
};