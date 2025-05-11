import { useEffect, useState, useRef } from 'react';
import { TUseChartDataProcessing, TFillChartBars, TCalZScores, TAddSquareToSVG, TClearChartBars, TMarkDots, TTimeout } from '../../types/main';
import { testItems } from './TestItems';
import { Howl } from 'howler';
import styles from './Chart.module.css';

// Clalculate z-score for each prop/key
const calculateZScores: TCalZScores = (data, ...keys) => {
    const spreadedItems: number[] = [];
    let max = 0;
    let min = 0;

    data.forEach((it) => {
        keys.forEach((key) => {
            const value = +it[key];
            spreadedItems.push(value);
            max = value > max ? value : max;
            min = value < min ? value : min;
        });
    });

    const mean = spreadedItems.reduce((acc, vl) => acc + vl, 0) / spreadedItems.length;
    const stdDev = Math.sqrt(
        spreadedItems.reduce((acc, vl) => acc + Math.pow(vl - mean, 2), 0) / spreadedItems.length
    );

    return [
        data.map((item) => {
            const newItem = { ...item };
            keys.forEach((key) => {
                newItem[`${key}ZScore`] = stdDev === 0 ? 0 : (+item[key] - mean) / stdDev;
            });
            return newItem;
        }),
        min,
        max
    ]
};

const addSquareToSVG: TAddSquareToSVG = (props) => {
    const { el, x = 0, y = 0, height = 0, width = 0 } = props;
    const rectEl = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

    rectEl.setAttribute('x', x.toString());
    rectEl.setAttribute('y', y.toString());
    rectEl.setAttribute('fill', 'red');
    rectEl.setAttribute('fill-opacity', '0.5');
    rectEl.setAttribute('width', width.toString());
    rectEl.setAttribute('height', height.toString());
    rectEl.classList.add(styles.ChartRedRect);
    el.appendChild(rectEl);
};

const markDots: TMarkDots = (el) => {
    const dotEls = el.querySelectorAll('.recharts-line-dots circle');
    const rectsEl = el.querySelectorAll(`.${styles.ChartRedRect}`);

    Array.from(dotEls).forEach((circleEl: Element) => {
        const r = parseFloat(circleEl.getAttribute('r') || '0');
        const cx = parseFloat(circleEl.getAttribute('cx') || '0');
        const cy = parseFloat(circleEl.getAttribute('cy') || '0');

        const isOnRect = Array.from(rectsEl).some((rect) => {
            const rectX = parseFloat(rect.getAttribute('x') || '0');
            const rectY = parseFloat(rect.getAttribute('y') || '0');
            const rectWidth = parseFloat(rect.getAttribute('width') || '0');
            const rectHeight = parseFloat(rect.getAttribute('height') || '0');

            const closestX = Math.max(rectX, Math.min(cx, rectX + rectWidth));
            const closestY = Math.max(rectY, Math.min(cy, rectY + rectHeight));

            const distanceX = cx - closestX;
            const distanceY = cy - closestY;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            return distance <= r;
        });

        // For simple class changing. Not work with default activeDot styles
        circleEl.classList[isOnRect ? 'add' : 'remove'](styles.ChartRedDot);
    });
};

// Add red rects related to z-score items
const fillChartBars: TFillChartBars = (props) => {
    const { el, items = [], max = 0 } = props;
    const gridEl = el.querySelector('.recharts-cartesian-grid');
    const hLinesEl = gridEl?.querySelector('.recharts-cartesian-grid-horizontal');
    const hLineEls = hLinesEl?.querySelectorAll('line');
    const vLinesEl = gridEl?.querySelector('.recharts-cartesian-grid-vertical');
    const vLineEls = vLinesEl?.querySelectorAll('line');
    const hasRequiredData = gridEl && hLinesEl && hLineEls && vLinesEl && vLineEls && items;

    if (hasRequiredData) {
        const width = vLinesEl.getBoundingClientRect().width / (vLineEls.length - 1);
        const height = hLinesEl.getBoundingClientRect().height / (hLineEls.length - 1);
        const yStep = +max / (hLineEls.length - 1);

        const xOffset = +(vLineEls[0].getAttribute('x') || 0);
        const yOffset = +(hLineEls[0].getAttribute('y') || 0);

        const getX = (idx: number) => {
            const ratio = Math.floor(vLineEls.length / items.length * idx);
            return xOffset + (width * (ratio)) || 0;
        };
        const getY = (vl: number) => {
            let y = Math.round(vl / yStep);
            y = Math.floor(+max / yStep) - y;
            y = (y * height) + yOffset;

            return y;
        };

        items.forEach((it, idx) => {
            const pvZScore = Math.abs(+it.pvZScore);
            const uvZScore = Math.abs(+it.uvZScore);
            const pv = +it.pv;
            const uv = +it.uv;

            if (idx < items.length - 1) {
                if (pvZScore > 1) {
                    const x = getX(idx);
                    const y = getY(pv);

                    addSquareToSVG({ el: gridEl, x, y, height, width });
                } else if (uvZScore > 1) {
                    const x = getX(idx);
                    const y = getY(uv);

                    addSquareToSVG({ el: gridEl, x, y, height, width });
                }
            }
        });
    }
};

// Clear adder red rects
const clearChartBars: TClearChartBars = (el) => {
    const gridEl = el.querySelector('.recharts-cartesian-grid');
    if (gridEl) {
        const rectEls = gridEl.querySelectorAll(`.${styles.ChartRedRect}`) || [];
        Array.from(rectEls)
            .forEach((el) => el.remove());
    }
};

// Fat hook
export const useChartDataProcessing: TUseChartDataProcessing = ({ ref, items, setItems }) => {
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);

    // Effect ror calculating
    useEffect(() => {
        setTimeout(() => {
            const [processedItems, itemsMin, itemsMax] = calculateZScores(testItems, 'uv', 'pv');
            setMin(itemsMin);
            setMax(itemsMax)
            setItems(processedItems);
        }, 1300);
    }, []);

    // Effect for observable processing...
    useEffect(() => {
        const mainEl = ref.current;
        let fillTmr: TTimeout = null;

        if (!mainEl) return;

        const observer = new ResizeObserver(() => {
            if (fillTmr) { clearTimeout(fillTmr); }
            clearChartBars(mainEl);
            fillTmr = setTimeout(() => {
                fillChartBars({ el: mainEl, items, min, max });
                markDots(mainEl);
            }, 150);
        });
        observer.observe(mainEl);

        return () => {
            if (fillTmr) { clearTimeout(fillTmr); }
            observer.disconnect();
        }
    }, [items]);
};

export const useMusic = () => {
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    soundRef.current = new Howl({
      src: ['./sounds/music.mp3'],
      loop: true,
      volume: 0.3,
      preload: true
    });

    const handleFirstInteraction = () => {
      soundRef.current?.play();
      
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      soundRef.current?.unload();
    };
  }, []);

  return null;
}