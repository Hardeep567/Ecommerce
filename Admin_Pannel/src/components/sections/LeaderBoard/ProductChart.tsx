import { alpha, SxProps, useTheme } from '@mui/material';
import ReactEChart from 'components/base/ReactEChart';
import { BarSeriesOption } from 'echarts';
import * as echarts from 'echarts/core';
import EChartsReactCore from 'echarts-for-react/lib/core';
import {
  GridComponentOption,
  LegendComponentOption,
  TooltipComponentOption,
} from 'echarts/components';
import React, { ReactElement, useMemo } from 'react';

type LevelChartProps = {
  chartRef: React.MutableRefObject<EChartsReactCore | null>;
  data: any;
  sx?: SxProps;
};

type LevelChartOptions = echarts.ComposeOption<
  BarSeriesOption | LegendComponentOption | TooltipComponentOption | GridComponentOption
>;

const LevelChart = ({ chartRef, data, ...rest }: LevelChartProps): ReactElement => {
  const theme = useTheme();
  const option: LevelChartOptions = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        show: false,
        data: ['Product'],
      },
      xAxis: {
        type: 'category',
        show: true,
        axisTick: { show: false },
        data: ['Product 1', 'Product 2', 'Product 3', 'Product 4', ],
        axisLabel: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: alpha(theme.palette.common.white, 0.06),
            width: 1,
          },
        },
      },
      yAxis: {
        type: 'value',
        show: false,
      },
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 1,
      },
      series: [
        {
          id: 1,
          name: 'Product',
          type: 'bar',
          stack: 'Service',
          barWidth: 120,
          emphasis: {
            focus: 'series',
          },
          data: data.Volume,
          color: theme.palette.primary.main,
          itemStyle: {
            borderRadius: 4,
          },
        },
      ],
    }),
    [theme],
  );

  return <ReactEChart ref={chartRef} option={option} echarts={echarts} {...rest} />;
};

export default LevelChart;
