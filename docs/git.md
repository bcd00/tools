# Git

## Installation

```shell
brew install git
brew install delta
```

## Configuration

**Example .gitconfig**

```text
[user]
	name =
	username =
	email =
[core]
	autocrlf = input
	pager = delta
[init]
	defaultBranch = main
[push]
	autoSetupRemote = true
	default = current
[alias]
	undo = reset --soft HEAD
```