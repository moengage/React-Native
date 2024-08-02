# Pre-Release
workingDir=$(pwd)
git checkout development
git pull origin development
git checkout master
git pull origin master
git merge development
git push origin master

# Release
latestTag=$(git describe --tags `git rev-list --tags --max-count=1`)
lastReleaseCommitId=$(git rev-parse $latestTag)
masterCommitId=$(git rev-parse master)
echo "::notice::latestTag: $latestTag"
echo "::notice::lastReleaseCommitId: $lastReleaseCommitId"
echo "::notice::masterCommitId: $masterCommitId"
diffFiles=$(git diff --name-only $masterCommitId $lastReleaseCommitId)
filesArray=( $diffFiles )
moduleNameArray=()
for i in "${filesArray[@]}"
do
  currentDir=$(cut -f 1 -d "/"<<<$i)
  if [[ "sdk" == "$currentDir" ]]; then
    DIR=$(cut -f 1-2 -d "/"<<<$i)
    if [ -d "$DIR" ]; then
      moduleNameArray[${#moduleNameArray[@]}]=$DIR
    fi
  fi
done
filteredModules=($(echo "${moduleNameArray[@]}" | tr ' ' '\n' | sort -u | tr '\n' ' '))
echo "## Released Modules! :rocket:" >> $GITHUB_STEP_SUMMARY
for modulePath in "${filteredModules[@]}"
do
  moduleName=$(cut -f 2 -d "/"<<<$modulePath)
  echo "::group::Releasing path: $modulePath name:$moduleName"
  cd $modulePath
  publishingVersion=$(node -p "require('./package.json').version")
  npm publish
  git tag -a $moduleName-v$publishingVersion -m "$publishingVersion"
  cd $workingDir
  echo "Released version: $publishingVersion for $moduleName"
  echo "::endgroup::"
  echo "### $moduleName: $publishingVersion" >> $GITHUB_STEP_SUMMARY
done

# push tags to remote
git push origin --tags

# back merge branch to development
git checkout development
git pull origin development
git merge master
git push origin development