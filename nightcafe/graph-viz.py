import networkx as nx
from matplotlib import pyplot as plt
from sys import argv
from csv import DictReader

G = nx.DiGraph()

with open(argv[1], 'r', newline='') as f:
  reader = DictReader(f)
  for row in reader:
    G.add_edge(row['u'], row['v'])

pos = nx.spring_layout(G)
nx.draw(G, pos)
nx.draw_networkx_labels(G, pos)
plt.show()
