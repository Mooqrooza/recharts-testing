export type TTestItemsItem = {
    name: string;
    [key: string]: number | string;
};

export type TTestItems = TTestItemsItem[];

export type TCalZScoresFor = (
    data: TTestItems, 
    ...args: string[]
) => TTestItems;

export type TCalZScores = (
    data: TTestItems, 
    ...args: string[]
) => [TTestItems, number, number ];;

export type TChartData = {
    items?: TTestItems;
    min?: number;
    max?: number;
};

export type TUseChartDataProcessing = (props: {
     ref: React.RefObject<HTMLDivElement | null>; 
     items: TTestItems | null;
    setItems: (val: TTestItems | null) => void,
}) => void;

export type TFillChartBars = (props: {
     el: Element;
     items: TTestItems | null;
     min: number | string;
     max: number | string;
}) => void;

export type TShowSourceDataButtonProps = {
    showWindow: () => void;
};

export type TSourceDataWindowProps = {
    closeWindow: () => void;
    data: TTestItems;
};

export type TAddSquareToSVG = (props: {
    el: Element,
    x?: number | string,
    y?: number | string,
    height?: number,
    width?: number,
}) => void;

export type TClearChartBars = (el: Element) => void;

export type TMarkDots = (el: Element) => void;

export type TTimeout = NodeJS.Timeout | null | number;