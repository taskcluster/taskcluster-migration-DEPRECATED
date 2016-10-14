def unblocked_items(workgraph):
    # make a subgraph containing only un-completed items
    subgraph = workgraph.subgraph(n for n in workgraph if not workgraph.node[n]['done'])
    return [n for n in subgraph if not subgraph.successors(n)]
