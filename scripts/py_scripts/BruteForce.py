import numpy as np
import requests
import json
from itertools import permutations
import sys
from types import ModuleType, FunctionType
from gc import get_referents
from pympler import asizeof

# Custom objects know their class.
# Function objects seem to know way too much, including modules.
# Exclude modules as well.
BLACKLIST = type, ModuleType, FunctionType


def getsize(obj):
    """sum size of object & members."""
    if isinstance(obj, BLACKLIST):
        raise TypeError('getsize() does not take argument of type: '+ str(type(obj)))
    seen_ids = set()
    size = 0
    objects = [obj]
    while objects:
        need_referents = []
        for obj in objects:
            if not isinstance(obj, BLACKLIST) and id(obj) not in seen_ids:
                seen_ids.add(id(obj))
                size += sys.getsizeof(obj)
                need_referents.append(obj)
        objects = get_referents(*need_referents)
    return size


class NDArrayEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)


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
        lock.release()
        matTables = {}
        matTables2 = {}
        for mat in matDict:
            temp = None
            temp2 = None
            for length in matDict[mat]:
                tempSub = []
                tempSub2 = []
                for eIn in sorted(matDict[mat][length]):
                    enSet = matDict[mat][length][eIn]
                    arr = np.array([float(value) for (key, value) in sorted(matDict[mat][length][eIn].items())])
                    arr2 = np.hstack(
                        [np.fliplr(np.array(sorted(matDict[mat][length][eIn].items()))),
                         np.ones((len(arr), 1)) * length,
                         np.array(mat).repeat(30).reshape(30, 1)])
                    arr2[:, 0] = np.ndarray.astype(
                        np.ndarray.astype(arr2[:, 0], dtype=float) / np.sum(np.ndarray.astype(arr2[:, 0], dtype=float)),
                        dtype=arr2.dtype)
                    tempSub.append(arr)
                    tempSub2.append(arr2)
                tempSub3 = np.transpose(np.array(tempSub))
                tempSub4 = np.transpose(np.array(tempSub2))
                if (temp):
                    temp = np.concatenate((temp, tempSub3))
                else:
                    temp = tempSub3
                if (temp2):
                    temp2 = np.concatenate((temp2, tempSub4))
                else:
                    temp2 = tempSub4
                # temp[length] = np.ndarray(np.shape(temp3),buffer=temp3)
                # temp[]
            matTables[mat] = temp
            matTables2[mat] = temp2

        tempName = list(matTables2.keys())[0]
        numBins = np.shape(matTables2[tempName][0])[0]
        temp = np.ndarray.copy(matTables2[tempName])
        galactic = temp
        galactic[0] = np.eye((numBins))
        galactic[2] = np.ones((numBins, numBins))
        galactic[3][temp[3] == tempName] = 'Galactic'

        matPerms = None
        for i in range(1, len(matNames) + 1, 1):
            temp = np.array(list(permutations(matNames, i)))
            tempNd = np.ndarray(np.shape(temp), dtype=temp.dtype, buffer=temp)
            if (i == 1):
                tempNd2 = np.hstack([tempNd, np.array(['Galactic']).repeat(
                    (len(matNames) - np.shape(tempNd)[1]) * np.shape(tempNd)[0]).reshape(np.shape(tempNd)[0],
                                                                                         len(matNames) -
                                                                                         np.shape(tempNd)[1])])

                matPerms = tempNd2
            else:
                tempNd2 = np.hstack([tempNd, np.array(['Galactic']).repeat(
                    (len(matNames) - np.shape(tempNd)[1]) * np.shape(tempNd)[0]).reshape(np.shape(tempNd)[0],
                                                                                         len(matNames) -
                                                                                         np.shape(tempNd)[1])])
                matPerms = np.vstack([matPerms, tempNd2])

        extended = np.ndarray((np.shape(matPerms)[0], np.shape(matPerms)[1], 4, 30, 30),
                              dtype=matTables2[list(matTables2.keys())[0]].dtype)
        for mat in matNames:
            extended[matPerms == mat] = matTables2[mat]
        extended[matPerms == 'Galactic'] = galactic

        r = list(range(0, np.shape(extended)[2], 1))
        support = np.ndarray((np.shape(extended)[0], 3, 30, 30, np.shape(extended)[2]),
                             dtype=matTables2[list(matTables2.keys())[0]].dtype)
        data = np.ndarray((np.shape(extended)[0], 30, 30), dtype=np.float)
        for i in range(0, np.shape(extended)[0], 1):
            data[i] = np.linalg.multi_dot(np.ndarray.astype(extended[i, :, 0], dtype=float))
            for j in r:
                support[i, 0, :, :, j] = extended[i, j, 1]
                support[i, 1, :, :, j] = extended[i, j, 2]
                support[i, 2, :, :, j] = extended[i, j, 3]

        return data, support

    def processData(self, matCombinationDataCompressed, matCombinationSupportData):
        matList = matCombinationDataCompressed
        supList = matCombinationSupportData
        lock = self.lock
        lock.acquire(True)
        eIn = np.array(self.analysisData.get('eIn'))
        eDes = np.array(self.analysisData.get('eDes'))
        eIn = eIn / np.sum(eIn)
        eDes = eDes / np.sum(eDes)
        lock.release()
        for i in list(range(0, np.shape(matList)[0], 1)):
            eOut = np.dot(matList[i], eIn)
            diff = np.subtract(eOut, eDes)
            diffNorm = np.linalg.norm(diff)
            curSup = supList[i]
            lock.acquire(True)
            if diffNorm < self.analysisData.get('curDiff'):
                self.analysisData.set('eOut', eOut.tolist())
                self.analysisData.set('iteration', i)
                self.analysisData.set('curDiff', diffNorm)
                self.analysisData.set('curMats', curSup.tolist())
                content = self.analysisData.getData()
                url = 'http://10.103.72.187:5000/api/v1/analyzer/' + self.analysisData.get('analyzerID') + '/update'
                requests.put(url, content)

            if not self.analysisData.get('running'):
                lock.release()
                return -1
            lock.release()
        return 0

    def run(self):
        print('start')
        matCombinationDataCompressed, matCombinationSupportData = self.generateListOfCombinations()
        processed = self.processData(matCombinationDataCompressed, matCombinationSupportData)
        if processed == -1:
            print('stopped')
        else:
            self.lock.acquire(True)
            self.analysisData.set('running', False)
            self.lock.release()
            print('done')
