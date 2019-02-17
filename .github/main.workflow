workflow "Build and deploy on push" {
  on = "push"
  resolves = [
    "GitHub Action for npm",
    "GitHub Action for Google Cloud",
  ]
}

action "GitHub Action for npm" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  runs = "npm install"
}

action "GitHub Action for npm-1" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["GitHub Action for npm"]
  runs = "npm install -g polymer-cli"
}

action "GitHub Action for npm-2" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["GitHub Action for npm-1"]
  runs = "npm run build"
}

action "GitHub Action for Google Cloud" {
  uses = "actions/gcloud/cli@1a017b23ef5762d20aeb3972079a7bce2c4a8bfe"
  needs = ["GitHub Action for npm-2"]
  runs = "gcloud app deploy --project git-recipes"
}
