# GitHub Actions deploy workflows for Pantheon

This directory contains the EC canonical pattern for deploying Drupal sites to
Pantheon via GitHub Actions. Validated on the `hmbweb` migration (2026-05-29).

## What each workflow does

| File | Trigger | Action |
|---|---|---|
| `deploy-main.yml` | push to `main` | Pushes to Pantheon's `dev` env (`master` branch on Pantheon's git), waits for build, runs `drush deploy`, clears edge cache |
| `deploy-pr.yml` | PR opened or reopened | Creates a new Pantheon multidev named after the branch, runs `drush deploy` |
| `deploy-pr-push.yml` | push to any non-`main` branch (only if PR is open) | Updates the existing multidev with new code, runs `drush deploy` |
| `cleanup-pr.yml` | PR closed (merged or not) | Deletes the multidev (if it exists) and the Pantheon-side branch |

Each workflow has a per-branch concurrency group so rapid commits don't race.
`deploy-main` queues commits sequentially; PR workflows cancel-in-progress.

## Required GitHub Action secrets

| Secret | Source | Scope |
|---|---|---|
| `PANTHEON_SITE_NAME` | Pantheon machine name (e.g. `mysite`) | Per-repo |
| `PANTHEON_REPO` | `terminus connection:info $SITE.dev --field=git_url` | Per-repo |
| `KNOWN_HOSTS` | `ssh-keyscan -p 2222 -t rsa,ed25519 codeserver.dev.$UUID.drush.in` | Per-repo |
| `PANTHEON_SSH_KEY` | RSA 4096 private key, registered with Pantheon via `terminus ssh-key:add` | Per-repo |
| `SSH_CONFIG` | Static template (see below) | Can be org-level |
| `PANTHEON_MACHINE_TOKEN` | A Pantheon machine token (`https://dashboard.pantheon.io/personal-settings/machine-tokens`) | Can be org-level |

`SSH_CONFIG` contents:
```
Host *.drush.in
  Port 2222
  IdentityFile ~/.ssh/id_rsa
  IdentitiesOnly yes
  StrictHostKeyChecking yes
  UserKnownHostsFile ~/.ssh/known_hosts
```

`PANTHEON_SSH_KEY` MUST be RSA 4096 (Pantheon rejects ed25519). Generate per-site
so a single key compromise has limited blast radius.

## The bootstrap-readiness poll (most important pattern)

Each deploy workflow has a "Wait for Pantheon build_step to complete" step that
polls `terminus drush $SITE.$ENV -- status --field=bootstrap` until it returns
`Successful`. This is the canonical fix for Pantheon's `build_step: true` race
condition where `terminus workflow:wait` returns before composer install
finishes server-side. See the GOTCHAS in the `circle-to-gha-pantheon` Claude
skill for the full investigation.

If you remove the bootstrap poll, expect intermittent failures with:
- "drush command 'deploy' not found"
- Exit 137 (SIGKILL)
- "Class Drupal\Core\Utility\Error not found" (autoloader fatal)

All three symptoms have the same root cause and are all resolved by the poll.

## Site requirements

The workflows assume:
- `pantheon.yml` has `build_step: true` (server-side composer install)
- `.gitignore` excludes `/vendor`, `/web/core`, `/web/libraries`
- Drush 10+ available via composer (for `drush deploy` command)

## Related skills

- **`circle-to-gha-pantheon`** — for migrating existing EC sites from CircleCI to these workflows
- **`pantheon-spinup`** — for new sites; the workflows here land in the new site automatically via the scaffold
