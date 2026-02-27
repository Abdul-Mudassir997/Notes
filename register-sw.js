if ("serviceWorker" in navigator) {
  
  window.addEventListener("load", () => {
    
    navigator.serviceWorker
      .register("./service-worker.js")
      .then(registration => {
        
        console.log("Service Worker Registered");
        
        // 🔹 Detect New Update
        registration.onupdatefound = () => {
          const newWorker = registration.installing;
          
          newWorker.onstatechange = () => {
            if (newWorker.state === "installed") {
              
              if (navigator.serviceWorker.controller) {
                console.log("New update available");
                
                // Force activate new SW
                newWorker.postMessage({ type: "SKIP_WAITING" });
              }
            }
          };
        };
      })
      .catch(error => {
        console.log("SW Registration Failed:", error);
      });
    
  });
}


// 🔹 Listen for controller change and reload
navigator.serviceWorker.addEventListener("controllerchange", () => {
  window.location.reload();
});