import os
import json
import re
import sys
from shutil import copy
from Props import Props
from functools import reduce
from mongoengine import connect
import requests


class Generator:
    procCount = 2

    def __init__(self, properties=None):
        if properties is None:
            properties = Props()

        self.mats = properties.mats
        self.energy = properties.energy
        self.lengths = properties.lengths
        self.printProg = properties.printProg
        self.beamOn = properties.beamOn
        self.dirProps = properties.dirProps
        self.procCount = properties.procCount
        self.energyMin = properties.energyMin
        self.energyMax = properties.energyMax
        self.numBins = properties.numBins
        self.scale = properties.scale

        self.matLines = []
        self.lenLines = []
        self.destFileName = ''
        self.logFileName = ''

        self.url = 'https://localhost:5000/api/v1/matDB'

    def genLines(self):
        for i in range(0, len(self.mats)):
            self.matLines.insert(0, ('/testhadr/det/setMat{} {}\n'.format(i + 1, self.mats[i])))

        for i in range(0, len(self.lengths)):
            self.lenLines.insert(0, ('/testhadr/det/setRadius{} {} cm\n'.format(i + 1, self.lengths[i])))

    def editRunFile(self, src, dst):
        matLinesConcat = reduce(lambda acc, curr: curr + acc, self.matLines)
        lenLinesConcat = reduce(lambda acc, curr: curr + acc, self.lenLines)
        replace = {'/testhadr/det/setMat\n': matLinesConcat,
                   '/testhadr/det/setRadius\n': lenLinesConcat,
                   '/gun/energy\n': '/gun/energy {} MeV\n'.format(self.energy),
                   '/analysis/setFileName\n': '/analysis/setFileName {}\n'.format(self.destFileName),
                   '/analysis/setFileName\n': '/analysis/setFileName {}\n'.format(self.destFileName),
                   '/run/printProgress\n': '/run/printProgress {}\n'.format(self.printProg),
                   '/run/beamOn\n': '/run/beamOn {}\n'.format(self.beamOn)
                   }
        for line in src:
            if replace.keys().__contains__(line):
                dst.write(replace[line])
            else:
                dst.write(line)
        src.close()
        dst.close()

    def Merge(self, dict1, dict2):
        return dict1.update(dict2)

    def store(self, data, length, energy, dbFile):
        db = connect('test',
                     'mongodb+srv://dbuser:Password@cluster0-zehp8.mongodb.net/test?retryWrites=true&w=majority');

        currentRunData = {'eIn': self.energy, 'eOut': []}
        i = 0
        with open(data, 'r') as asciiFile:
            for line in asciiFile:
                matches = re.findall('(\-?\d+\.\d+e[\-\+]\d+)', line)
                if matches:
                    currentRunData['eOut'].append(float(matches[1]))
                    i += 1

        print('data: ', currentRunData)

        url = self.url + 'api/v1/matDB/' + self.mats[0] + '/' + str(self.lengths[0]) + '/add'
        mat = requests.put(url, currentRunData)
        print('req: ' + mat.json())

    def run(self, lock, sem):
        # sys.stdout = open(str(os.getpid()) + ".out", "a", buffering=0)
        # sys.stderr = open(str(os.getpid()) + "_error.out", "a", buffering=0)

        baseRun = self.dirProps['baseRun']
        curRoot = self.dirProps['pyScRoot']
        resultsRoot = self.dirProps['resRoot']
        try:
            baseRunFile = open(baseRun, "r")
        except IOError:
            print(IOError.message)
            print('Couldn\'t open base run file {}.', self.dirProps['baseRun'])
        baseFileName = '-'.join(
            (self.mats[0] + '_' + str(self.lengths[0]) + '_' + str(self.energy)).split('.'))
        tempFileName = curRoot + '/' + baseFileName + "_temp.mac"
        tempFileName2 = curRoot + '/' + baseFileName + "_final.mac"
        destFilePath = resultsRoot + '/' + '-'.join((self.mats[0] + '/' + str(self.lengths[0]) + '/').split('.'))
        if not os.path.exists(destFilePath):
            os.makedirs(destFilePath)
        self.destFileName = destFilePath + baseFileName + '.root'
        self.logFileName = curRoot + '/' + baseFileName + '_log.out'
        lock.acquire(True)
        copy(self.dirProps['baseRun'], tempFileName)
        lock.release()
        srcRunFile = open(tempFileName, "r")
        dstRunFile = open(tempFileName2, "w+")
        self.genLines()
        self.editRunFile(srcRunFile, dstRunFile)
        os.remove(tempFileName)
        sem.acquire(True)
        print("Running Test: " + self.destFileName + " -- " + str(os.getpid()))
        os.system(self.dirProps['buildDir'] + "/Hadr06 " + tempFileName2 + " > " + self.logFileName)

        # # Do long thing to test process handling:
        # j = 0
        # for i in range(0,99999999):
        #     j += 1

        # os.remove(self.destFileName)
        # os.remove(self.logFileName)
        dbFile = resultsRoot + '/' + self.mats[0] + '/' + self.mats[0] + '_' + str(self.beamOn) + '_' + '-'.join((str(
            self.energyMin) + '_' + str(self.energyMax) + '_' + str(self.numBins) + '_' + '@' + self.scale).split(
            '.')) + '.json'
        data = destFilePath + baseFileName + '.ascii'
        self.store(data, str(self.lengths[0]), str(self.energy), dbFile)
        print("done " + str(os.getpid()))
        print("Done material :: file location: ", dbFile);
        sem.release()
        # os.remove(tempFileName2)
