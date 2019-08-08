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
        matNames = self.analysisData.get('matsAvailNames')
        mats = self.analysisData.get('matsAvail')
        matDict = self.analysisData.get('matDict')
        matTables = set(map(lambda mat: pd.DataFrame(mat), matDict))
        lock.release()
        a = 0
        return []




    def processData(self, matCombinationIndices, listOfMatCombinations):
        lock = self.lock
        lock.acquire(True)
        eIn = np.ndarray(self.analysisData.get('eIn'))
        eDes = np.ndarray(self.analysisData.get('eDes'))
        lock.release()
        for matCombinationIdx in matCombinationIndices:
            eOut = np.multiply(listOfMatCombinations[matCombinationIdx].data,eIn)
            diff = np.subtract(eOut,eDes)
            diffNorm = np.norm(diff)
            curMats = listOfMatCombinations[matCombinationIdx]
            lock.acquire(True)
            if diffNorm < self.analysisData.get('curDiff'):
                self.analysisData.set('eOut', eOut)
                self.analysisData.set('curDiff', diffNorm)
                self.analysisData.set('curMats', curMats)
            if not self.analysisData.get('running'):
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