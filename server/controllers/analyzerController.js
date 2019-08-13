const Analyzer = require('../models/Analyzer');
const {spawn} = require('child_process');

exports.getAnalyzerList = (req, res) => {
    Analyzer.find()
        .then(analyzers => res.json(analyzers));
};

exports.getAnalyzer = (req, res) => {
    Analyzer.findById(req.params.id)
        .then(analyzer => {
            console.log('retrieved: ', analyzer)
            res.json(analyzer)
        })
        .catch(err => res.status(500).send(err));
};

exports.updateAnalyzer = (req, res) => {
    Analyzer.findById(req.params.id, {$set: req.body}, {useFindAndModify: false})
        .then(analyzer => {
            res.status(200).json(analyzer);
        })
        .catch(err => {
            res.status(400).send(err);
        })
};

exports.addAnalyzer = (req, res) => {
    let analysisData = new Analyzer(req.body);
    analysisData.save();
    res.status(201).send(analysisData);
};

exports.startAnalyzer = (socket,seedAnalyzer) => {
    const analyzer = spawn(`python3 /home/student/geant4/NeutronProj/scripts/py_scripts/runAnalyzer.py ${String(seedAnalyzer)}`, {shell: true});
    analyzer.stdout.on('data', (stdout) => {
        socket.emit('runAnalyzerStdout', stdout);
        console.log(`stdout: ${stdout}`)
    });
    analyzer.stderr.on('data', (stderr) => {
        socket.emit('runAnalyzerStderr', stderr);
        console.log(`stderr: ${stderr}`)
    });
    analyzer.on('update', (data) => {
        socket.emit('runAnalyzerData', data);
        console.log(`update: ${JSON.stringify(data)}`)
    });
    analyzer.on('close', (code) => {
        socket.emit('runAnalyzerExit', 'exited with code: ' + code + '\n');
        console.log(`analyzer exited with code ${code}`)
    });
};