import sys
import requests
import time
from multiprocessing import Process, Lock, Semaphore
import BruteForce
import AnalysisData


# run an algorithm based on analysisData
# lock data
# push updates to analysis data
# release lock
def analyzer(analysisData, lock):
    switch = {
        'bruteForce': BruteForce,
    }
    analyzer = switch.get(analysisData.algorithm)(analysisData, lock)
    Process(target=analyzer.run, args=(analysisData, sharedLock,)).start()


# get analysis, check if weights changed
# lock data
# push updates to server
# release lock
def updater(analysisData, interval, lock):
    time.sleep(interval / 1000)
    serverData = requests.get(("http://localhost:5002/api/v1/analyzer/{id}".format(id=analysisData._id))).json()
    lock.acquire(True)
    analysisData.running = serverData.running
    analysisData.weightsChanged = analysisData.weights - serverData.weights
    analysisData.weights = serverData.weights
    requests.put(("http://localhost:5002/api/v1/analyzer/{id}/update".format(id=analysisData._id)), analysisData)
    lock.release()


if __name__ == '__main__':
    if sys.argv and sys.argv[1]:
        analyzerID = sys.argv[1]
        analysisSeed = requests.get(("http://localhost:5002/api/v1/analyzer/{id}".format(id=analyzerID))).json()
        mats = requests.get("http://localhost:5000/api/v1/mats").json()
        matData = requests.get("http://localhost:5000/api/v1/matDB").json()
        while not (analysisSeed and mats and matData):
            pass
        temp = {
            'eIn': analysisSeed.eIn,
            'eDes': analysisSeed.eDes,
            'eOut': analysisSeed.eOut,
            'weights': analysisSeed.weights,
            'curMats': [],
            'matDict': map(lambda matDB: {matDB.name: matDB.data}, matData),
            'matsAvail': mats,
            'matsAvailNames': map(lambda mat: mat.name, mats),
            'iteration': 0,
            'algorithm': analysisSeed.algorithm,
            'weightsChanged': False,
            'analyzerID': analyzerID,
            'running': True,
        }
        analysisData = AnalysisData(temp)

        sharedLock = Lock()
        interval = 250  # ms
        # Process(target=updater, args=(analysisData, interval, sharedLock,)).start()
