class Props:

    def __init__(self, properties=None):
        if properties is None:
            properties = {
                'mats': ['vacuum'],
                'energy': 14.1,
                'lengths': [10],
                'printProg': 1000,
                'beamOn': 10000,
                'destFileName': 'tin_10cm_14_1_MeV.root',
                'logFile': 'tin_10_14_1_log.out',
                'procCount': 2,
                'dirProps': {'baseRun': './run.mac',
                             'buildDir': './../../build/'}
            }
        self.mats = properties['mats']
        self.energy = properties['energy']
        self.lengths = properties['lengths']
        self.printProg = properties['printProg']
        self.beamOn = properties['beamOn']
        self.destFileName = properties['destFileName']
        self.logFile = properties['logFile']
        self.dirProps = properties['dirProps']
        self.procCount = properties['procCount']

        self.validate()

    def validate(self):
        if len(self.mats) < 4:
            for _ in range(len(self.mats),4): self.mats.append('vacuum') # Should change to 1st mat in properties table
        if len(self.lengths) < 4:
            for _ in range(len(self.lengths),4): self.lengths.append(1) # Should change to 1st length in properties table
