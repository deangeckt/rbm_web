import json
import numpy as np
import matplotlib.pyplot as plt
from Api.schemaConvert import recording_key

# Example using the plots.json - can be downloaded from the simulation web page
if __name__ == "__main__":
    with open('plots.json') as json_file:
        plots = json.load(json_file)

        plt.xlim((0, 100))
        plt.xlabel('Time [mS]')
        plt.ylabel('soma[0](0.5) - Voltage')

        for plot in plots:
            # in this case, the key is the same for all the plots. doesn't have to be.
            r_key = recording_key(recording_type_=0, tid_=1, id_=0, section_=0.5)
            volt_plot = plot['volt']
            plt.plot(np.array(plot['time']), np.array(volt_plot[r_key]))

        plt.show()
