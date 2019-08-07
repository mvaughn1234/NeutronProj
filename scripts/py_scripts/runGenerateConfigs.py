from multiprocessing import Process, Lock, Semaphore
import subprocess
import os
from Generator import Generator
import sys
import json
from mongoengine import connect
from Props import Props


# Retrieve JSON config path from ARGV[1]
# Load config
# extract config details
# create prop objects
# create gen objects & pass each prop object
# run all gen objects together

def createProps(configJSON):
    projRoot = '/home/student/geant4/NeutronProj'
    buildDir = projRoot + '/build'
    resRoot = projRoot + '/results'
    scriptsRoot = projRoot + '/scripts'
    pyScriptsRoot = scriptsRoot + '/py_scripts'
    baseRun = pyScriptsRoot + '/run.mac'
    dirProps = {'baseRun': baseRun,
                'pyScRoot': pyScriptsRoot,
                'buildDir': buildDir,
                'resRoot': resRoot}

    gprops = configJSON[0]['geantProps']
    globalProps = {
        'procCount': gprops['procCount'],
        'beamOn': gprops['precision'],
        'printProg': 1000,
        'energyMin': gprops['energyMin'],
        'energyMax': gprops['energyMax'],
        'numBins': gprops['numBins'],
        'scale': gprops['scale'],
        'dirProps': dirProps
    }

    propSets = []
    for configMatSet in configJSON[1:]:
        for enSet in configMatSet['configs']:
            # print('lenset: ', enSet)
            mats = enSet['matList']
            lengths = enSet['lenList']
            energy = enSet['energy']
            properties = {
                'mats': mats,
                'energy': energy,
                'lengths': lengths,
            }
            properties.update(globalProps)
            prop = Props(properties)
            propSets.append(prop)

    print ('propsJson: ', configJSON)
    print ('propSets: ', propSets)
    return propSets, globalProps['procCount']


def createGenerator(props):
    generator = Generator(props)
    return generator


def runGenerators(generators, procCount):
    sharedSem = Semaphore(procCount)
    sharedLock = Lock()
    for i in range(0, len(generators)):
        Process(target=generators[i].run, args=(sharedLock, sharedSem,)).start()
    print('gen started')


if __name__ == '__main__':
    os.system('G410')
    if sys.argv:
        configsPath = sys.argv[1]
        with open(configsPath, 'r') as readFile:
            configs = json.load(readFile)
        propSets, procCount = createProps(configs)
        generators = []
        for propSet in propSets:
            generators.append(createGenerator(propSet))
        runGenerators(generators, procCount)


    else:
        print('Need to pass carbon path of config file')
