import { useMemo } from "react";
import { BaseChart } from "./BaseChart";

export type ChartProps = {
    data: number[];
    maxDataPoints: number;
}

export function Chart(props: ChartProps) {
    const preparedData = useMemo(() => {
        const points = props.data.map(point => ({ value: point * 100 }));

        // what this is doing is that, if the number of data points we have < maxDataPoint (i.e. the # points we want to show), then we will keep those missing data points to be empty
        // this gives better visualization effect
        return [
            ...points,
            ...Array.from({ length: props.maxDataPoints - points.length }).map(
                () => ({ value: undefined })
            )]

    }, [props.data, props.maxDataPoints])

    return <BaseChart data={preparedData} />
}