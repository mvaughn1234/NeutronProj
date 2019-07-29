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

def createProps(configJSON):
    # geantProps = configJSON['geantProps']
    # procCount = geantProps['numProcs']
    # precision = geantProps['precision']
    # beamOn = geantProps['beamOn']
    # printProg = geantProps['printProg']

    procCount = 20
    precision = 10000
    printProg = 1000
    projRoot = '/home/student/geant4/NeutronProj'
    buildDir = projRoot + '/build'
    scriptsRoot = projRoot+'/scripts'
    pyScriptsRoot = scriptsRoot+'/py_scripts'
    baseRun = pyScriptsRoot+'/run.mac'
    dirProps = {'baseRun': baseRun,
                'pyScRoot': pyScriptsRoot,
                         'buildDir': buildDir}


    propSets = []
    for config in configs:
        print('config: ', config)
        for lenSet in config['config']:
            print('lenset: ', lenSet)
            mats = lenSet['matList']
            lengths = lenSet['lenList']
            energy = lenSet['energy']
            properties = {
                'mats': mats,
                'energy': energy,
                'lengths': lengths,
                'printProg': printProg,
                'beamOn': precision,
                'procCount': procCount,
                'dirProps': dirProps
            }
            prop = Props(properties)
            propSets.append(prop)

    return propSets,procCount



def createGenerator(props):
    generator = Generator(props)
    return generator

def runGenerators(generators, procCount):
    sharedSem = Semaphore(procCount)
    sharedLock = Lock()
    for i in range(0, 3):
        Process(target=generators[i].run, args=(sharedLock, sharedSem,)).start()


if __name__ == '__main__':
    if sys.argv:
        configsPath = sys.argv[1]
        print('path: ', sys.argv[1])
        with open(configsPath,'r') as readFile:
            configs = json.load(readFile)
        propSets,procCount = createProps(configs)
        generators = []
        for propSet in propSets:
            generators.append(createGenerator(propSet))
        runGenerators(generators, procCount)

    else:
        print('Need to pass carbon path of config file')
