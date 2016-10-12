ALLOWED_KEYS = {
    # longer title for the work item
    'title' : True,

    # list of dependency labels
    'dependencies': False,

    # bug number (int)
    'bug': False,

    # assignee, or None
    'assigned': False,

    # (boolean) is the work item done?
    'done': False,

    # (boolean) is this a milestone?
    'milestone': False,

    # (boolean) is this an external dependency?
    "external": False,
}

class WorkItem(object):

    # default values
    dependencies = []
    bug = None
    assigned = None
    done = False
    milestone = False
    external = False

    def __init__(self, name, widict):
        bad_keys =  set(widict) - set(ALLOWED_KEYS)
        if bad_keys:
            raise Exception("Unknown work-item key(s) in {}: {}".format(
                                name, ", ".join(bad_keys)))

        missing_keys = {k for k, required in ALLOWED_KEYS.iteritems()
                        if required and k not in widict}
        if missing_keys:
            raise Exception("Missing required keys " + ", ".join(missing_keys))

        for k in ALLOWED_KEYS:
            if k in widict:
                setattr(self, k, widict[k])

    def __repr__(self):
        return 'WorkItem({!r})'.format(self.__dict__)
