# TODO

## Work Items

 * dep signing
 * symbol uploads for windows?
 * other parity items
 * other scheduler activities
 * "queue monitoring" -- aki, blocking tier 1
 * "nagios" -- aki, blocking tier 1
 * "chain of trust verification" -- aki, blocking tier 1
 * l10n
 * release promotion (just a stub now)
 * thunderbird (nothing yet..)

### Details


## Work Item Attributes

 * duration?
 * bug
 * assigned
 * finished/unfinished
 * ¯\_(ツ)_/¯ item
 * "etc." to indicate there will be more dependencies

## Implementation stuff

 * strip unnecessary paths (given "A -> B -> C" and "A -> C", drop the latter)
 * cycle detection
 * subgraphs for milestones?
 * other outputs:
   * enumerate items with no deps, sorted by the maximum path length (or duration) from that item
   * predicted completion for each milestone assuming maximum parallelization
   * a few rooted graphs, one for each milestone
