#!/usr/bin/env node

const fs = require('fs');
const async = require('async');

const DIR = __dirname + '/..';
const commands = {
  'info': {
    handler: handle_info,
    helpstr: 'info'
  },
  'status': {
    handler: handle_status,
    helpstr: 'status'
  },
  'clone': {
    handler: handle_clone,
    helpstr: 'clone [project]'
  },
  'npm-run': {
    handler: handle_npm_run,
    helpstr: 'npm-run [project] [script]'
  },
  'test': {
    handler: handle_test,
    helpstr: 'test [project]'
  }
};

function print_usage() {
  console.info('Usage:');
  for (let key in commands) {
    console.info('mldevel ' + commands[key].helpstr);
  }
}

// terminal color codes
let ccc = {
  Reset: '\x1b[0m',
  Bright: '\x1b[1m',
  Dim: '\x1b[2m',
  Underscore: '\x1b[4m',
  Blink: '\x1b[5m',
  Reverse: '\x1b[7m',
  Hidden: '\x1b[8m',
  FgBlack: '\x1b[30m',
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
  FgMagenta: '\x1b[35m',
  FgCyan: '\x1b[36m',
  FgWhite: '\x1b[37m',
  BgBlack: '\x1b[40m',
  BgRed: '\x1b[41m',
  BgGreen: '\x1b[42m',
  BgYellow: '\x1b[43m',
  BgBlue: '\x1b[44m',
  BgMagenta: '\x1b[45m',
  BgCyan: '\x1b[46m',
  BgWhite: '\x1b[47m'
};

let X = read_json_file(__dirname + '/projects.json');
let Projects = [];
let Projects_by_name = {};
for (let i in X.projects) {
  let P = new Project(X.projects[i]);
  Projects.push(P);
  Projects_by_name[P.name()] = P;
}

CLP = new CLParams(process.argv);
if ('help' in CLP.namedParameters) {
  print_usage();
  return;
}
let arg1 = CLP.unnamedParameters[0] || 'info';
let arg2 = CLP.unnamedParameters[1] || '';
let arg3 = CLP.unnamedParameters[2] || '';

if (arg1 in commands) {
  commands[arg1].handler();
} else {
  console.error(`Invalid command: ${arg1}`);
  process.exit(-1);
}

function Project(config) {
  let that = this;

  this.name = function() {
    return config.name;
  };
  this.repo = function() {
    return config.repo;
  };
  this.present = function() {
    return present();
  };
  this.languages = function() {
    let ret = [];
    if (m_package_json) ret.push('javascript');
    if (m_setup_py_text) ret.push('python');
    return ret;
  };
  this.directory = function() {
    return m_directory;
  };
  this.version=function() {
    if (m_package_json) return m_package_json.version||'';
    return '';
  };
  this.packageJson =function() {
    return JSON.parse(JSON.stringify(m_package_json));
  };
  let m_directory = DIR + '/' + config.name;
  let m_package_json = null;
  let m_setup_py_text = null;

  function present() {
    return require('fs').existsSync(m_directory);
  }

  function initialize() {
    if (!present()) return;
    if (require('fs').existsSync(m_directory + '/package.json')) {
      m_package_json = read_json_file(m_directory + '/package.json');
    }
    if (require('fs').existsSync(m_directory + '/setup.py')) {
      m_setup_py_text = read_text_file(m_directory + '/setup.py');
    }
  }
  initialize();
}

function handle_info() {
  console.info('----------------------------------------------------------');
  async.eachSeries(Projects, function(P, cb) {
    if ((arg2)&&(arg2!=P.name())) {
      cb();
      return;
    }
    let str = '';
    let color = ccc.FgCyan;
    if (P.present()) {
      str+=`(${P.version()})`;
    }
    else {
      color = ccc.FgRed
      str += '[MISSING]'
    }
    console.info(color + P.name(), ' ', str, ccc.Reset);
    if (!P.present()) {
      cb();
      return;
    }
    console.info('  ', 'Languages: ' + P.languages().join(' '));
    if (P.packageJson()) {
      let X=P.packageJson();
      let script_names=Object.keys(X.scripts||{});
      console.info('  ','npm scripts: '+script_names.join(', '));
    }
    console.info('');
    cb();
    
  }, function() {});
}

