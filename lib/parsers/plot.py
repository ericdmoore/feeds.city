import plotext as plt

# y series
brSize =   [ 33,36,33,59,68,59,107,106,107,188,185,188,230,223,230,245,393,524,1083,1072,1256,1857,2022,1937,2684,2686,2688 ]
gzSize =   [ 52,52,52,77,80,77,118,124,118,199,198,199,238,236,238,253,407,534,1107,1096,1295,1893,2079,2003,2873,2904,2974 ]

# y series
baseSize = [ 32,32,32,64,64,64,128,128,128,256,256,256,320,320,320,343,607,833,2041,2111,2655,4152,4696,4766,21035,25187,33491 ]
baseLabel = [str(n) for n in baseSize]

# truncate number 
end = len(baseSize) # -3
sqrtBase = list(map(lambda x :x **0.80  , baseSize))

# plt.plot( sqrtBase[0:end] , label = "source pow(0.8)")
plt.scatter( brSize[0:end], label = "br scatter" )
plt.scatter( gzSize[0:end], label = "gz scatter" )
plt.xticks( sqrtBase[0:end], baseLabel[0:end] )

plt.title("Br vs GZ vs Soruce Char Sizes")
plt.show()