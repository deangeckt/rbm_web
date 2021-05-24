# rbm_web
This software wraps Neuron software (https://neuron.yale.edu/neuron/)
and provides easy to use GUI.

# features:
- visualize, edit, import and export swc files in 2D
- full simulation: from user paramets (e.g mechanism, process etc) to plots
- heatmap animation
- session management: export and import session files to manage your simulations 

# install
- client:
  install node/npm: https://nodejs.org/en/download/
- server:
  install python 

# Run:
- client:
  * first time and on every git pull run on cmd: 'npm install' in app/ dir
  * run on cmd: 'npm start' in app/ dir
- server:
  * edit server/config.py with path to swc file and neuron folder
  * run 'python app.py' in server/ dir or use an IDE and start app.py
