# Buildbot-to-TaskCluster Migration

*Explore the migration at http://migration.taskcluster.net*

This repository contains detailed tracking information for the Great
TaskCluster Migraiton.  It also implements a web application to view that
status in some useful ways.

The focus is the "work graph", which describes the individual work items that
need to be accomplished.  Key among those are some "milestone" work items which
represent measurable intermediate progress.

## Modifying

To modify the work graph, update the data in the YAML files under workgraph/.

Running `npm start` (after having run `npm install`) will set up a development
server that will helpfully inform you about a few basic errors in the graph
format, and also allow you to explore the result in your browser.

When you are happy, submit a pull request!

## More Information

* [workgraph README](workgraph/README.md)
* [notes](NOTES.md)
