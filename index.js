const k8s = require('@kubernetes/client-node');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
const namespace = 'application'

const podToDelete = (podNames) => {
  let selectedPodToDelete = Math.floor(Math.random() * (podNames.length))
  //prevents chaos-monkey pod from deleting itself
  while(podNames[selectedPodToDelete].includes('pod-chaos-monkey')) {
    selectedPodToDelete = Math.floor(Math.random() * (podNames.length -1))
  }
  return podNames[selectedPodToDelete]
}

const main = async () => {
    let runMainApplication = setTimeout(async function deleteRandomPod()  {
        try {
            const podsRes = await k8sApi.listNamespacedPod(namespace, undefined, "false", undefined, undefined);
            const pods = podsRes.body.items
            let podNames = []
            // gets names of all pods in the namespace
            for (const pod of pods) {
                if (pod.metadata && pod.metadata.name) {
                  podNames.push(pod.metadata.name);
                }
              }
            console.log(podNames)
            try {
                const selectedPodName = podToDelete(podNames)
                k8sApi.deleteNamespacedPod(selectedPodName, namespace)
                console.log("Pod " + selectedPodName + " in namespace " + namespace + " has been deleted!")
            } catch (err) {
                console.log(err)
            }
    
        } catch (err) {
            console.error(err);
        }

        runMainApplication = setTimeout(deleteRandomPod, 3000)
    })
};

main();