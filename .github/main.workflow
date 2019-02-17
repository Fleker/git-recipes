workflow "Build and deploy on push" {
  on = "push"
  resolves = [
    "npm build",
    "gcloud deploy",
  ]
}

action "npm install" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  runs = "npm install"
}

action "npm build" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  runs = "npm run build"
  needs = ["npm install"]
}

action "gcloud auth" {
  uses = "actions/gcloud/auth@1a017b23ef5762d20aeb3972079a7bce2c4a8bfe"
  secrets = ["GCLOUD_AUTH"]
  needs = ["npm build"]
}

action "gcloud deploy" {
  uses = "actions/gcloud/cli@1a017b23ef5762d20aeb3972079a7bce2c4a8bfe"
  runs = "gcloud app deploy --project git-recipes"
  needs = ["gcloud auth"]
}
