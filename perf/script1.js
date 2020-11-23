console.log('script1');
var observer = new PerformanceObserver(list => {
    list.getEntries().forEach(entry => {
      // Display each reported measurement on console
      if (console) {
        console.log("Name: "       + entry.name      +
                    ", Type: "     + entry.entryType +
                    ", Start: "    + entry.startTime +
                    ", Duration: " + entry.duration  + "\n");
      }
    })
  });
  observer.observe({entryTypes: ['first-input', 'paint', 'largest-contentful-paint', 'element', 'resource', 'navigation', 'mark', 'measure', 'layout-shift']});

  function clicked(elem) {

    performance.mark('myTask:start');
    // performance.measure('button clicked', 'blah1');
    // performance.clearMarks();
    setTimeout(() => {
      performance.mark('myTask:end');
      performance.measure('myTask', 'myTask:start', 'myTask:end');
    }, 2000);

  }
