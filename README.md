# Buildbot-to-TaskCluster Migration

## Work Graph

The central idea here is to map out all of the actual work items we need to
accomplish, and the dependencies between them.  There will be some gray areas
here, and we can focus on filling those in.

These are all defined in fairly self-explanatory YAML files in `workgraph/`.

See the [Latest Work Graph
SVG](https://index.taskcluster.net/v1/task/project.taskcluster.migration.latest/artifacts/public/output/workgraph.dot.svg)
(it's big!)

More results are coming soon! For example, a list of unblocked work items
sorted by criticality (longest pole first), and results for milestones such as
turning off the BB scheduler masters.

## Open Questions

### What to port to use BBB

At a minimum, jobs locked to hardware that must be gradually transitioned from
BB to TC must be run via BBB first, so that we can make the transition using hg
commits at the same time as we reimage machines.  That means Windows, Linux
(including Android), and OS X Talos, plus OS X Tests.

We have the option of also running Windows tests via BBB.  Is there an
advantage to doing so?
