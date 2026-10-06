# readme-recent-projects

A GitHub Action that keeps the project cards in your profile README in sync with your most recently pushed repos, and commits the update **as you** every day. Your profile stays fresh and you get a square on your contribution graph each day.

## Setup

1. Open your profile repo (the repo named after your username, e.g. `yourname/yourname`).
2. Put these markers wherever you want the cards to appear in your README:

   ```html
   <!--RECENT:start-->
   <!--RECENT:end-->
   ```

   If the markers are missing, the section is appended to the end of the README under a `## Recent Projects` heading.

3. Create `.github/workflows/update-readme.yml`:

   ```yaml
   name: Update README

   on:
     schedule:
       - cron: "17 6 * * *"
     workflow_dispatch:

   permissions:
     contents: write

   jobs:
     update:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: Livicianaa/readme-recent-projects@v1
   ```

4. Go to **Actions > Update README > Run workflow** to trigger the first run manually.

`17 6 * * *` means every day at 06:17 UTC. GitHub may delay scheduled runs by 10-30 minutes during busy periods.

## Inputs

| Input | Default | Description |
| --- | --- | --- |
| `username` | repo owner | User whose repos are listed |
| `limit` | `4` | Number of cards |
| `pinned` | | Comma-separated repo names that are always shown first, before the most recent ones |
| `skip` | | Regex of repo names to hide, e.g. `^(test-\|demo-)` |
| `theme` | `tokyonight` | [github-readme-stats](https://github.com/anuraghazra/github-readme-stats) theme |
| `card-host` | `https://github-readme-stats.vercel.app` | github-readme-stats instance for the cards; point it at your own deployment if the public one is rate-limited or down |
| `readme` | `README.md` | Path to the README |
| `heading` | `## Recent Projects` | Heading used when the markers are missing |
| `commit-message` | `docs: refresh recent projects` | Commit message |

Example:

```yaml
- uses: Livicianaa/readme-recent-projects@v1
  with:
    limit: 6
    pinned: "my-best-project"
    skip: "^(test-|demo-)"
    theme: radical
```

## How it works

- Lists your public repos that are not forks or archived, sorted by last push, and skips the profile repo itself.
- Writes the cards in rows of two between `<!--RECENT:start-->` and `<!--RECENT:end-->`. Nothing else in your README is touched.
- Adds a hidden date comment to the block, so there is a change and a commit every day.
- Commits with your account's noreply address (`ID+username@users.noreply.github.com`). Commits made as a bot do not count toward your contribution graph; these do.

## Troubleshooting

- **Push rejected (403):** make sure the workflow has `permissions: contents: write`.
- **Workflow stopped running:** GitHub disables scheduled workflows in public repos after 60 days without activity. Re-enable it with **Enable workflow** in the Actions tab.
- **A card says "Something went wrong":** the repo is private or was deleted; hide it with `skip`.

## License

MIT. Created by Liviciana.
