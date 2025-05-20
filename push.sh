#!/bin/bash

# Make sure we're in the right directory
cd /Users/Purdue/Open/openalpha-mcp-chat

# Initialize Git if not already initialized
if [ ! -d .git ]; then
  git init
  git add .
  git commit -m "Initial commit"
fi

# Add the remote repository if it doesn't exist
if ! git remote | grep -q "origin"; then
  git remote add origin https://github.com/theknight2/oan.git
fi

echo "Enter your GitHub username:"
read USERNAME

echo "Enter your GitHub personal access token (will be hidden):"
read -s TOKEN

# Use the credentials to push
git push -u https://$USERNAME:$TOKEN@github.com/theknight2/oan.git main

echo "Push completed!" 