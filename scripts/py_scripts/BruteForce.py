import numpy as np
import requests
import json
from itertools import permutations, product
from functools import reduce
from timeit import default_timer as timer
import sys


class NDArrayEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)


class BruteForce:
    def __init__(self, analysisData, lock):
        self.analysisData = analysisData
        self.lock = lock

    def mult_sets(self, mats, data, mode):
        dataSet = list(map(lambda x: np.squeeze(np.dsplit(data[x], np.shape(data[x])[2])).tolist(), mats))
        dataSet = list(map(lambda x: np.expand_dims(x, 0).tolist() if (len(np.shape(x)) == 2 and np.shape(x)[0] == 30) or (
                    (np.shape(x)[0] == 2) and (len(np.shape(x)) == 1)) else x, dataSet))
        perms = np.squeeze([list(i) for i in product(*dataSet)])
        if (mode == 0):
            perms = list(map(lambda x: np.linalg.multi_dot(np.ndarray.astype(perms[0],dtype=float)),perms))
        else:
            perms = list(perms)
        # else:
        #     perms = list(map(lambda x: np.concatenate(x,1),perms))
        return perms
        # if len(mats) == 1:
        #     ret = data[mats[0]]
        #     ret = np.squeeze(np.dsplit(ret,np.shape(ret)[2])).tolist()
        #     if (len(np.shape(ret)) == 2):
        #         return np.expand_dims(ret,0).tolist()
        #     return ret
        # else:
        #     cur = data[mats[0]]
        #     cur = np.squeeze(np.dsplit(cur, np.shape(cur)[2])).tolist()
        #     if (len(np.shape(cur)) == 2):
        #         cur = np.expand_dims(cur,0).tolist()
        #     deep = self.mult_sets(np.delete(mats,0),data,mode)
        #     prod = np.squeeze([list(i) for i in product(*[cur,deep])]).tolist()
        #     return prod

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
                tempSub2 = [length, mat]
                for eIn in sorted(matDict[mat][length]):
                    enSet = matDict[mat][length][eIn]
                    enSet_sorted = sorted([(float(i), float(j)) for (i, j) in matDict[mat][length][eIn].items()])
                    arr = np.array([float(value) for (key, value) in enSet_sorted])
                    arr = arr / np.sum(arr)
                    # arr2 = np.hstack(
                    #     [np.fliplr(np.array(enSet_sorted)),
                    #      np.ones((len(arr), 1)) * length,
                    #      np.array(mat).repeat(30).reshape(30, 1)])
                    # arr2[:, 0] = np.ndarray.astype(
                    #     np.ndarray.astype(arr2[:, 0], dtype=float) / np.sum(np.ndarray.astype(arr2[:, 0], dtype=float)),
                    #     dtype=arr2.dtype)
                    tempSub.append(arr)
                    # tempSub2.append(arr2)
                tempSub3 = np.transpose(np.array(tempSub))
                tempSub4 = np.transpose(np.array(tempSub2))
                if (temp is None):
                    temp = tempSub3
                else:
                    temp = np.dstack([temp, tempSub3])
                if (temp2 is None):
                    temp2 = tempSub4
                else:
                    temp2 = np.dstack([temp2, tempSub4])
                # temp[length] = np.ndarray(np.shape(temp3),buffer=temp3)
                # temp[]
            matTables[mat] = temp
            matTables2[mat] = temp2

        tempName = list(matTables.keys())[0]
        numBins = np.shape(matTables[tempName])[0]
        matTables['Galactic'] = np.expand_dims(np.eye(numBins),2)
        matTables2['Galactic'] = np.expand_dims(np.array([[1,'Galactic']]),2)

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

        # extended = np.ndarray((np.shape(matPerms)[0], np.shape(matPerms)[1], 4, 30, 30),
        #                       dtype=matTables2[list(matTables2.keys())[0]].dtype)
        # for mat in matNames:
        #     extended[matPerms == mat] = matTables2[mat]
        # extended[matPerms == 'Galactic'] = galactic
        #
        # r = list(range(0, np.shape(extended)[2], 1))
        # support = np.ndarray((np.shape(extended)[0], 2, np.shape(extended)[2]),
        #                      dtype=matTables2[list(matTables2.keys())[0]].dtype)
        # data = np.ndarray((np.shape(extended)[0], 30, 30), dtype=np.float)
        # for i in range(0, np.shape(extended)[0], 1):
        #     data[i] = np.linalg.multi_dot(np.ndarray.astype(extended[i, :, 0], dtype=float))
        #     for j in r:
        #         support[i, 0, j] = extended[i, j, 2, 0, 0]
        #         support[i, 1, j] = extended[i, j, 3, 0, 0]
        lock.acquire(True)
        eIn = np.array(self.analysisData.get('eIn'))
        eDes = np.array(self.analysisData.get('eDes'))
        eIn = eIn / np.sum(eIn)
        eDes = eDes / np.sum(eDes)
        lock.release()
        # data = None
        # support = None
        t = [0,0]
        s = timer()
        for i in range(0, np.shape(matPerms)[0], 1):
            matSet = matPerms[i];
            res = self.mult_sets(matSet, matTables, 0)
            t[0] = t[0] + timer() - s; s = timer();
            sup = self.mult_sets(matSet, matTables2, 1)
            t[1] = t[1] + timer() - s; s = timer();
            for i in list(range(0, np.shape(res)[0], 1)):
                eOut = np.dot(res[i], eIn)
                diff = np.subtract(eOut, eDes)
                diffNorm = np.linalg.norm(diff)
                curSup = sup[i]
                lock.acquire(True)
                if diffNorm < self.analysisData.get('curDiff'):
                    print('here, ', i, ' ', t)
                    self.analysisData.set('eOut', eOut.tolist())
                    self.analysisData.set('iteration', i)
                    self.analysisData.set('curDiff', diffNorm)
                    self.analysisData.set('curMats', curSup.tolist())
                    url = 'http://10.103.72.187:5000/api/v1/analyzer/' + self.analysisData.get(
                        'analyzerID') + '/update'
                    requests.put(url, json=self.analysisData.getData())

                if not self.analysisData.get('running'):
                    lock.release()
                    return -1
                lock.release()
                # if data is None:
                #     data = res
                # else:
                #     data = np.vstack([data, res])
                #     t[2] = t[2] + timer() - s; s = timer();
                # if support is None:
                #     support = sup
                # else:
                #     support = np.vstack([support, sup])
                #     t[3] = t[3] + timer() - s; s = timer();

        return 0

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
                url = 'http://10.103.72.187:5000/api/v1/analyzer/' + self.analysisData.get('analyzerID') + '/update'
                requests.put(url, json=self.analysisData.getData())

            if not self.analysisData.get('running'):
                lock.release()
                return -1
            lock.release()
        return 0

    def run(self):
        print('start')
        # matCombinationDataCompressed, matCombinationSupportData = self.generateListOfCombinations()
        processed = self.generateListOfCombinations()
        # processed = self.processData(matCombinationDataCompressed, matCombinationSupportData)
        if processed == -1:
            print('stopped')
        else:
            self.lock.acquire(True)
            self.analysisData.set('running', False)
            url = 'http://10.103.72.187:5000/api/v1/analyzer/' + self.analysisData.get('analyzerID') + '/update'
            requests.put(url, json=self.analysisData.getData())
            self.lock.release()
            print('done')
