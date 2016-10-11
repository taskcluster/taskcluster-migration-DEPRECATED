# 6-12 Week Counter

Turning on Tier-1 opt builds requires releasing a beta within 12 weeks, so we
need to time that carefully.

Betas are promoted from nightlies on the mozilla-beta branch, and nightlies are
built with the same CI system as opt builds (so that we're testing what we
ship), so once the tier-1 opt promotion lands, six weeks after it is promoted
we will need to have nightlies functional enough to form the basis of a beta
release.

# Tiering Up

The following is the process for getting a platform to tier 1 on TC.

 * Run builds at tier 2 on all branches
 * Green up the tests against those Tier-2 builds in try
 * Run tests at tier 2 on all branches
 * Simultaneously promote builds and tests to tier 2, while demoting the BB jobs

In particular, the key is that a build can't go to tier 1 until its outputs are
being tested by tests that are also ready to go to tier 1.
