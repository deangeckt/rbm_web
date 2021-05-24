# rbm_web
This software wraps Neuron software (https://neuron.yale.edu/neuron/)
and provides easy to use GUI.

# features:
- visualize, edit, import and export swc files in 2D
- full simulation: from user paramets (e.g mechanism, process etc) to plots
- heatmap animation
- session management: export and import session files to manage your simulations.
- continue to work on python: looking for complex simulations and other neuron features, you can load exported seassion / plots to our python app

# examples:
- find a section by using the tree and navigation 
![image](https://user-images.githubusercontent.com/24900065/119366961-296ed380-bcba-11eb-908c-41193990820e.png)

- edit a single section or multiple sections parameters
![image](https://user-images.githubusercontent.com/24900065/119367447-a1d59480-bcba-11eb-87ed-498b50af3ce5.png)

- simulate and view the results in a plot
![image](https://user-images.githubusercontent.com/24900065/119367674-de08f500-bcba-11eb-9bdc-d9f89081a413.png)

- simulate and view the results in a heatmap animation

![anim](https://user-images.githubusercontent.com/24900065/119368763-152bd600-bcbc-11eb-98c6-ec6f9054b975.gif)


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
