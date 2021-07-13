import time
import random
from flask import Flask, request

app = Flask(__name__)

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/temperature')
def get_temperature():
    values = [
        {
            'label': i,
            'value': random.random() * 3 + 28
        }
        for i in range(30)
    ]

    return {
        'label': 'Temperature',
        'unit': '°C',
        'currentValue': f'{values[-1]["value"]:.1f}',
        'data': values
    }

@app.route('/pm25')
def get_pm25():
    values = [
        {
            'label': i,
            'value': random.random() * 50 + 28
        }
        for i in range(30)
    ]

    return {
        'label': 'PM2.5',
        'unit': 'µg/m3',
        'currentValue': f'{values[-1]["value"]:.1f}',
        'data': values
    }

@app.route('/set')
def setValue():
    id_ = request.args.get('id')
    value = request.args.get('value')

    return {'message': f'Success {id_}: {value}'}

@app.route('/get')
def getValue():
    id_ = request.args.get('id')

    return {'device': id_, 'value': random.random() * 100}
