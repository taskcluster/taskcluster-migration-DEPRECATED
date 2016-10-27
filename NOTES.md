# ESR

We will "finish" the migration with a small pool of Buildbot still running just
to service ESR releases.

# XP

Similarly, Windows XP will last as long as it lasts, and we will not attempt to
do anything to change the Windows XP buildslaves.  So Buildbot itself cannot be
shut off until Windows XP is no longer supported on any branch.

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

# Mach Repackage

Windows and Mac packages contain signed bits (internals) which are then
packaged into a single file, which is itself signed (external).

Currently, the signing and packaging are interleaved in a single file, but this
is not compatible with separate signing.  The `mach repackage` work will
separate these operations so that a complete package can be disassebled,
signed, and re-assembled.

# Post-Task Reboots

Buildbot reboots hardware after some test tasks, as a way to flush any
remaining tasks or other system state that may have been left from the previous
task.  Docker provides a similar effect, and taskcluster-worker uses per-user
tasks to achieve a similar isolation.  So the current plan is to not
automatically reboot after any tasks.
