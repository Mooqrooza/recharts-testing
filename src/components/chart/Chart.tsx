'use client'
import React, { useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { useChartDataProcessing, useMusic } from './FatHooks';

import { Logo } from '../logo/Logo';
import { ShowSourceDataButton } from '../button/Button';
import { SourceDataWindow } from '../window/Window';

import { TTestItems } from '../../types/main';
import { testItems } from './TestItems';
import styles from './Chart.module.css';


export const Chart = () => {
    const chartRef = useRef<HTMLDivElement>(null);
    const [chartItems, setChartItems] = useState<TTestItems | null>(null);
    const [showWindow, setShowWindow] = useState(false);
    const stupidLongestTailwindMainClassName = ' flex flex-col items-center justify-center w-[400px] md:w-[800px] min-h-[400px] max-h-[800px]';
    const stupidLongestTailwindAlertClassName = ' p-4 text-sm text-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-300';
    const stupidLongestTailwindSeparatorClassName = 'bg-gray-600 mt-[10px] mb-[10px] h-[1px] w-[100%]';

    useChartDataProcessing({
        ref: chartRef,
        items: chartItems,
        setItems: setChartItems
    });

    useMusic();

    if (chartItems) {
        return (
            <div
                className={styles.Chart + stupidLongestTailwindMainClassName}
                ref={chartRef}
            >
                <Logo />
                <div className={styles.ChartAlert + stupidLongestTailwindAlertClassName} role='alert'>
                    Очередное тестовое задание... <br />
                    <div className={stupidLongestTailwindSeparatorClassName} />
                    Ниже отображен уровень не традиционного запаха изо рта для Ксавьера и Француа...<br />
                    Области для значений с z-отклонением более 1 помечены красным.<br />
                    Все точки попадающие в область отклонения, вне зависимости от фактического значения z-score закрашены красным.
                </div>

                <ResponsiveContainer width={'100%'} minHeight={400}>
                    <LineChart className={styles.LineChart} data={chartItems}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='name' />
                        <YAxis />
                        <Tooltip
                            contentStyle={{ borderRadius: '6px' }}
                            labelStyle={{ color: 'black', fontSize: '0.8em' }}
                            itemStyle={{ color: 'black', fontSize: '0.8em' }}
                        />
                        <Legend />
                        <Line
                            type='monotone'
                            dataKey='pv'
                            stroke='#8884d8'
                            name='Дахание Ксавьера'
                            isAnimationActive={false}
                            activeDot={false}
                            dot={{ className: styles.ChartDot }}
                        />
                        <Line
                            type='monotone'
                            dataKey='uv'
                            stroke='#82ca9d'
                            name='Дахание Француа'
                            isAnimationActive={false}
                            activeDot={false}
                            dot={{ className: styles.ChartDot }}
                        />
                    </LineChart>
                </ResponsiveContainer>

                <ShowSourceDataButton showWindow={() => setShowWindow(true)} />
                {showWindow && <SourceDataWindow closeWindow={() => setShowWindow(false)} data={testItems} />}
            </div>
        );
    } else {
        return (
            <>
                <svg width='40' height='40' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' className={styles.ChartSpinner}>
                    <path fill='white' clipRule='evenodd' d='M21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12H6C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12H21Z' >
                        <animateTransform
                            attributeName='transform'
                            attributeType='XML'
                            type='rotate'
                            dur='1s'
                            from='0 12 12'
                            to='360 12 12'
                            repeatCount='indefinite'
                        />
                    </path>
                </svg>
                <p>Кручусь без смысла...</p>
            </>
        );
    }
};
