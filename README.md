## Installation
If NodeJS is installed, please skip to the next section.

1. (For MacOS users) If Homebrew is not installed, you can install it by running the following command from the terminal:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. Install NodeJS using homebrew as follows:
```bash
brew install node
```
	

## Running the dashboard
1. Clone the files from this repository (the command below will clone the repository to your Desktop.)
```bash
cd ~/Desktop && git clone https://github.com/leeke2/flask-react-dashboard.git && cd flask-react-dashboard
```
	
2. Install the necessary python packages using `pip`.
```bash
pip install -r api/requirements.txt
```

3. Start the frontend server (NodeJS) using the following command:
```bash
npm start
```

4. Start the backend API server (Flask) using the following command:
```bash
npm run start-api
```

5. You should now be able to access the dashboard at `http://localhost:3000`. Have fun!

## Notes
1. Each device (fan/pump) is given an id and a name (which will be displayed above the slider control). You will also need to indicate the type of device in order to show the correct icons. The devices are defined in the `devices` variable of `src/App.js`.
2. The graphs (blocks) are defined in the `blocks` variable of the same file. The `blocks` variable is an array, whose elements represent different rows of the dashboard. (There are two rows in the example dashboard). Each element in these row arrays represent a single graph.
3. Each graph in the dashboard is associated with a bunch of devices (fans and pumps). For instance if the graph shows the PM2.5 values for the first module, then you can associate only the fans to the graph. You can define the devices associated with each graph in the `devices` attribute of each block.
