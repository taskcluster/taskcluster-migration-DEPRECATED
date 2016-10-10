# TODO

## Work Item Attributes

 * duration?
 * bug
 * assigned
 * finished/unfinished
 * ¯\_(ツ)_/¯ item
 * "etc." to indicate there will be more dependencies

## Implementation stuff

 * strip unnecessary paths (given "A -> B -> C" and "A -> C", drop the latter)
 * enumerate items with no deps, sorted by the maximum path length (or duration) from that item
 * cycle detection
