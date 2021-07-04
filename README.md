# rbm_web
This software wraps Neuron software (https://neuron.yale.edu/neuron/)
and provides easy to use GUI.

# features
- visualize, edit, import and export swc files in 2D.
- full simulation: from user paramets (e.g mechanism, process etc) to plots.
- brute force - search for a set of parameters by specifying the ouput plot result.
- heatmap animation.
- session management: export and import session files to manage your simulations.
- continue to work on python: looking for complex simulations and other neuron features, you can load exported seassion / plots to our python app. 
  we also added a complexParams.py under server folder with an example of a more complex parameter settings, its for you to change!

# examples
- find a section by using the tree and navigation 
![image](https://user-images.githubusercontent.com/24900065/119366961-296ed380-bcba-11eb-908c-41193990820e.png)

- edit a single section or multiple sections parameters
![image](https://user-images.githubusercontent.com/24900065/119367447-a1d59480-bcba-11eb-87ed-498b50af3ce5.png)

- simulate and view the results in a plot
![image](https://user-images.githubusercontent.com/24900065/119367674-de08f500-bcba-11eb-9bdc-d9f89081a413.png)

- simulate and view the results in a heatmap animation

![anim](https://user-images.githubusercontent.com/24900065/119368763-152bd600-bcbc-11eb-98c6-ec6f9054b975.gif)

- brute force:
1. specify the output plot - using draw or import a 2d vector
  ![bf_draw](https://user-images.githubusercontent.com/24900065/121807221-eae68c00-cc5b-11eb-802d-849a39ba9022.JPG)
  
2. specify the parameters, e.g: diam of axon[0] will range from 0 to 90 (can change as much you like)

3. explore the results
  ![bf_res](https://user-images.githubusercontent.com/24900065/121807402-a27b9e00-cc5c-11eb-8f33-87a42c5e3beb.JPG)



# install
- client:
  install node/npm: https://nodejs.org/en/download/
- server:
  install python 3.7+
  pip install -r requirements

# Run
- client:
  * first time and on every git pull run on cmd: 'npm install' in app/ dir
  * run on cmd: 'npm start' in app/ dir
- server:
  * edit server/config.py with path to swc file and neuron folder
  * run 'python app.py' in server/ dir or use an IDE and start app.py
 
note: in the beta version we run locally both the client and backend so we suggest closing other application running on localhost (port 8080).
