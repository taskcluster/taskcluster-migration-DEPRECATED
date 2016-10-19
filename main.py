import os
from migration.parse import parse_workgraph
from migration.graph import make_graph
from migration.check import check_graph
from migration.analyze import unblocked_items

OUTPUT_DIR = os.path.abspath('src/data')

def write_nodes(filename, nodes):
    with open(os.path.join(OUTPUT_DIR, filename), "w") as f:
        for node in nodes:
            f.write(node + "\n")

def write_dot(filename, graph):
    dot = make_graph(graph)
    dot.format = 'svg'
    dot.render(os.path.join(OUTPUT_DIR, filename))

def main():
    workgraph = parse_workgraph()
    check_graph(workgraph)

    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    write_dot('workgraph.dot', workgraph)
    write_nodes("unblocked.txt", sorted(unblocked_items(workgraph)))

    print("{} work items".format(len(workgraph)))

if __name__ == "__main__":
    main()
