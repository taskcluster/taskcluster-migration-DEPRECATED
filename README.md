# Buildbot-to-TaskCluster Migration

## Work Graph

The central idea here is to map out all of the actual work items we need to
accomplish, and the dependencies between them.  There will be some gray areas
here, and we can focus on filling those in.

These are all defined in fairly self-explanatory YAML files in `workgraph/`.

## Results:

 * [Full Work Graph SVG](https://index.taskcluster.net/v1/task/project.taskcluster.migration.latest/artifacts/public/output/workgraph.dot.svg) (it's big!)
 * [Graph Roots](https://index.taskcluster.net/v1/task/project.taskcluster.migration.latest/artifacts/public/output/roots.txt) - all of the work items on which nothing else depends.  Ideally these would all be milestones!

More results are coming soon! For example, a list of unblocked work items
sorted by criticality (longest pole first), and results for milestones such as
turning off the BB scheduler masters.

See also the [open and closed questions](QUESTIONS.md).
