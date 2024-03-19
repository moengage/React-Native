# Pre-Release
workingDir=$(pwd)
git checkout master

# Release
latestTag=$(git describe --tags `git rev-list --tags --max-count=1`)
lastReleaseCommitId=$(git rev-parse $latestTag)
masterCommitId=$(git rev-parse master)
echo "latestTag: $latestTag"
echo "lastReleaseCommitId: $lastReleaseCommitId"
echo "masterCommitId: $masterCommitId"
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
for modulePath in "${filteredModules[@]}"
do
  moduleName=$(cut -f 2 -d "/"<<<$modulePath)
  echo "Releasing path: $modulePath name:$moduleName"
  cd $modulePath
  publishingVersion=$(node -p "require('./package.json').version")
  npm publish
  git tag -a $moduleName-v$publishingVersion -m "$publishingVersion"
  cd $workingDir
  echo "Released version: $publishingVersion for $moduleName"
done

# push tags to remote
git push origin --tags