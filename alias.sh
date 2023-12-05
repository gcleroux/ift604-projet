#!/usr/bin/env sh

pull() {
    git pull
    git submodule foreach git pull
}
