#! usr/bin/python

import sys, os, subprocess, string, time
import numpy as np

thickness = range(1,21,1)
energy = np.logspace(-3,np.log10(14.1),30)
#tin, moly, beryllium, graphite, BH3O3
#for i in thickness:
for e in energy:
  #subprocess.call(["sed -i '10c\/testhadr/det/setRadius1 %d cm' run1.mac" % i],shell=True)
  #strg = 'Moly' + '%d' % i + 'cm'
#  subprocess.call(["sed -i '28c\/analysis/setFileName %s' run1.mac" % strg],shell=True)
  int_part = str(int(e))
  frac_part = str(e%1)
  e_modified = int_part+"_"+frac_part
  strg = 'tin_10cm_Ene_%s_MeV.root' % e_modified
  subprocess.call(["sed -i '28c\/analysis/setFileName %s' run1.mac" % strg],shell=True)
  subprocess.call(["sed -i '26c\/gun/energy %g MeV' run1.mac" % e],shell=True)
  subprocess.call(['./Hadr06 run1.mac > nohup.out &'],shell=True)
  time.sleep(10)


