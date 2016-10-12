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

    assert 'seta-in-tree' in paths['no-buildbot']

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

def make_graph(workgraph):
    # make a simpler copy of the workgraph
    graph = {name: wi.dependencies[:] for name, wi in workgraph.iteritems()}
    graph = transitive_reduction(graph)

    dot = Digraph(comment="Work Graph")
    dot.body.append('rankdir=LR')

    for name, workitem in workgraph.iteritems():
        dot.node(name, name, {'tooltip': workitem.title})

    for name, deps in graph.iteritems():
        dot.edges((name, dep) for dep in deps)

    return dot
