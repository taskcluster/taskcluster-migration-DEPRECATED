import networkx as nx

def check_graph(graph):
    check_cycles(graph)
    check_roots(graph)

def check_roots(graph):
    with nx.utils.reversed(graph):
        for node, adjacencies in graph.adjacency_iter():
            if not adjacencies:
                if not graph.node[node]['milestone']:
                    raise Exception("graph root {} is not a milestone".format(node))

def check_cycles(graph):
    cycles = list(nx.simple_cycles(graph))
    if cycles:
        msg = "\n".join(" -> ".join(cyc) for cyc in cycles)
        raise Exception("Cycles detected:\n" + msg)
