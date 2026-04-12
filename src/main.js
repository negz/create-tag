import * as core from '@actions/core';
import * as github from '@actions/github';

const run = async () => {
  const tag = core.getInput('version')

  const client = github.getOctokit(core.getInput('token'))

  const tag_rsp = await client.rest.git.createTag({
    ...github.context.repo,
    tag,
    message: core.getInput('message'),
    object: github.context.sha,
    type: 'commit'
  })
  if (tag_rsp.status !== 201) {
    core.setFailed(`Failed to create tag object (status=${tag_rsp.status})`)
    return
  }

  const ref_rsp = await client.rest.git.createRef({
    ...github.context.repo,
    ref: `refs/tags/${tag}`,
    sha: tag_rsp.data.sha
  })
  if (ref_rsp.status !== 201) {
    core.setFailed(`Failed to create tag ref(status = ${tag_rsp.status})`)
    return
  }

  core.info(`Tagged ${tag_rsp.data.sha} as ${tag}`)
};

run();

module.exports = run;
