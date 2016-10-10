class WorkItem(object):

    def __init__(self, taskdict):
        self.__dict__.update(taskdict)

    def __repr__(self):
        return 'WorkItem({!r})'.format(self.__dict__)
