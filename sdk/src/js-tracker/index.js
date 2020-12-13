// 监听资源加载错误（Javascript Source failed to load）
window.addEventListener('error', function (event) {
  // 过滤target为window的异常，避免与上面的onerror重复
  var errorTarget = event.target;
  var errorName = errorTarget.nodeName.toUpperCase();
  if (errorTarget !== window && errorTarget.nodeName && LOAD_ERROR_TYPE[errorName]) {
    handleError(formatLoadError(errorTarget))
  } else {
    // onerror会被覆盖，因此转用Listener进行监控
    let { message, filename, lineno, colno, error } = event;
    handleError(formatRuntimerError(message, filename, lineno, colno, error))
  }
}, true);

// 监听浏览器中捕获到未处理的Promise错误
window.addEventListener('unhandledrejection', function (event) {
  handleError(event)
}, true);

// 针对Vue报错重写console.error
console.error = (function (origin) {
  return function (info) {
    var errorLog = {
      type: ERROR_CONSOLE,
      desc: info
    }
    handleError(errorLog)
    origin.call(console, info)
  }
})(console.error);

/**
 * 生成runtime错误日志
 * 
 * @param {String} message 错误信息
 * @param {String} source 发生错误的脚本URL
 * @param {Number} lineno 发生错误的行号
 * @param {Number} colno 发生错误的列号
 * @param {Object} error error对象
 * @return {Object}
 */
function formatRuntimerError(message, source, lineno, colno, error) {
  return {
    type: ERROR_RUNTIME,
    desc: message + ' at ' + source + ':' + lineno + ':' + colno,
    stack: error && error.stack ? error.stack : 'no stack' // IE <9, has no error stack
  }
}

/**
 * 生成load错误日志
 * @param {Object} errorTarget
 * @return {Object}
 */
function formatLoadError(errorTarget) {
  return {
    type: LOAD_ERROR_TYPE[errorTarget.nodeName.toUpperCase()],
    desc: errorTarget.baseURI + '@' + (errorTarget.src || errorTarget.href),
    stack: 'no stack'
  }
}

