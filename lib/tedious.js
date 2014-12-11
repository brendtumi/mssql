// Generated by CoffeeScript 1.6.2
(function() {
  var ConnectionPool, TYPES, createColumns, getMssqlType, getTediousType, tds, util,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ConnectionPool = require('tedious-connection-pool');

  tds = require('tedious');

  util = require('util');

  TYPES = require('./datatypes').TYPES;

  getTediousType = function(type) {
    switch (type) {
      case TYPES.VarChar:
        return tds.TYPES.VarChar;
      case TYPES.NVarChar:
        return tds.TYPES.NVarChar;
      case TYPES.Text:
        return tds.TYPES.Text;
      case TYPES.Int:
        return tds.TYPES.Int;
      case TYPES.BigInt:
        return tds.TYPES.BigInt;
      case TYPES.TinyInt:
        return tds.TYPES.TinyInt;
      case TYPES.SmallInt:
        return tds.TYPES.SmallInt;
      case TYPES.Bit:
        return tds.TYPES.Bit;
      case TYPES.Float:
        return tds.TYPES.Float;
      case TYPES.Decimal:
        return tds.TYPES.Float;
      case TYPES.Numeric:
        return tds.TYPES.Float;
      case TYPES.Real:
        return tds.TYPES.Real;
      case TYPES.Date:
        return tds.TYPES.DateTime;
      case TYPES.DateTime:
        return tds.TYPES.DateTime;
      case TYPES.DateTimeOffset:
        return tds.TYPES.DateTime;
      case TYPES.SmallDateTime:
        return tds.TYPES.SmallDateTime;
      case TYPES.UniqueIdentifier:
        return tds.TYPES.UniqueIdentifierN;
      case TYPES.Xml:
        return tds.TYPES.VarChar;
      case TYPES.Char:
        return tds.TYPES.VarChar;
      case TYPES.NChar:
        return tds.TYPES.NVarChar;
      case TYPES.NText:
        return tds.TYPES.NVarChar;
      default:
        return type;
    }
  };

  getMssqlType = function(type) {
    switch (type) {
      case tds.TYPES.Char:
        return TYPES.Char;
      case tds.TYPES.NChar:
        return TYPES.NChar;
      case tds.TYPES.VarChar:
        return TYPES.VarChar;
      case tds.TYPES.NVarChar:
        return TYPES.NVarChar;
      case tds.TYPES.Text:
        return TYPES.Text;
      case tds.TYPES.NText:
        return TYPES.NText;
      case tds.TYPES.Int:
      case tds.TYPES.IntN:
        return TYPES.Int;
      case tds.TYPES.BigInt:
        return TYPES.BigInt;
      case tds.TYPES.TinyInt:
        return TYPES.TinyInt;
      case tds.TYPES.SmallInt:
        return TYPES.SmallInt;
      case tds.TYPES.Bit:
      case tds.TYPES.BitN:
        return TYPES.Bit;
      case tds.TYPES.Float:
      case tds.TYPES.FloatN:
        return TYPES.Float;
      case tds.TYPES.Real:
        return TYPES.Real;
      case tds.TYPES.Money:
      case tds.TYPES.MoneyN:
        return TYPES.Money;
      case tds.TYPES.SmallMoney:
        return TYPES.SmallMoney;
      case tds.TYPES.Numeric:
      case tds.TYPES.NumericN:
        return TYPES.Numeric;
      case tds.TYPES.Decimal:
      case tds.TYPES.DecimalN:
        return TYPES.Decimal;
      case tds.TYPES.DateTime:
      case tds.TYPES.DateTimeN:
        return TYPES.DateTime;
      case tds.TYPES.SmallDateTime:
        return TYPES.SmallDateTime;
      case tds.TYPES.UniqueIdentifierN:
        return TYPES.UniqueIdentifier;
      case tds.TYPES.Image:
        return TYPES.Image;
      case tds.TYPES.Binary:
        return TYPES.Binary;
      case tds.TYPES.VarBinary:
        return TYPES.VarBinary;
      case tds.TYPES.Xml:
        return TYPES.Xml;
    }
  };

  createColumns = function(meta) {
    var key, out, value;

    out = {};
    for (key in meta) {
      value = meta[key];
      out[key] = {
        name: value.colName,
        size: value.dataLength,
        type: getMssqlType(value.type)
      };
    }
    return out;
  };

  module.exports = function(Connection, Request) {
    var TediousConnection, TediousRequest, _ref, _ref1;

    TediousConnection = (function(_super) {
      __extends(TediousConnection, _super);

      function TediousConnection() {
        _ref = TediousConnection.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      TediousConnection.prototype.pool = null;

      TediousConnection.prototype.connect = function(config, callback) {
        var cfg, cfg_pool, _base, _base1, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7,
          _this = this;

        cfg = {
          userName: config.user,
          password: config.password,
          server: config.server,
          options: config.options
        };
        if ((_ref1 = cfg.options) == null) {
          cfg.options = {};
        }
        if ((_ref2 = (_base = cfg.options).database) == null) {
          _base.database = config.database;
        }
        if ((_ref3 = (_base1 = cfg.options).port) == null) {
          _base1.port = config.port;
        }
        cfg_pool = (_ref4 = config.pool) != null ? _ref4 : {};
        if ((_ref5 = cfg_pool.max) == null) {
          cfg_pool.max = 10;
        }
        if ((_ref6 = cfg_pool.min) == null) {
          cfg_pool.min = 0;
        }
        if ((_ref7 = cfg_pool.idleTimeoutMillis) == null) {
          cfg_pool.idleTimeoutMillis = 30000;
        }
        this.pool = new ConnectionPool(cfg_pool, cfg);
        return this.pool.requestConnection(function(err, connection) {
          if (err && !(err instanceof Error)) {
            err = new Error(err);
          }
          if (connection != null) {
            connection.close();
          }
          return typeof callback === "function" ? callback(err) : void 0;
        });
      };

      TediousConnection.prototype.close = function(callback) {
        if (this.pool) {
          return this.pool.drain(function() {
            this.pool = null;
            return typeof callback === "function" ? callback(null) : void 0;
          });
        }
      };

      return TediousConnection;

    })(Connection);
    TediousRequest = (function(_super) {
      __extends(TediousRequest, _super);

      function TediousRequest() {
        _ref1 = TediousRequest.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      TediousRequest.prototype.connection = null;

      TediousRequest.prototype.query = function(command, callback) {
        /*
        			Execute specified sql command.
        */

        var columns, recordset, recordsets, started,
          _this = this;

        columns = {};
        recordset = [];
        recordsets = [];
        started = Date.now();
        if (!this.connection.pool) {
          callback(new Error('MSSQL connection pool was not initialized!'));
          return;
        }
        return this.connection.pool.requestConnection(function(err, connection) {
          var name, param, req, _ref2, _ref3;

          if (!err) {
            if (_this.verbose) {
              console.log("---------- sql query ----------\n    query: " + command);
            }
            req = new tds.Request(command, function(err) {
              var elapsed;

              if (err && !(err instanceof Error)) {
                err = new Error(err);
              }
              if (_this.verbose) {
                if (err) {
                  console.log("    error: " + err);
                }
                elapsed = Date.now() - started;
                console.log(" duration: " + elapsed + "ms");
                console.log("---------- completed ----------");
              }
              if (recordset) {
                Object.defineProperty(recordset, 'columns', {
                  enumerable: false,
                  value: columns
                });
              }
              connection.close();
              return typeof callback === "function" ? callback(err, _this.multiple ? recordsets : recordsets[0]) : void 0;
            });
            req.on('columnMetadata', function(metadata) {
              var col, _i, _len, _results;

              _results = [];
              for (_i = 0, _len = metadata.length; _i < _len; _i++) {
                col = metadata[_i];
                _results.push(columns[col.colName] = col);
              }
              return _results;
            });
            req.on('doneInProc', function(rowCount, more, rows) {
              if (Object.keys(columns).length === 0) {
                return;
              }
              Object.defineProperty(recordset, 'columns', {
                enumerable: false,
                value: createColumns(columns)
              });
              recordsets.push(recordset);
              recordset = [];
              return columns = {};
            });
            req.on('returnValue', function(parameterName, value, metadata) {
              if (_this.verbose) {
                if (value === tds.TYPES.Null) {
                  console.log("   output: @" + parameterName + ", null");
                } else {
                  console.log("   output: @" + parameterName + ", " + (_this.parameters[parameterName].type.name.toLowerCase()) + ", " + value);
                }
              }
              return _this.parameters[parameterName].value = value === tds.TYPES.Null ? null : value;
            });
            req.on('row', function(columns) {
              var col, exi, row, _i, _len;

              if (!recordset) {
                recordset = [];
              }
              row = {};
              for (_i = 0, _len = columns.length; _i < _len; _i++) {
                col = columns[_i];
                exi = row[col.metadata.colName];
                if (exi != null) {
                  if (exi instanceof Array) {
                    exi.push(col.value);
                  } else {
                    row[col.metadata.colName] = [exi, col.value];
                  }
                } else {
                  row[col.metadata.colName] = col.value;
                }
              }
              if (_this.verbose) {
                console.log(util.inspect(row));
                console.log("---------- --------------------");
              }
              return recordset.push(row);
            });
            _ref2 = _this.parameters;
            for (name in _ref2) {
              param = _ref2[name];
              if (!(param.io === 1)) {
                continue;
              }
              if (_this.verbose) {
                if (param.value === tds.TYPES.Null) {
                  console.log("    input: @" + param.name + ", null");
                } else {
                  console.log("    input: @" + param.name + ", " + (param.type.name.toLowerCase()) + ", " + param.value);
                }
              }
              req.addParameter(param.name, getTediousType(param.type), param.value != null ? param.value : tds.TYPES.Null);
            }
            _ref3 = _this.parameters;
            for (name in _ref3) {
              param = _ref3[name];
              if (param.io === 2) {
                req.addOutputParameter(param.name, getTediousType(param.type));
              }
            }
            if (_this.verbose) {
              console.log("---------- response -----------");
            }
            return connection.execSql(req);
          } else {
            if (connection) {
              connection.close();
            }
            return typeof callback === "function" ? callback(err) : void 0;
          }
        });
      };

      TediousRequest.prototype.execute = function(procedure, callback) {
        /*
        			Execute stored procedure with specified parameters.
        */

        var columns, recordset, recordsets, returnValue, started,
          _this = this;

        columns = {};
        recordset = [];
        recordsets = [];
        returnValue = 0;
        started = Date.now();
        if (!this.connection.pool) {
          callback(new Error('MSSQL connection pool was not initialized!'));
          return;
        }
        return this.connection.pool.requestConnection(function(err, connection) {
          var name, param, req, _ref2, _ref3;

          if (!err) {
            if (_this.verbose) {
              console.log("---------- sql execute --------\n     proc: " + procedure);
            }
            req = new tds.Request(procedure, function(err) {
              var elapsed;

              if (err && !(err instanceof Error)) {
                err = new Error(err);
              }
              if (_this.verbose) {
                if (err) {
                  console.log("    error: " + err);
                }
                elapsed = Date.now() - started;
                console.log("   return: " + returnValue);
                console.log(" duration: " + elapsed + "ms");
                console.log("---------- completed ----------");
              }
              connection.close();
              return typeof callback === "function" ? callback(err, recordsets, returnValue) : void 0;
            });
            req.on('columnMetadata', function(metadata) {
              var col, _i, _len, _results;

              _results = [];
              for (_i = 0, _len = metadata.length; _i < _len; _i++) {
                col = metadata[_i];
                _results.push(columns[col.colName] = col);
              }
              return _results;
            });
            req.on('row', function(columns) {
              var col, exi, row, _i, _len;

              if (!recordset) {
                recordset = [];
              }
              row = {};
              for (_i = 0, _len = columns.length; _i < _len; _i++) {
                col = columns[_i];
                exi = row[col.metadata.colName];
                if (exi != null) {
                  if (exi instanceof Array) {
                    exi.push(col.value);
                  } else {
                    row[col.metadata.colName] = [exi, col.value];
                  }
                } else {
                  row[col.metadata.colName] = col.value;
                }
              }
              if (_this.verbose) {
                console.log(util.inspect(row));
                console.log("---------- --------------------");
              }
              return recordset.push(row);
            });
            req.on('doneInProc', function(rowCount, more, rows) {
              Object.defineProperty(recordset, 'columns', {
                enumerable: false,
                value: createColumns(columns)
              });
              recordsets.push(recordset);
              recordset = [];
              return columns = {};
            });
            req.on('doneProc', function(rowCount, more, returnStatus, rows) {
              return returnValue = returnStatus;
            });
            req.on('returnValue', function(parameterName, value, metadata) {
              if (_this.verbose) {
                if (value === tds.TYPES.Null) {
                  console.log("   output: @" + parameterName + ", null");
                } else {
                  console.log("   output: @" + parameterName + ", " + (_this.parameters[parameterName].type.name.toLowerCase()) + ", " + value);
                }
              }
              return _this.parameters[parameterName].value = value === tds.TYPES.Null ? null : value;
            });
            _ref2 = _this.parameters;
            for (name in _ref2) {
              param = _ref2[name];
              if (!(param.io === 1)) {
                continue;
              }
              if (_this.verbose) {
                if (param.value === tds.TYPES.Null) {
                  console.log("    input: @" + param.name + ", null");
                } else {
                  console.log("    input: @" + param.name + ", " + (param.type.name.toLowerCase()) + ", " + param.value);
                }
              }
              req.addParameter(param.name, getTediousType(param.type), param.value != null ? param.value : tds.TYPES.Null);
            }
            _ref3 = _this.parameters;
            for (name in _ref3) {
              param = _ref3[name];
              if (param.io === 2) {
                req.addOutputParameter(param.name, getTediousType(param.type));
              }
            }
            if (_this.verbose) {
              console.log("---------- response -----------");
            }
            return connection.callProcedure(req);
          } else {
            if (connection) {
              connection.close();
            }
            return typeof callback === "function" ? callback(err) : void 0;
          }
        });
      };

      return TediousRequest;

    })(Request);
    return {
      connection: TediousConnection,
      request: TediousRequest
    };
  };

}).call(this);