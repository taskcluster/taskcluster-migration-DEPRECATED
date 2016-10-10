import os
from migration.parse import parse_workgraph
from migration.graph import make_graph


def main():
    workgraph = parse_workgraph()
    dot = make_graph(workgraph)

    if not os.path.exists('output'):
        os.makedirs('output')

    dot.format = 'svg'
    dot.render('output/workgraph.dot')

if __name__ == "__main__":
    main()
