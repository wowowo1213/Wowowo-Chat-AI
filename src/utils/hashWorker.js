importScripts('https://cdnjs.cloudflare.com/ajax/libs/spark-md5/3.0.2/spark-md5.min.js');

self.onmessage = function (e) {
  const { file, chunkSize = 5 * 1024 * 1024 } = e.data;
  const spark = new SparkMD5.ArrayBuffer();
  const chunks = Math.ceil(file.size / chunkSize);
  let currentChunk = 0;

  const loadNextChunk = () => {
    const start = currentChunk * chunkSize;
    const end = Math.min(start + chunkSize, file.size); // 考虑边界情况，当到最后一个chunk的时候要取较小值
    const chunk = file.slice(start, end);
    const reader = new FileReader();

    reader.onload = (e) => {
      spark.append(e.target.result);
      currentChunk++;

      if (currentChunk < chunks) {
        loadNextChunk();
      } else {
        const hash = spark.end();
        self.postMessage({
          type: 'complete',
          hash,
        });
      }
    };

    reader.onerror = () => {
      self.postMessage({
        type: 'error',
        errorMessage: 'hashWorker中文件读取失败',
      });
    };

    reader.readAsArrayBuffer(chunk);
  };

  loadNextChunk();
};
