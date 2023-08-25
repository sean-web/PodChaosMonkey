const k8s = require('@kubernetes/client-node');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
const namespace = 'test'

const main = async () => {
    try {
        const podsRes = await k8sApi.listNamespacedPod(namespace, undefined, "false", undefined, undefined, "app=snowflake");
        console.log(podsRes.body.items);
        try {
            //TODO: currently deleting all pods in namespace, we want a random selection to be deleted
            k8sApi.deleteCollectionNamespacedPod(namespace)
            console.log("Pods in namespace " + namespace + "have been deleted!")
        } catch (err) {
            console.log(err)
        }

    } catch (err) {
        console.error(err);
    }
};

main();