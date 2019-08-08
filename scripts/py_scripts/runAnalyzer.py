import sys
import requests
import time
from multiprocessing import Process, Lock, Semaphore
from functools import reduce
from BruteForce import BruteForce
from AnalysisData import AnalysisData


# run an algorithm based on analysisData
# lock data
# push updates to analysis data
# release lock
def analyzer(analysisData, lock):
    switch = {
        'BruteForce': BruteForce,
    }
    analyzerawer = switch.get(analysisData.get('algorithm'))(analysisData, lock)
    # Process(target=analyzer.run).start()
    analyzerawer.run()

# get analysis, check if weights changed
# lock data
# push updates to server
# release lock
def updater(analysisData, interval, lock):
    time.sleep(interval / 1000)
    serverData = requests.get(("http://10.103.72.187:5002/api/v1/analyzer/{id}".format(id=analysisData.get('_id')))).json()
    lock.acquire(True)
    analysisData.set('running', serverData['running'])
    analysisData.set('weightsChanged', analysisData.get('weights') - serverData['weights'])
    analysisData.set('weights', serverData['weights'])
    requests.put(("http://10.103.72.187:5002/api/v1/analyzer/{id}/update".format(id=analysisData.get('_id'))), analysisData)
    lock.release()


if __name__ == '__main__':
    if sys.argv and sys.argv[1]:
        analyzerID = sys.argv[1]
        analysisSeed = requests.get(("http://10.103.72.187:5002/api/v1/analyzer/{id}".format(id=analyzerID))).json()
        mats = requests.get("http://10.103.72.187:5000/api/v1/mat").json()
        matData = requests.get("http://10.103.72.187:5000/api/v1/matDB").json()
        while not (analysisSeed and mats and matData):
            pass
        matDict = {}
        for matDB in matData:
            temp = {}
            for lenSet in matDB['data']:
                temp2 = {}
                for eSet in lenSet['lenSet']:
                    temp2[eSet['eIn']] = eSet['eOut']
                temp[lenSet['len']] = temp2
            matDict[matDB['mat']['name']] = temp
        temp = {
            'eIn': analysisSeed['eIn'],
            'eDes': analysisSeed['eDes'],
            'eOut': analysisSeed['eOut'],
            'weights': analysisSeed['weights'],
            'curMats': [],
            'matDict': matDict,
            'matsAvail': mats,
            'matsAvailNames': list(map(lambda mat: mat['name'], mats)),
            'iteration': 0,
            'algorithm': analysisSeed['algorithm'],
            'weightsChanged': False,
            'analyzerID': analyzerID,
            'running': True,
        }
        analysisData = AnalysisData(temp)

        sharedLock = Lock()
        interval = 250  # ms
        analyzer(analysisData,sharedLock)
        # Process(target=updater, args=(analysisData, interval, sharedLock,)).start()
