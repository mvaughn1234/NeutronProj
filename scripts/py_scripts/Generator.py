import os
import random
from shutil import copy
from Props import Props
from functools import reduce


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

        self.matLines = []
        self.lenLines = []
        self.destFileName = ''
        self.logFileName = ''

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

    def store(self, accumulatedMatsDB):
        pass

    def run(self, lock, sem):
        lock.acquire(True)
        baseRun = self.dirProps['baseRun']
        curRoot = self.dirProps['pyScRoot']
        resultsRoot = self.dirProps['resRoot']
        try:
            baseRunFile = open(baseRun, "r")
        except IOError:
            print(IOError.message)
            print('Couldn\'t open base run file {}.', self.dirProps['baseRun'])
        tempFileName = curRoot + '/' + str(random.randint(0, 99999999999)) + ".mac"
        tempFileName2 = curRoot + '/' + str(random.randint(0, 99999999999)) + ".mac"
        destFilePath = resultsRoot + '/' + '_'.join(self.mats[0] + '/' + str(self.lengths[0]) + '/')
        if not os.path.exists(destFilePath):
            os.makedirs(destFilePath)
        self.destFileName = resultsRoot + '/' + '_'.join(
            (self.mats[0] + '/' + str(self.lengths[0]) + '/' + self.mats[0] + '_' + str(self.lengths[0]) + '_' + str(
                self.energy)).split('.')) + '.root'
        self.logFileName = curRoot + '/' + '_'.join(
            (self.mats[0] + '_' + str(self.lengths[0]) + '_' + str(self.energy)).split('.')) + '_log.out'
        copy(self.dirProps['baseRun'], tempFileName)
        srcRunFile = open(tempFileName, "r")
        dstRunFile = open(tempFileName2, "w+")
        lock.release()
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

        os.remove(tempFileName2)
        os.remove(self.destFileName)
        os.remove(self.logFileName)
        print("done " + str(os.getpid()))
        sem.release()
