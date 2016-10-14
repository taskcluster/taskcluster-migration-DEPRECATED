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
 * milestones as OKRs
   * add nightly tier2 milestones, one per platform
   * mostly want OKRs for this quarter
 * external drop-xp-support
   * mdt upgrade; blocks win10 deployment on hw
   * external ESR
   * external tbird
 * talk to rob about win versions
 * talk to rail about "beta-capable" and any other operational/relpromo dependencies
 * talk to rail about "beta-capable" and any other operational/relpromo dependencies
 * talk to mihai about funsize worker - need new workers? for mac, windows
 * talk to kim about `mach repackage` and what it does -- repackage for resigning, but also l10n?

### Details

## Work Item Attributes

 * duration?
 * finished/unfinished
 * ¯\_(ツ)_/¯ item
 * "etc." to indicate there will be more dependencies

## Implementation stuff

 * per-file defaults
 * subgraphs for milestones?
 * other outputs:
   * enumerate items with no deps, sorted by the maximum path length (or duration) from that item
   * predicted completion for each milestone assuming maximum parallelization
   * a few rooted graphs, one for each milestone