function handle_status() {
  console.info('----------------------------------------------------------');
  async.eachSeries(Projects, function(P, cb) {
    if ((arg2)&&(arg2!=P.name())) {
      cb();
      return;
    }
    let str = '';
    let color = ccc.FgCyan;
    if (!P.present()) {
      color = ccc.FgRed
      str += '[MISSING]'
    }
    console.info(color + P.name(), ' ', str, ccc.Reset);
    if (!P.present()) {
      cb();
      return;
    }
    run_command_and_get_output(`git status`, {
      cwd: P.directory(),
      shell: true
    }, function(err, stdout, stderr) {
      if (err) {
        console.error('Error: ' + err);
        cb();
        return;
      }
      if (stdout.split(' ').join('').split('\n').join('')=="On branch master Your branch is up-to-date with 'origin/master'. nothing to commit, working directory clean".split(' ').join('')) {
        stdout='Up-to-date.';
      }
      console.info(stdout);
      if (stderr) console.error(stderr);
      console.info('');
      cb();
    });
    
  }, function() {});
}

function handle_clone() {
  let P = Projects_by_name[arg2];
  if (!P) {
    console.error('Unrecognized project: ' + arg2);
    return;
  }
  let cmd = `git clone ${P.repo()} ${DIR}/${P.name()}`;
  run_command(cmd,{shell:true,stdio: 'inherit'});
}

function handle_npm_run() {
  let P = Projects_by_name[arg2];
  if (!P) {
    console.error('Unrecognized project: ' + arg2);
    return;
  }
  let str='run';
  if (arg3=='install') str='';
  let cmd = `npm ${str} ${arg3}`;
  run_command(cmd,{cwd:P.directory(),shell:true,stdio: 'inherit'});
}

function handle_test() {
  arg3='test';
  handle_npm_run();
}

function run_command(cmd,opts) {
  console.info(`RUNNING: ${cmd}`);
  require('child_process').spawn(cmd, opts);
}

function run_command_and_get_output(cmd, opts, callback) {
  let P = require('child_process').spawn(cmd, opts);
  let stdout = '';
  let stderr = '';
  P.stdout.on('data', function(data) {
    stdout += data.toString();
  });
  P.stderr.on('data', function(data) {
    stderr += data.toString();
  });
  P.on('close', function(code) {
    if (code!=0) {
      console.info(cmd);
      callback('Non-zero exit code: ' + code);
      return;
    }
    callback(null, stdout, stderr);
  });
}

function read_text_file(fname) {
  try {
    var txt = fs.readFileSync(fname, 'utf8');
    return txt;
  } catch (err) {
    return null;
  }
}

function read_json_file(fname) {
  try {
    var txt = fs.readFileSync(fname, 'utf8');
    return JSON.parse(txt);
  } catch (err) {
    return null;
  }
}

function CLParams(argv) {
  this.unnamedParameters = [];
  this.namedParameters = {};

  var args = argv.slice(2);
  for (var i = 0; i < args.length; i++) {
    var arg0 = args[i];
    if (arg0.indexOf('--') === 0) {
      arg0 = arg0.slice(2);
      var ind = arg0.indexOf('=');
      if (ind >= 0) {
        this.namedParameters[arg0.slice(0, ind)] = arg0.slice(ind + 1);
      } else {
        this.namedParameters[arg0] = '';
        if (i + 1 < args.length) {
          var str = args[i + 1];
          if (str.indexOf('-') != 0) {
            this.namedParameters[arg0] = str;
            i++;
          }
        }
      }
    } else if (arg0.indexOf('-') === 0) {
      arg0 = arg0.slice(1);
      this.namedParameters[arg0] = '';
    } else {
      this.unnamedParameters.push(arg0);
    }
  }
};