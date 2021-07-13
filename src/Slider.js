import React, { useState, useEffect } from 'react';
import { Col } from 'react-bootstrap';
import uuid from 'react-uuid'

import fan from './images/fan.png'; 
import pump from './images/pump.png';

function Slider(props) {
	const { deviceId, defaultValue, api, name, type, show } = props;
	const [ value, setValue ] = useState(defaultValue);
	const [ sliderId ] = useState(`slider-${uuid()}`);
	const [ initialized, setInitialized] = useState(false);

	const img = (type === 'Fan') ? fan : pump;


	function drag(e) {
		// setValue(value + (dragStartY.current - e.clientY) / 500);
		// console.log((dragStartY.current - e.clientY) / 500);
		// dragStartY.current = e.clientY;
		// const currentY = document.getElementById(sliderId).getBoundingClientRect().y;
		// setValue(value + (e.clientY - currentY) / 500);

		const bound = document.getElementById(sliderId).getBoundingClientRect();
		setValue(Math.max(Math.min((bound.bottom - e.clientY) / 5, 100), 0));
	}

	function dragStart(e) {
		var img = document.createElement('img');
		img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

		e.dataTransfer.setDragImage(img, 0, 0);

		// const bound = document.getElementById(sliderId).getBoundingClientRect();
		// setValue((bound.bottom - e.clientY) / 5);
	}

	function dragLeave(e) {
		const bound = document.getElementById(sliderId).getBoundingClientRect();
		
		if (e.clientY > bound.bottom) {
			setValue(0);
		} else if (e.clientY > bound.top) {
			setValue(100);
		}
	}

	function dragEnd(e) {
		fetch(`${api}?id=${deviceId}&value=${value}`).then(res => res.json()).then(data => {
            console.log(data);
        });
	}

	function click(e) {
		const bound = document.getElementById(sliderId).getBoundingClientRect();
		const newValue = (bound.bottom - e.clientY) / 5;
		setValue(newValue);

		fetch(`${api}?id=${deviceId}&value=${newValue}`).then(res => res.json()).then(data => {
            console.log(data);
        });
	}

	useEffect(() => {
		if (!initialized) {
			fetch(`/get?id=${deviceId}`).then(res => res.json()).then(data => {
	            setValue(data.value);
	        });	
			setInitialized(true);
		}
	});

	return (
		<div className="Control-container device" id={deviceId} style={{display: show ? 'block' : 'none' }}>
			<img src={img} className="Control-image" alt={type} />
			<div className="Control-description">{name}</div>
			<Col className="Slider-container" draggable="true" onClick={click} onDragStart={dragStart} onDrag={drag} onDragLeave={dragLeave} onDragEnd={dragEnd}>
				<div className="Slider">
					<div id={sliderId} className="Slider-inner" style={{height: value + "%"}}/>
					<span>{Math.round(value)}</span>
				</div>
			</Col>
		</div>
	);
}

Slider.defaultProps = {
	defaultValue: 50,
	api: '/set',
	type: 'Fan'
}

export default Slider;