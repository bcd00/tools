# General Tools

## Linting

To lint the project, run the following command:

```shell
npm run lint
```

## Building

To build the project, run the following command:

```shell
npm run build
```

## Archive

To use, place the following script into the /usr/local/bin directory:

```shell
node ~/tools/dist/archive.js
```

Once run, the script will ask for a file to archive and whether to clean up the file after the archiving is done.
The corresponding directory structure is created within the cloud archive and a check is carried out to determine if the
file already exists, if it does, the process throws an error. The file is then tarballed and copied to the archive. If
cleaning up, the file and its corresponding tar are deleted.