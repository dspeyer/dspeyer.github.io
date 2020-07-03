#!/usr/bin/python3

import numpy as np
from random import random
from scipy.stats import lognorm

def lognormal(x,m,s):
    return np.exp(-(np.log(x-m)**2/(2*s**2)))/(x*s*(2*pi)**0.5)

n=int(1e6)
r=3

x=np.linspace(0, 1-1/n, n)

for s in [0.01, 0.5, 0.75, 1, 1.5]:

    # nspread is how many people a given person tries to infect
    nspread = lognorm.ppf(x,s)
    adj = r / np.mean(nspread)
    nspread *= adj
    
    # spreadTo maps random numbers 0..nRandVal onto people, with probability proportional to nspread
    # todo: turn this into an algebraic function, which would be faster and more precise
    nRandVal = np.sum(np.round(nspread*5).astype('uint32'))
    spreadTo = np.zeros(nRandVal, 'uint32')
    o=0
    for i in range(n):
        d = int(np.round(nspread[i]*5))
        spreadTo[o:o+d] = i
        o += d
        
    for _ in range(1): # in case you want to rerun the simulation
        sick = np.random.random(n) < 0.01
        immune = np.zeros(n, 'bool')
        nsick = 0
        turning = None
        while True:
            prevnsick = nsick
            immune[sick] = True
            nns = int( np.sum(nspread[sick]) )
            ns = spreadTo[ (np.random.random(nns) * nRandVal) .astype('uint32') ]
            sick[ns] = True
            sick[immune] = False
            nsick = np.sum(sick)
            if (nsick < prevnsick) and turning is None:
                turning = np.sum(immune) / n
            #print("    %d\t%d"%(np.sum(sick),np.sum(immune)))
            if not np.any(sick):
                break
        ni = np.sum(immune)
        print( ("25th=%.1f med=%.1f 75th=%.1f max=%.1f " % tuple(nspread[[n//4,n//2,3*n//4,-1]])) +
               ("turning point=%.1f%% final=%.1f%%" % (100*turning, 100*ni/n)) )
