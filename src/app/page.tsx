import { Kitties } from '@/components/kitties/Kitties';
import { Chart } from '@/components/chart/Chart';

export default function Home() {
    return (
        <div className='flex items-center flex-col gap-[30px] justify-center h-screen p-[30px] min-w-[480px]'>
            <Kitties />
            <Chart />
        </div>
    );
};
