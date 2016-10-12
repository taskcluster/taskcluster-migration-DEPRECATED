import os
from migration.parse import parse_workgraph
from migration.graph import make_graph
from migration.analyze import find_roots


def main():
    workgraph = parse_workgraph()

    if not os.path.exists('output'):
        os.makedirs('output')

    dot = make_graph(workgraph)
    dot.format = 'svg'
    dot.render('output/workgraph.dot')

    with open('output/roots.txt', "w") as f:
        for root in sorted(find_roots(workgraph)):
            f.write(root + "\n")

if __name__ == "__main__":
    main()
