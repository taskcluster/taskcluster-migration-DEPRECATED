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

    return {name: WorkItem(workitem) for name, workitem in workgraph.iteritems()}
