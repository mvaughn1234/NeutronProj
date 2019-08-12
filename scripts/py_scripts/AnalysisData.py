import json

class AnalysisData(object):
    def __init__(self, seedData=None):
        if seedData is None:
            self.data = {
                'eIn': [],
                'eDes': [],
                'eOut': [],
                'weights': [],
                'curDiff': float('inf'),
                'curMats': [],
                'matDict': {},
                'matsAvail': [],
                'matsAvailNames': [],
                'iteration': 0,
                'algorithm': '',
                'weightsChanged': False,
                'running': True,
            }
        else:
            self.data = {
                'eIn': seedData['eIn'],
                'eDes': seedData['eDes'],
                'eOut': seedData['eOut'],
                'weights': seedData['weights'],
                'curDiff': float('inf'),
                'curMats': seedData['curMats'],
                'matDict': seedData['matDict'],
                'matsAvail': seedData['matsAvail'],
                'matsAvailNames': seedData['matsAvailNames'],
                'iteration': seedData['iteration'],
                'algorithm': seedData['algorithm'],
                'weightsChanged': seedData['weightsChanged'],
                'analyzerID': seedData['analyzerID'],
                'running': seedData['running'],
            }

    def get(self, item):
        return self.data[item]

    def set(self, key, value):
        self.data[key] = value

    def getData(self):
        return self.data
