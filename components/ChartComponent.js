import { Box, Stack, Text, useBreakpointValue, useColorModeValue } from '@chakra-ui/react';
import { createChart, ColorType } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../context/state';
import { abbrNum } from '../utils';

const ChartComponent = props => {
	const {
		data,
		colors: {
			backgroundColor,
			lineColor,
			textColor,
			areaTopColor,
			areaBottomColor,
      volumeColor,
      watermarkColor,
      gridColor
		},
	} = props;
	const chartContainerRef = useRef();

  const { collection } = useAppContext()

  const getWidth = () => chartContainerRef.current.clientWidth
  const height = useBreakpointValue([window.innerHeight - 80, window.innerHeight])

  const [ legend, setLegend ] = useState({
    price: data[data.length - 1]?.value, 
    volume: data[data.length - 1]?.volume,
    sales: data[data.length - 1]?.sales_count,
    rank: data[data.length - 1]?.rank,

  })
  useEffect(() => {
    console.log(data)
    setLegend({
      price: data[data.length - 1]?.value, 
      volume: data[data.length - 1]?.volume,
      sales: data[data.length - 1]?.sales_count,
    rank: data[data.length - 1]?.rank,

    })
  }, [data])

  const [coordinates, setCoordinates] = useState([4,4])

	useEffect(
		() => {
			const handleResize = () => {
				chart.applyOptions({ 
          width: getWidth(),
				  height: height,
        });
			};

			const chart = createChart(chartContainerRef.current, {
				layout: {
					background: { type: ColorType.Solid, color: backgroundColor },
					textColor,
				},
        grid: {
          vertLines: {color: 'transparent'},
          horzLines: {color: gridColor},
        },
				width: getWidth(),
				height: height,
        watermark: {
          visible: true,
          fontSize: 36,
          horzAlign: 'center',
          vertAlign: 'center',
          color: watermarkColor,
          text: 'spec.science',
        },
			});
			chart.timeScale().fitContent();
      chart.priceScale("right").applyOptions({
        scaleMargins: {
          top: 0.05,
          bottom: 0.1
        }
      })

      chart.subscribeCrosshairMove(param => {
        if (
          param === undefined || 
          param.time === undefined || 
          param.point.x < 0 || 
          param.point.x > getWidth() || 
          param.point.y < 0 || 
          param.point.y > height
        ) {
          setLegend({
            price: data[data.length - 1]?.value, 
            volume: data[data.length - 1]?.volume,
            sales: data[data.length - 1]?.sales_count,
            rank: data[data.length - 1]?.rank,
          })   
        } else {
          const price = param.seriesPrices.get(newSeries);
          const volume = param.seriesPrices.get(volumeSeries);
          const sales = param.seriesPrices.get(salesSeries);
          const rank = param.seriesPrices.get(rankSeries);
          
          // console.log(volume)

          setLegend({
            price,
            volume,
            sales,
            rank
          })
          // setCoordinates([param.point.x, param.point.y])
        }

      })

			const newSeries = chart.addAreaSeries({ lineColor, topColor: areaTopColor, bottomColor: areaBottomColor, title: 'ETH' });
			const volumeSeries = chart.addHistogramSeries({
        color: volumeColor,
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '',
        scaleMargins: {
          top: 0.75,
          bottom: 0.01,
        },
      });
			const salesSeries = chart.addHistogramSeries({
        color: "#CAE7B955",
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: 'sales',
        scaleMargins: {
          top: 0.75,
          bottom: 0.01,
        },
      });
			const rankSeries = chart.addHistogramSeries({visible: false});
      
      rankSeries.setData(data.map(({time, rank}) => ({time, value: rank})))
      salesSeries.setData(data.map(({time, sales_count}) => ({time, value: sales_count})));
      volumeSeries.setData(data.map(({time, volume}) => ({time, value: volume})))
      newSeries.setData(data)

			window.addEventListener('resize', handleResize);

			return () => {
				window.removeEventListener('resize', handleResize);

				chart.remove();
			};
		},
		[data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor, gridColor, volumeColor, height, watermarkColor]
	);

	return <Box pos='relative'>
    <Stack minW="3xs" p="2" rounded="lg" bg={useColorModeValue("blackAlpha.50", "whiteAlpha.50")} color={useColorModeValue("black","white")} zIndex={99} pos="absolute" top={coordinates[1]} left={coordinates[0]}>
      <Text>{collection.name}</Text>
      <Text>floor: {abbrNum(legend.price)}</Text>
      <Text>vol: {abbrNum(legend.volume)}</Text>
      <Text>sales: {legend.sales}</Text>
      <Text>rank: {legend.rank}</Text>
    </Stack>
		<div
			ref={chartContainerRef}

		/>
  </Box>
}

export default ChartComponent;