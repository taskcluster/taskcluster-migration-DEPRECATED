import networkx as nx
from graphviz import Digraph

def transitive_reduction(graph):
    """Transitive reduction: remove 'shortcut' paths e.g., remove w -> z when w
    -> x -> y -> z exists"""
    # first, build a path matrix
    paths = {name: set() for name in graph}
    seen = set()
    for name in graph:
        if name in seen:
            continue
        stack = []
        def recur(name):
            for n in stack:
                paths[n].add(name)
            seen.add(name)
            stack.append(name)
            for dep in graph[name]:
                recur(dep)
            stack.pop()
        recur(name)

    # now omit any dependencies for which another dependency has a path
    for name, deps in graph.iteritems():
        omit = set()
        for dep1 in deps:
            for dep2 in deps:
                if dep2 != dep1 and dep1 in paths[dep2]:
                    # name -> dep2 --...--> dep1
                    #      \_______________/
                    # so remove the name -> dep1 edge
                    omit.add(dep1)
                    break
        for o in omit:
            deps.remove(o)

    return graph

def transitive_reduction(g):
    g = nx.DiGraph(g)
    for n1 in g.nodes_iter():
	if g.has_edge(n1, n1):
	    g.remove_edge(n1, n1)
	for n2 in g.successors(n1):
	    for n3 in g.successors(n2):
		for n4 in nx.dfs_preorder_nodes(g, n3):
		    if g.has_edge(n1, n4):
			g.remove_edge(n1, n4)
    return g

def make_graph(workgraph):
    # make a simpler copy of the workgraph
    #graph = {name: list(deps) for name, deps in workgraph.adjacency_iter()}
    workgraph = transitive_reduction(workgraph)

    dot = Digraph(comment="Work Graph")
    dot.body.append('rankdir=LR')

    for node in workgraph:
        dot.node(node, node, {'tooltip': workgraph.node[node]['title']})

    for name, deps in workgraph.adjacency_iter():
        dot.edges((name, dep) for dep in deps)

    return dot
