const k8s = require('@kubernetes/client-node');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
const namespace = 'test'

const main = async () => {
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
            const podToDelete = Math.floor(Math.random() * (podNames.length -1));
            const selectedPodName = podNames[podToDelete]
            k8sApi.deleteNamespacedPod(selectedPodName, namespace)
            console.log("Pod " + selectedPodName + " in namespace " + namespace + " have been deleted!")
        } catch (err) {
            console.log(err)
        }

    } catch (err) {
        console.error(err);
    }
};

main();