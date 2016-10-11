# Open Questions

## What to run via BBB

At a minimum, jobs locked to hardware that must be gradually transitioned from
BB to TC must be run via BBB first, so that we can make the transition using hg
commits at the same time as we reimage machines.  That means

 * Windows Talos
 * Linux Talos (including Android)
 * OS X Talos
 * OS X Tests

All builds, plus linux tests, are basically ready to roll in TC, so I'm not
worried about them.  All four of the items above will run against TC builds,
not Buildbot builds.

We have the option of also running Windows tests via BBB.  Is there an
advantage to doing so, or should I plan only on Windows Talos going via BBB?

# Answered Questions

## Hardware Tests Migrating via BBB

What is the process for bringing a hardware platform to Tier 1?

---

 * Get builds to Tier 2
 * Develop a patch to run tests via BBB and green up the jobs using try or a project branch
 * Land that patch at the same time as
   * disabling sendchagnes from Buildbot builds
   * demoting buildbot builds to Tier 2
   * promoting taskcluster builds to Tier 1
   * (the BBB jobs remain in Buildbot and thus at Tier 1)
 * Replace a small fraction (say, 10%) of the buildslaves with taskcluster workers (reimage)
 * Develop a patch that runs the tests via those workers directly, using try or a project branch
 * Land that patch suite-by-suite, reimaging the remainder of the machines to keep up with load
