from graphviz import Digraph

def make_graph(tasks):
    dot = Digraph(comment="Task Dependencies")

    for name in tasks:
        dot.node(name, name)

    for name, task in tasks.iteritems():
        dot.edges((name, dep) for dep in task.dependencies)

    return dot
