var cluster = require("cluster");

function startWorker() {
  var worker = cluster.fork(); //复制主线程的任务也就是这个文件，然后进入了工作线程，执行这个而文件就会到else中
  console.log("cluster: worker %d started", worker.id);
}

if (cluster.isMaster) {
  require("os")
    .cpus()
    .forEach(function() {
      startWorker();
    });

  // 记录断开的工作现场，若果线程断开，应该退出
  // 等待exit事件繁衍一个新的线程替代他
  cluster.on("exit", function(worker, code, signal) {
    console.log(
      "cluster: worker %d died with exit code %d(%s)",
      worker.id,
      code,
      signal
    );
    startWorker();
  });
} else {
  // 工作线程上启动应用服务器
  require('./meadowlark.js')()
}
