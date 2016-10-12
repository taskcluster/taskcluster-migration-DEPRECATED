ALLOWED_KEYS = [
    'title',
    'dependencies',
    'bug',
    'assigned',
    'done',
    'milestone',
    "external",  # this is an external dependency
]

class WorkItem(object):

    def __init__(self, name, widict):
        bad_keys =  set(widict) - set(ALLOWED_KEYS)
        if bad_keys:
            raise Exception("Unknown work-item key(s) in {}: {}".format(
                                name, ", ".join(bad_keys)))
        for k in ALLOWED_KEYS:
            if k in widict:
                setattr(self, k, widict[k])

    def __repr__(self):
        return 'WorkItem({!r})'.format(self.__dict__)
