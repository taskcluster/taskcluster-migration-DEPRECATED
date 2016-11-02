# Buildbot-to-TaskCluster Migration

*Explore the migration at http://migration.taskcluster.net*

This repository contains detailed tracking information for the Great
TaskCluster Migration.  It also implements a web application to view that
status in some useful ways.

The focus is the "work graph", which describes the individual work items that
need to be accomplished.  Key among those are some "milestone" work items which
represent measurable intermediate progress.

## Modifying

To modify the work graph, update the data in the YAML files under workgraph/.
For simple modifications, it's safe to just edit the files and make a pull request.

If you would like to run the site locally, install node 4 or higher, with a
corresponding version of npm.  If you are new to JS development, you are *strongly*
encouraged to use (nvm)[http://nvm.sh] to do this install -- it can be done without
root access, and avoids all the madness of distro-provided node installs (all of
which are broken one way or another).

Then run `npm install` to install the dependent packages. 

Finally, run `npm start`.  This will set up a development
server that will helpfully inform you about a few basic errors in the graph
format, and also allow you to explore the result in your browser.

When you are happy, submit a pull request!

## More Information

* [workgraph README](workgraph/README.md)
* [notes](NOTES.md)
