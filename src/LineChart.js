import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import uuid from 'react-uuid'
import getColors from './Colors'

import './index.css';

function LineChart(props) {
    const { dataSource, width, height, refreshInterval, id, theme } = props;
    const [ containerId ] = useState(`container-${uuid()}`);
    const valueWidth = useRef(0.0);

    const Y_PAD_TOP_HEIGHT = 150;
    const Y_PAD_BOTTOM_RANGE_PCT = 0.2;

    function updateValueWidth(el) {
        const currentValueWidth = el._groups[0][0].getBoundingClientRect().width;
        if (currentValueWidth > valueWidth.current) {
            valueWidth.current = currentValueWidth;
        }
    }

    function getBlockTrueDimensions() {
        function repl(a, b) {
            return (typeof a === "string" && a === '100%') ? b : a;
        }

        const div = d3.select(`#${containerId}`)._groups[0][0].getBoundingClientRect();
        return {width: repl(width, div.width), height: repl(height, div.height)};
    }

    function getScales(data) {
        const yMinValue = d3.min(data, d => d.value);
        const yMaxValue = d3.max(data, d => d.value);
        const xMinValue = d3.min(data, d => d.label);
        const xMaxValue = d3.max(data, d => d.label);
        const yRange = yMaxValue - yMinValue;

        const dims = getBlockTrueDimensions();

        const xScale = d3
            .scaleLinear()
            .domain([xMinValue, xMaxValue])
            .range([0, dims.width]);
        const yScale = d3
            .scaleLinear()
            .domain([yMinValue - yRange * Y_PAD_BOTTOM_RANGE_PCT, yMaxValue])
            .range([dims.height - 10, Y_PAD_TOP_HEIGHT]);

        return {x: xScale, y: yScale};
    }

    function drawChart(x) {
        d3.select(`#${containerId}`)
            .select('svg')
            .remove();

        const data = x.data;
        const scales = getScales(data);
        
        const svg = d3
            .select(`#${containerId}`)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g');

        const dims = getBlockTrueDimensions();

        svg.append("text")
            .attr("y", 35)
            .attr("x", 20)
            .attr('text-anchor', 'start')
            .attr("class", "Line-chart-label")
            .text(x.label);

        const valueText = svg.append("text")
            .attr("y", 95) //magic number here
            .attr("x", 20)
            .attr('text-anchor', 'start')
            .attr("class", "Line-chart-value")
            .text(x.currentValue);

        updateValueWidth(valueText);

        const colors = getColors(theme, props);

        if (props.fill) {
            const area = d3.area()
                .x(d => scales.x(d.label))
                .y0(d => scales.y(d.value))
                .y1(d => dims.height)
                .curve(d3.curveMonotoneX);

            svg.append("defs")
                .append("linearGradient")
                .attr("id", `area-gradient-${containerId}`)
                .attr("x1", 0).attr("y1", 0)
                .attr("x2", 0).attr("y2", 1)
                .selectAll("stop")
                .data([{
                        offset: "0%",
                        color: colors.fillColorTop
                    },
                    {
                        offset: "100%",
                        color: colors.fillColorBottom
                    }
                ])
                .enter()
                .append("stop")
                .attr("offset", function(d) {
                    return d.offset;
                })
                .attr("stop-color", function(d) {
                    return d.color;
                });

            svg.append("path")
                .datum(data)
                .attr("class", "area")
                .attr("d", area)
                .style("fill", `url(#area-gradient-${containerId})`);
        }

        const line = d3
            .line()
            .x(d => scales.x(d.label))
            .y(d => scales.y(d.value))
            .curve(d3.curveMonotoneX);

        svg.append("text")
            .attr("y", 60)
            .attr("x", 20 + valueWidth.current)
            .attr('text-anchor', 'start')
            .attr("class", "Line-chart-unit")
            .text(x.unit);

        svg
            .append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', colors.lineColor)
            .attr('stroke-width', 5)
            .attr('class', 'line')
            .attr('d', line);
    }

    useEffect(() => {
        setInterval(() => {
            fetch(dataSource).then(res => res.json()).then(data => {
                drawChart(data);
            });
        }, refreshInterval * 1000);

      fetch(dataSource).then(res => res.json()).then(data => {
          drawChart(data);
      });
    }, [dataSource, refreshInterval]);

    return <div id={containerId} className="Line-chart h-100 w-100" block-id={id} /> ;
}

LineChart.defaultProps = {
    height: 250,
    width: "100%",
    theme: null,
    refreshInterval: 5,
    fill: true,
    lineColor: '#399af7',
    fillColorTop: '#cbe6fd',
    fillColorBottom: '#dcf0fe'
}

export default LineChart;