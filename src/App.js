import React, { useState, useRef } from 'react';
import LineChart from './LineChart';
import Slider from './Slider'
import './App.css';
import './bootstrap.min.css';
import { Container, Row, Col, Modal } from 'react-bootstrap'; 

import close from './images/close.png';

function App() {
  function toggleModal(e) {
    if (showModal) {
      setShowModal(false);
    } else {
      const selectedBlock = e.currentTarget.children[0].getAttribute('block-id');

      const val = devices.current.reduce((obj, item) => {
        obj[item.id] = (devicesList[selectedBlock].includes(item.id)) ? true : false;
        return obj;
      }, {});
      console.log(devicesList);
      console.log(val);
      setShowDevice(val);

      setShowModal(true);
    }
  }

  const devices = useRef([
    {
      'id': 'f1',
      'name': 'Fan 1',
      'type': 'Fan'
    },
    {
      'id': 'p1',
      'name': 'Pump 1',
      'type': 'Pump'
    },
    {
      'id': 'p2',
      'name': 'Pump 2',
      'type': 'Pump'
    }
  ]);

  const blocks = useRef([
    [
      {
        'id': 'temperature',
        'columns': 9,
        'dataSource': '/temperature',
        'refreshInterval': 1,
        'devices': ['p1', 'p2']
      },
      {
        'id': 'pm25',
        'columns': 3,
        'dataSource': '/pm25',
        'refreshInterval': 1,
        'devices': ['f1', 'p2']
      }
    ],
    [
      {
        'id': 'temperature_2',
        'columns': 5,
        'dataSource': '/temperature',
        'refreshInterval': 4,
        'devices': ['f1', 'p1', 'p2']
      },
      {
        'id': 'pm25_2',
        'columns': 7,
        'dataSource': '/pm25',
        'refreshInterval': 5,
        'devices': ['f1']
      }
    ]
  ]);

  const devicesList = blocks.current.reduce((obj, item) => {
    return obj.concat(item);
  }).reduce((obj, item) => {
    obj[item.id] = item.devices;
    return obj;
  }, {});


  const [ showModal, setShowModal ] = useState(false);
  const [ showDevice, setShowDevice ] = useState(devices.current.reduce((obj, item) => {
    obj[item.id] = true;
    return obj;
  }, []));

  return (
    <Container>
      {blocks.current.map((row, i) => {
        const m = (i === 0) ? "mt-0" : "mt-4";
        return (<Row className={m}>
          {row.map((item) => {
            return (
            <Col xs={item.columns} onClick={toggleModal}>
              <LineChart id={item.id} dataSource={item.dataSource} refreshInterval={item.refreshInterval}/>
            </Col>)
          })}
        </Row>)
      })}

      <Modal show={showModal} dialogClassName="modal-fullscreen">
        <Modal.Body>
          <Container fluid>
            <Row className="Slider-row gx-5">
              {
                devices.current.map((device) => {
                  return (
                    <Slider show={showDevice[device.id]} deviceId={device.id} name={device.name} type={device.type} />
                  )
                })
              }
            </Row>
          </Container>
        </Modal.Body>
        <img className="Close-button" src={close} onClick={toggleModal} alt="Close" />
      </Modal>
  </Container>
  );
}

export default App;