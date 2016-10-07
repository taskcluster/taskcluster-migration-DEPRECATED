import os
from migration.parse import parse_tasks
from migration.graph import make_graph


def main():
    tasks = parse_tasks()
    dot = make_graph(tasks)

    if not os.path.exists('output'):
        os.makedirs('output')

    dot.format = 'svg'
    dot.render('output/task-dependencies.dot')

if __name__ == "__main__":
    main()
