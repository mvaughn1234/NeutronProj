import os
import random
from shutil import copy
from Props import Props

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
        self.destFileName = properties.destFileName
        self.logFile = properties.logFile
        self.dirProps = properties.dirProps
        self.procCount = properties.procCount

        self.matLines = []
        self.lenLines = []


    def genLines(self):
        for i in range(0, len(self.mats)):
            self.matLines.insert(0, ('/testhadr/det/setMat{} {}\n'.format(i+1, self.mats[i])))

        for i in range(0, len(self.lengths)):
            self.lenLines.insert(0, ('/testhadr/det/setRadius{} {} cm\n'.format(i+1, self.lengths[i])))

    def editRunFile(self, src, dst):
        matLinesConcat = self.matLines.reduce(lambda acc, curr : curr+acc, self.matLines)
        lenLinesConcat = self.matLines.reduce(lambda acc, curr : curr+acc, self.lenLines)
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
        try:
            baseRunFile = open(self.dirProps['baseRun'],"r")
        except IOError:
            print(IOError.message)
            print('Couldn\'t open base run file {}.', self.dirProps.baseRun)
        tempFileName = str(random.randint(0,99999999999))+".run"
        tempFileName2 = str(random.randint(0,99999999999))+".run"
        copy('run.mac',tempFileName)
        srcRunFile = open(tempFileName,"r")
        dstRunFile = open(tempFileName2,"w+")
        lock.release()
        self.genLines()
        self.editRunFile(srcRunFile,dstRunFile)
        os.remove(tempFileName)
        sem.acquire(True)
        print("Running Test: " + self.destFileName + " -- " + str(os.getpid()))
        # os.system(self.dirProps['buildDir']+"Hadr06 "+self.destFileName+" > "+self.logFile)

        # Do long thing to test process handling:
        j = 0
        for i in range(0,99999999):
            j += 1

        os.remove(tempFileName2)
        print("done " + str(os.getpid()))
        sem.release()