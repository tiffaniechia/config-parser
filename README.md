# Config parser

#### Contents

1.  Run Instructions
2.  Design Decisions
3.  Future Improvements
4.  Core Challenge Question


#### Run Instructions

To run tests:
```bash
$ cd <PROJECT_HOME_PATH>
$ npm install
$ npm test
```

To run this project interactively:
```bash
$ cd <PROJECT_HOME_PATH>
$ npm install
$ node
> var app = require('./app.js')
> var config = app.loadConfig('./sample.conf',['ubuntu','production'])

 # example query
 > config.ftp.path
# returns '/etc/var/uploads'

# incorrect query
 > config.doesnotexist
# returns undefined
```
#### Design Decisions
- ability to extend easily
- read queries should be quick, hence I have used a dictionary (Javascript has no hashmap) and made sure that all the processing was done on `loadConfig`.
- as little dependencies on third party libraries.

|File|Design Decision|
|---|---|
|src/configParser.js|Definitely the core of this operation, I wanted this class to remain as seperate as possible to any business logic that was not pertinent to building the object. This ensures that future additions to parsing logic can be done easily.|
|src/ConfigReader.js|I wanted a seperate class to deal with file read logics such as incorrect file paths/ ingestion of file. A separate class would ensure any future logic for chunking files/ how content is read (stream/whole)/ content from api/ different inputs of content would not affect how the ultimate config content string that is consumed by the ConfigParser class. This would ensure that the reader is extensible outside of the parsing logic.|
|src/stringUtils.js|Given that the logic for what constitutes an array/override/group/etc are largely arbitrary constructs, I wanted to extract the logic for this into it's separate file. Hence any changes to what constitutes an valid setting such as override/ a new group/ a new type of value/ extension of comments to use `#` will not affect and should not the parsing logic in the ConfigParser class.|
|app.js|Serves as an entry point to the application. Where `loadConfig()` sits.|

#### Future Improvements
Understandably, there might be a time where the file size is larger than what a single pass on `fs.readFileSync()` can handle. In that case I would like to implement a chunking mechanism that would first understand the size of the file, then if required process the entire file in chunks.

Currently, calls to any non existent key will returned `undefined` instead of `'None'`. This behaviour can be overridden.

As it is currently set up, the dictionary has already been initialised as an empty `{}`, any inputs that does not conform to the any parsing logic will just be ignored. Hence a 'malformed file' will return an empty dictionary. This can be further improved with checks to each line and to return an error if a line does not conform to any given rules.

To make this slightly more extensible, there can be a path parser that can calculate absolute paths from any given relative paths. This will hopefully make the application less ridgid.

As more possible errors are discovered, distinct error classes can be created and used instead of the generic `Error` class. This would ensure that errors are more readable and succint.

#### Core Challenge Question

A config file will appear as follows:
```
[common]
basic_size_limit = 26214400
student_size_limit = 52428800
paid_users_size_limit = 2147483648
path = /srv/var/tmp/
path<itscript> = /srv/tmp/

[ftp]
name = "hello there, ftp uploading"
path = /tmp/
path<production> = /srv/var/tmp/
path<staging> = /srv/uploads/
path<ubuntu> = /etc/var/uploads
enabled = no
; This is a comment

[http]
name = "http uploading"
path = /tmp/
path<production> = /srv/var/tmp/
path<staging> = /srv/uploads/; This is another comment
params = array,of,values
```
Where  `[group]` denotes the start of a group of related config options, setting = value
denotes a standard setting name and associated default value, and setting<override> =
value2 denotes the value for the setting if the given override is enabled. If multiple enabled
overrides are defined on a setting, the one defined last will have priority.

Your task is to write a function: `def load_config(file_path, overrides=[])` that
parses this format and returns an object that can be queried as follows. Note that overrides can
be passed either as strings or as symbols.
