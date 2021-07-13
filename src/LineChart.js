import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import uuid from 'react-uuid'

import './index.css';

function LineChart(props) {
    const { dataSource, width, height, refreshInterval, id } = props;
    const [ containerId ] = useState(`container-${uuid()}`);
    const valueWidth = useRef(0.0);

    const Y_PAD_TOP_HEIGHT = 150;
    const Y_PAD_BOTTOM_RANGE_PCT = 0.2;

    useEffect(() => {
        setInterval(() => {
            fetch(dataSource).then(res => res.json()).then(data => {
                drawChart(data);
            });
        }, refreshInterval * 1000);

      fetch(dataSource).then(res => res.json()).then(data => {
          drawChart(data);
      });
    }, [dataSource, valueWidth, refreshInterval]);

    function drawChart(x) {
        const data = x.data;
        d3.select(`#${containerId}`)
            .select('svg')
            .remove();

        const yMinValue = d3.min(data, d => d.value);
        const yMaxValue = d3.max(data, d => d.value);
        const xMinValue = d3.min(data, d => d.label);
        const xMaxValue = d3.max(data, d => d.label);
        const yRange = yMaxValue - yMinValue;

        const svg = d3
            .select(`#${containerId}`)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g');

        const div = d3.select(`#${containerId}`)._groups[0][0].getBoundingClientRect();

        let divWidth = 0;
        let divHeight = 0;
        if (typeof width === 'string' && width === '100%') {
          divWidth = div.width;
        } else {
          divWidth = width;
        }

        if (typeof height === 'string' && height === '100%') {
          divHeight = div.width;
        } else {
          divHeight = height;
        }

        const xScale = d3
            .scaleLinear()
            .domain([xMinValue, xMaxValue])
            .range([0, divWidth]);
        const yScale = d3
            .scaleLinear()
            .range([divHeight - 10, Y_PAD_TOP_HEIGHT])
            .domain([yMinValue - yRange * Y_PAD_BOTTOM_RANGE_PCT, yMaxValue]);
        const line = d3
            .line()
            .x(d => xScale(d.label))
            .y(d => yScale(d.value))
            .curve(d3.curveMonotoneX);

        const area = d3.area()
            .x(d => xScale(d.label))
            .y0(d => yScale(d.value))
            .y1(d => divHeight)
            .curve(d3.curveMonotoneX);

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

        const currentValueWidth = valueText._groups[0][0].getBoundingClientRect().width;
        if (currentValueWidth > valueWidth.current) {
            valueWidth.current = currentValueWidth;
        }

        svg.append("text")
            .attr("y", 60)
            .attr("x", 20 + valueWidth.current)
            .attr('text-anchor', 'start')
            .attr("class", "Line-chart-unit")
            .text(x.unit);

        svg.append("linearGradient")
            .attr("id", "area-gradient")
            .attr("x1", 0).attr("y1", 0)
            .attr("x2", 0).attr("y2", 1)
            .selectAll("stop")
            .data([{
                    offset: "0%",
                    color: "#cbe6fd"
                },
                {
                    offset: "100%",
                    color: "#dcf0fe"
                }
            ])
            .enter().append("stop")
            .attr("offset", function(d) {
                return d.offset;
            })
            .attr("stop-color", function(d) {
                return d.color;
            });

        svg
            .append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', props.lineColor)
            .attr('stroke-width', 10)
            .attr('class', 'line')
            .attr('d', line);

        svg.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", area);
    }
    return <div id={containerId} className="Line-chart h-100 w-100" block-id={id} /> ;
}

LineChart.defaultProps = {
    height: 400,
    width: "100%",
    lineColor: '#399af7'
}

export default LineChart;