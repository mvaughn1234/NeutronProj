# Import the os module, for the os.walk function
import os
import re
import numpy as np

num_bins = 30
num_lengths = 1
scriptsDir = "./../"
resultsDir = scriptsDir + "./../results/"
pyScriptsDir = scriptsDir+"./py_scripts"
rbScriptsDir = scriptsDir+"./rb_scripts"
plotDir = resultsDir+"./plots/"

input_energy = 0
length = 0
cur_mat = ""
Mat = np.zeros((num_bins,num_bins,num_lengths),float)

def extract_data(filename):
    cols = np.loadtxt(open(filename, "rb"), delimiter=",")
    data = cols[:,1]
    return data

def extract_energy(fname):
    matches = re.match('.*_(\d+)[_\.]?(\d*).csv',fname)
    d = 0
    if matches:
        d = float(matches.group(1)+"."+matches.group(2)) if len(matches.group(2)) != 0 else float(matches.group(1))
    return d

for dirName, subdirList, fileList in os.walk(resultsDir):
    match = re.match(resultsDir+'([^/.]*)$',dirName)
    if match and match.group() and cur_mat != match.group(1):
        cur_mat = match.group(1)
        length = 0

    fileList = sorted(filter(lambda val: re.match('^(\d+)\.csv$',val),fileList),key=extract_energy)
    length += 0 if len(fileList)==0 else 1
    for file in fileList:
        Mat[:,input_energy,length-1] = extract_data(dirName+"/"+file)
        input_energy += 1
    input_energy = 0
    if length == num_lengths:
        np.savetxt(resultsDir+"/"+cur_mat+"/"+cur_mat+".csv",Mat,delimiter=",")
        Mat = np.zeros((num_bins,num_bins,num_lengths),float)
