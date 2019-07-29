from multiprocessing import Process, Lock, Semaphore
from Generator import Generator
import sys
import json
from Props import Props

# Retrieve JSON config path from ARGV[1]
# Load config
# extract config details
# create prop objects
# create gen objects & pass each prop object
# run all gen objects together
configs = None;

def createProps():
    print('configs: ', configs)

def createGenerator(props):
    generator = Generator(props)
    return generator

def runGenerators(generators,procCount):
    sharedSem = Semaphore(procCount)
    sharedLock = Lock()
    for i in range(0, 3):
        Process(target=generators[i].run, args=(sharedLock, sharedSem,)).start()


if __name__ == '__main__':
    if sys.argv:
        configsPath = sys.argv[:2]
        print('path: ', sys.argv[:2])
        with open(configsPath,'r') as readFile:
            configs = json.load(readFile)
        propSets = createProps()

    else:
        print('Need to pass carbon path of config file')
