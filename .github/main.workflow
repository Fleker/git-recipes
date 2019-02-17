workflow "New workflow" {
  on = "push"
  resolves = ["GitHub Action for Google Cloud"]
}

action "GitHub Action for npm" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  runs = "npm run build"
}

action "GitHub Action for Google Cloud" {
  uses = "actions/gcloud/cli@1a017b23ef5762d20aeb3972079a7bce2c4a8bfe"
  needs = ["GitHub Action for npm"]
  runs = "gcloud app deploy --project git-recipes"
}
