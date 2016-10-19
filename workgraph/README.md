# TODO

## Work Item Attributes

 * duration? (in person-days, not used to calculate ETAs)
 * "TBD" to indicate there will be more dependencies

## Implementation stuff

 * per-file defaults
 * graph features:
   * milestones, external, tbd shown in different shapes
   * done in different colors
   * scale based on duration?
 * other outputs:
   * enumerate items with no deps, sorted by the maximum path length (or total duration) from that item
   * per (selected) milestone:
    * percent completed, predicted completion based on FTE count
    * rooted graph of dependencies
 * result presentation:
   * output HTML using some stupid template engine, sync to S3 using a secret in secrets service
