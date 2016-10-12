import yaml
import os

from .workitem import WorkItem

def parse_workgraph():
    workgraph = {}

    for filename in os.listdir("workgraph"):
        if not filename.endswith('.yml'):
            continue
        with open(os.path.join('workgraph', filename), "rb") as f:
            workgraph.update(yaml.load(f))

    # normalize the workgraph
    for name in workgraph:
        if not workgraph[name]:
            workgraph[name] = {}
        workitem = workgraph[name]
        if 'dependencies' not in workitem:
            workitem['dependencies'] = []
        for dep in workitem['dependencies']:
            if dep not in workgraph:
                raise Exception('workitem {} not found'.format(dep))

    workitems = {name: WorkItem(name, workitem) for name, workitem in workgraph.iteritems()}

    # detect cycles
    unseen = set(workitems)
    while unseen:
        stack = []
        def recurse(name):
            if name in stack:
                cycle = stack + [name]
                while cycle[0] != name:
                    cycle.pop(0)
                cycle = " -> ".join(cycle)
                raise Exception("Graph cycle found: " + cycle)
            stack.append(name)
            for dep in workitems[name].dependencies:
                recurse(dep)
            stack.pop()
        recurse(unseen.pop())

    return workitems
