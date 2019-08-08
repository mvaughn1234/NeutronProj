import numpy as np
import pandas as pd
import os

class BruteForce:
    def __init__(self, analysisData, lock):
        self.analysisData = analysisData
        self.lock = lock


    def generateListOfCombinations(self):
        lock = self.lock
        lock.acquire(True)
        matNames = self.analysisData.matNames
        mats = self.analysisData.mats
        matDict = self.analysisData.matDict
        lock.release()




    def processData(self, matCombinationIndices, listOfMatCombinations):
        lock = self.lock
        lock.acquire(True)
        eIn = np.ndarray(self.analysisData.eIn)
        eDes = np.ndarray(self.analysisData.eDes)
        lock.release()
        for matCombinationIdx in matCombinationIndices:
            eOut = np.multiply(listOfMatCombinations[matCombinationIdx].data,eIn)
            diff = np.subtract(eOut,eDes)
            diffNorm = np.norm(diff)
            curMats = listOfMatCombinations[matCombinationIdx]
            lock.acquire(True)
            if diffNorm < self.analysisData.curDiff:
                self.analysisData.eOut = eOut
                self.analysisData.curDiff = diffNorm
                self.analysisData.curMats = curMats
            if not self.analysisData.running:
                lock.release()
                return -1
            lock.release()
        return 0

    def run(self):
        matCombinationIndices, listOfMatCombinations = self.generateListOfCombinations()
        processed = self.processData(matCombinationIndices, listOfMatCombinations)
        if processed == -1:
            print('stopped')
        else:
            print('done')