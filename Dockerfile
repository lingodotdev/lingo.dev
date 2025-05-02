FROM node:20.12.2-alpine

# Run the Node.js / TypeScript application
ENTRYPOINT ["sh", "-c", "npx lingo.dev@latest ci \
  --api-key \"$LINGODOTDEV_API_KEY\" \
  --pull-request \"$LINGODOTDEV_PULL_REQUEST\" \
  --commit-message \"$LINGODOTDEV_COMMIT_MESSAGE\" \
  --pull-request-title \"$LINGODOTDEV_PULL_REQUEST_TITLE\" \
  --working-directory \"$LINGODOTDEV_WORKING_DIRECTORY\" \
  --process-own-commits \"$LINGODOTDEV_PROCESS_OWN_COMMITS\""]
