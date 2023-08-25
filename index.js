const k8s = require('@kubernetes/client-node');

const NAMESPACE = 'application';
const INTERVAL = 10000;

const getRandomPodIndex = (podCount) => {
  return Math.floor(Math.random() * podCount);
};

const main = async () => {
  const kc = new k8s.KubeConfig();
  kc.loadFromDefault();
  
  const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

  const deleteRandomPod = async () => {
    try {
      const podsRes = await k8sApi.listNamespacedPod(NAMESPACE, undefined, "false", undefined, undefined);
      const pods = podsRes.body.items;
      
      const deletablePods = pods.filter(pod => !pod.metadata.name.includes('pod-chaos-monkey'));
      
      //deletes pod if a suitable one exists
      if (deletablePods.length > 0) {
        const selectedPodIndex = getRandomPodIndex(deletablePods.length);
        const selectedPodName = deletablePods[selectedPodIndex].metadata.name;

        await k8sApi.deleteNamespacedPod(selectedPodName, NAMESPACE);
        console.log(`Pod ${selectedPodName} in namespace ${NAMESPACE} has been deleted!`);
      } else {
        console.log("No deletable pods found.");
      }
    } catch (err) {
      console.error(err);
    }
    
    setTimeout(deleteRandomPod, INTERVAL);
  };
  
  deleteRandomPod(); 
};

main();
