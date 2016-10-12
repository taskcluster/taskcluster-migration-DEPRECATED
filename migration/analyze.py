def find_roots(workgraph):
    deps = set()
    for workitem in workgraph.itervalues():
        for dep in workitem.dependencies:
            deps.add(dep)
    roots = set(workgraph) - deps

    non_milestone = {r for r in roots if not workgraph[r].milestone}
    if non_milestone:
        raise Exception("Some graph roots are not milestones: " + ", ".join(non_milestone))

    return roots
