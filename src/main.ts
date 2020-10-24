import * as core from '@actions/core';
import * as github from '@actions/github';
import * as semver from 'semver';

async function run(): Promise<void> {
  try {
    const token = core.getInput('token')
    const tag = core.getInput('version')
    const msg = core.getInput('message')

    if (semver.valid(tag) == null) {
      core.setFailed(`Tag ${tag} does not appear to be a valid semantic version`)
      return
    }

    const owner = github.context.repo.owner
    const repo = github.context.repo.repo
    const sha = github.context.sha
    const ref = `refs/tags/${tag}`

    const client = github.getOctokit(token)

    const tag_rsp = await client.git.createTag({
      owner: owner,
      repo: repo,
      tag: tag,
      message: msg,
      object: sha,
      type: "commit",
    })
    if (tag_rsp.status !== 201) {
      core.setFailed(`Failed to create tag object (status=${tag_rsp.status})`)
      return
    }

    const ref_rsp = await client.git.createRef({
      owner: owner,
      repo: repo,
      ref: ref,
      sha: sha,
    })
    if (ref_rsp.status !== 201) {
      core.setFailed(`Failed to create tag ref (status=${tag_rsp.status})`)
      return
    }

    core.info(`Tagged ${sha} as ${tag}`)

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
