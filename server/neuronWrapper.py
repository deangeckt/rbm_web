import neuron
from neuron import h
# from matplotlib import pyplot
import numpy as np
# from pylab import *
# h.celsius = 37


def run():
    cell = h.Section()  # create a section (cable)
    cell.insert('hh')  # insert a Hodgkin-Huxley channel
    vrec = h.Vector()  # setup recording Vectors
    trec = h.Vector()
    vrec.record(cell(0.5)._ref_v)  # record voltage from middle (0.5) of the Section
    trec.record(h._ref_t)  # record time variable

    h.finitialize(-60)  # voltage at initialization, in mV
    h.dt = 0.025  # 0.025 millisecond timestep
    neuron.run(100)  # run simulation for 1000 milliseconds
    return {'time': np.array(trec).tolist(), 'volt': np.array(vrec).tolist()}

# plot(np.array(trec),np.array(vrec)) # plot the output using matplotlib
# xlim((0,h.tstop))
# xlabel('Time (ms)')
# ylabel('v(0.5)')
# show()
# print(run())