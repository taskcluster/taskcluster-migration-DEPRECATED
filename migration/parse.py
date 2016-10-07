import yaml
import os

from .task import Task

def parse_tasks():
    tasks = {}

    for filename in os.listdir("tasks"):
        with open(os.path.join('tasks', filename), "rb") as f:
            tasks.update(yaml.load(f))

    # normalize the tasks
    for name in tasks:
        if not tasks[name]:
            tasks[name] = {}
        task = tasks[name]
        if 'dependencies' not in task:
            task['dependencies'] = []
        for dep in task['dependencies']:
            if dep not in tasks:
                raise Exception('task {} not found'.format(dep))

    return {name: Task(taskdict) for name, taskdict in tasks.iteritems()}
