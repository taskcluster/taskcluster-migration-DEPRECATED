import yaml
import os
import networkx as nx

def parse_workgraph():
    workitems = {}

    for filename in os.listdir("workgraph"):
        if not filename.endswith('.yml'):
            continue
        with open(os.path.join('workgraph', filename), "rb") as f:
            workitems.update(yaml.load(f))

    graph = nx.DiGraph()
    for name, widict in workitems.iteritems():
        dependencies = widict.pop('dependencies', [])
        for dep in dependencies:
            if dep not in workitems:
                raise Exception("{} references unknown item {}".format(name, dep))

        if 'title' not in widict:
            raise Exception("{} has no title".format(name))
        widict.setdefault('bug', None)
        widict.setdefault('assigned', None)
        widict.setdefault('done', False)
        widict.setdefault('milestone', False)
        widict.setdefault('external', False)
        graph.add_node(name, attr_dict=widict)

        graph.add_edges_from((name, dep) for dep in dependencies)

    nx.freeze(graph)
    return graph
