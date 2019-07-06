import numpy as np
import csv
import matplotlib as mpl
mpl.use('Agg')
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from matplotlib import cm
import sys
import math

scriptsDir = "./../"
resultsDir = scriptsDir + "./../results/"
pyScriptsDir = scriptsDir+"./py_scripts"
rbScriptsDir = scriptsDir+"./rb_scripts"
plotDir = resultsDir+"./plots/"
data = np.loadtxt(open(sys.argv[1],"rb"),delimiter=",")
if len(data[1,:]) > 2:
    xs = np.logspace(-3,math.log10(14.1),30)
    ys = xs
    X,Y = np.meshgrid(xs,ys)
    fig = plt.figure()
    ax = fig.add_subplot(111,projection='3d')
    ax.view_init(15,0)
    colors = cm.jet
    for i in range(30):
        ax.plot_wireframe(np.log10((X[:,i])),np.log10(Y[:,i]),data[:,i])
        # plt.plot(data)
        plt.ylabel("Number of Neutrons")
        plt.xlabel("Energy of Neutrons (MeV)")
    plt.savefig(sys.argv[2])
else:
    plt.plot(data[:,0],data[:,1])
    plt.ylabel("Number of Neutrons")
    plt.xlabel("Energy of Neutrons (MeV)")
    plt.savefig(sys.argv[2])