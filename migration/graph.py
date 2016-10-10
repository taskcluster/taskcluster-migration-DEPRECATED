from graphviz import Digraph

def make_graph(workgraph):
    dot = Digraph(comment="Work Graph")

    for name in workgraph:
        dot.node(name, name)

    for name, workitem in workgraph.iteritems():
        dot.edges((name, dep) for dep in workitem.dependencies)

    return dot
