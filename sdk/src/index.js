// 性能相关
window.onload = () => {
  // 检查是否监控性能指标
  const isPerformanceFlagOn = _.get(
    commonConfig,
    ['record', 'performance'],
    _.get(DEFAULT_CONFIG, ['record', 'performance'])
  );
  const isOldPerformanceFlagOn = _.get(commonConfig, ['performance'], false);
  const needRecordPerformance = isPerformanceFlagOn || isOldPerformanceFlagOn;
  if (needRecordPerformance === false) {
    debugLogger('config.record.performance值为false，跳过性能打点');
    return;
  }

  const performance = window.performance;
  if (!performance) {
    // 当前浏览器不支持
    console.log('你的浏览器不支持 performance 接口');
    return;
  }
  const times = performance.timing.toJSON();

  debugLogger('发送页面性能指标数据，上报内容 => ', {
    ...times,
    url: `${window.location.host}${window.location.pathname}`
  });

  log('perf', 20001, {
    ...times,
    url: `${window.location.host}${window.location.pathname}`
  });
};